'use strict';

// [START functions_pubsub_publish]
const {PubSub} = require('@google-cloud/pubsub');
const {paypalToken} = require('./paypal/getToken')
const {getCheckoutData} = require('./paypal/getCheckoutData')

// Instantiates a client
const pubsub = new PubSub();

/**
 * Publishes a message to a Cloud Pub/Sub Topic
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.paymentHandler = async (req, res) => {

  let myTopic = "payment-data"
  let myMessage = {}
  let myData = {}

  // [START functions_pubsub_publish]
  // verify body params from payment webhook instead
  if (!req.body.event_type || !req.body.resource) {
    res
      .status(400)
      .send(
        'Missing parameter(s) in your request.'
      );
    return;

  }else{

    try{
      // add payment data to message
      myMessage.id = req.body.resource.id
      myMessage.type = req.body.event_type
      myMessage.status = req.body.resource.status
      myMessage.amount = req.body.resource.seller_receivable_breakdown.net_amount.value
    }catch(error){
      console.error("Unable to get all payment data, connect continue.", error)
    res
      .status(400)
      .send(
        'Unable to get all payment data, connect continue.'
      )
      return;
    }

  }

  // TODO: make additional api calls to for extra data
  try{
    const tokenResponse = await paypalToken();
    
    if(tokenResponse.access_token){
      console.log("got access token", tokenResponse.access_token)
      const checkoutDataURL = req.body.resource.links.find(item => item.href.includes("checkout/orders") )
        
      if(checkoutDataURL && checkoutDataURL.href){
        console.log("checkoutDataURL", checkoutDataURL.href)
        const checkoutData = await getCheckoutData(checkoutDataURL.href, tokenResponse.access_token)
        const payerEmail = checkoutData.payer.email_address

        // add extra data to message
        myMessage.payer_email = payerEmail
        myData.checkout = {...checkoutData}

      }else{
        console.log('no')
      }
    }
  }catch(error){
    console.error("Unable to get all payment data, connect continue.", error)
    res
      .status(400)
      .send(
        'Unable to get all payment data, connect continue.'
      )
      return;
  }


  // TODO: -- IF FAILED - send the data to an email or airtable for manual processing.

  console.log(`Publishing message to topic ${myTopic}`);

  // References an existing topic
  const topic = pubsub.topic(myTopic);
  const messageObject = {
    data: {
      message: myMessage,
    },
    attributes: {
      ...myMessage
    }
  };
  const messageBuffer = Buffer.from(JSON.stringify(messageObject), 'utf8');

  // Publishes a message
  try {
    await topic.publish(messageBuffer);
    // res.status(200).json({ myMessage, myData }).send();
    res.status(200).send('Message published');
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
    return Promise.reject(err);
  }
  // [END functions_pubsub_publish]

};