## Cloud Functions
#### paymentHandler

- Webhook function for Paypal webhooks to call on, and publish a message to Pub/Sub
- Get Paypal payment data
- Get Paypal payer information by making additional api call to Paypal
- Publish the following message to store inside pub/sub `payment-data` topic
```
 * payment id
 * event type
 * payer email
 * amount after fees
```
```Trigger by external webhook```

#### paymentDataHandler
- Subscribe to the pub/sub `payment-data` topic
- Send the data to Airtable for approval
- Publish the following message to store inside pub/sub `payment-received` topic

```Trigger by Pub/Sub topic```

#### paymentApprovedHandler
- Subscribe to the pub/sub `payment-received` topic
- Send the data to Bubble for updating user by triggering a workflow
- Send an email to the payer about the approved amount

```Trigger by Pub/Sub topic```
