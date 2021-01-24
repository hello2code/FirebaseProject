## Cloud Functions
#### paymentHandler

- Webhook function for Paypal webhooks to call on, and publish a message to Pub/Sub
- Get Paypal payment data
- Get Paypal payer information by making additional api call to Paypal
- Publish the following message to store inside pub/sub paypal-deposit-data topic
```
 * payment id
 * event type
 * payer email
 * amount after fees
```

#### depositDataHandler
- Subscribe to the pub/sub paypal-deposit-data topic
- Send the data to Airtable for approval
- Publish the following message to store inside pub/sub paypal-deposit-approved topic

#### paymentApprovedHandler
- Subscribe to the pub/sub paypal-deposit-approved topic
- Send the data to Bubble for updating user by triggering a workflow
- Send an email to the payer about the approved amount