## Shipment Tracking API Documentation

### Authentication

All API requests require authentication using a Bearer token:

\`\`\`
Authorization: Bearer your-api-key
\`\`\`

### Rate Limiting

The API implements rate limiting based on your subscription plan:
- Basic: No API access
- Starter: 10,000 requests per month
- Professional: 50,000 requests per month
- Business: 200,000 requests per month
- Enterprise: Custom limits

Rate limit headers in responses:
- \`X-RateLimit-Remaining\`: Remaining requests
- \`X-RateLimit-Reset\`: Seconds until limit resets

### Endpoints

#### Get Shipment
\`\`\`
GET /v1/shipments/{trackingNumber}
\`\`\`

Response:
\`\`\`json
{
  "trackingNumber": "TRACK123",
  "status": "in_transit",
  "events": [
    {
      "status": "picked_up",
      "timestamp": "2023-08-15T10:00:00Z",
      "location": "New York, USA"
    }
  ]
}
\`\`\`

#### Update Webhook
\`\`\`
POST /v1/webhooks
\`\`\`

Request:
\`\`\`json
{
  "url": "https://your-domain.com/webhook",
  "events": ["shipment.created", "shipment.delivered"]
}
\`\`\`

Response:
\`\`\`json
{
  "id": "webhook_123",
  "url": "https://your-domain.com/webhook",
  "events": ["shipment.created", "shipment.delivered"],
  "active": true
}
\`\`\`

### Webhook Events

Available webhook events:
- \`shipment.created\`: New shipment created
- \`shipment.updated\`: Shipment status updated
- \`shipment.delivered\`: Shipment delivered
- \`shipment.exception\`: Delivery exception occurred
- \`tracking.started\`: Tracking initiated
- \`tracking.updated\`: Tracking information updated

### Security

Webhook requests include a signature header for verification:
\`X-Webhook-Signature: sha256-hash\`

Verify the signature using your webhook secret:
\`\`\`typescript
const isValid = crypto
  .createHmac('sha256', webhookSecret)
  .update(JSON.stringify(payload))
  .digest('hex') === signature;
\`\`\`