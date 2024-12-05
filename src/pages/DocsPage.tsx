import React from 'react';
import { Link } from 'react-router-dom';
import CodeBlock from '../components/ui/CodeBlock';

const DocsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-600">ShipTrack</span>
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-blue max-w-none">
          <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Authentication</h2>
            <p className="text-gray-600 mb-4">
              All API requests require authentication using a Bearer token. You can find your API key in the dashboard settings.
            </p>
            <CodeBlock
              id="auth-example"
              language="bash"
              code={`curl -H "Authorization: Bearer your-api-key" \\
  https://api.shiptrack.com/v1/tracking/TRACK123456`}
            />
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Rate Limiting</h2>
            <p className="text-gray-600 mb-4">
              The API implements rate limiting based on your subscription plan:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Basic: No API access</li>
              <li>Starter: 10,000 requests per month</li>
              <li>Professional: 50,000 requests per month</li>
              <li>Business: 200,000 requests per month</li>
              <li>Enterprise: Custom limits</li>
            </ul>
            <p className="text-gray-600 mb-4">Rate limit headers in responses:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><code>X-RateLimit-Remaining</code>: Remaining requests</li>
              <li><code>X-RateLimit-Reset</code>: Seconds until limit resets</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Endpoints</h2>

            {/* Get Tracking */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Tracking</h3>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <code className="text-sm">GET /v1/tracking/{'{trackingNumber}'}</code>
              </div>
              <p className="text-gray-600 mb-4">Retrieve tracking information for a specific shipment.</p>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Parameters</h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <code>trackingNumber</code> <span className="text-gray-600">(path parameter, required)</span>
                  <br />
                  <span className="text-sm text-gray-600">The tracking number of the shipment</span>
                </li>
              </ul>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Response</h4>
              <CodeBlock
                id="get-tracking-response"
                language="json"
                code={`{
  "id": "tracking_123",
  "trackingNumber": "TRACK123456",
  "status": "in_transit",
  "carrierId": "fedex",
  "origin": {
    "city": "New York",
    "country": "USA",
    "timestamp": "2024-01-15T10:00:00Z"
  },
  "destination": {
    "city": "Los Angeles",
    "country": "USA",
    "timestamp": "2024-01-20T15:00:00Z"
  },
  "estimatedDelivery": "2024-01-20T15:00:00Z",
  "events": [
    {
      "status": "picked_up",
      "location": {
        "city": "New York",
        "country": "USA"
      },
      "description": "Package picked up",
      "timestamp": "2024-01-15T10:00:00Z"
    }
  ]
}`}
              />
            </div>

            {/* Create Tracking */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Tracking</h3>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <code className="text-sm">POST /v1/tracking</code>
              </div>
              <p className="text-gray-600 mb-4">Create a new tracking for a shipment.</p>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Request</h4>
              <CodeBlock
                id="create-tracking-request"
                language="json"
                code={`{
  "trackingNumber": "TRACK123456",
  "carrierId": "fedex",
  "order": {
    "orderId": "ORDER789",
    "platform": {
      "id": "shopify",
      "name": "Shopify"
    },
    "buyer": {
      "name": "John Doe",
      "phoneNumber": "+1234567890",
      "address": {
        "line1": "123 Main St",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "USA"
      }
    }
  }
}`}
              />
              <h4 className="text-lg font-medium text-gray-900 mt-4 mb-2">Response</h4>
              <CodeBlock
                id="create-tracking-response"
                language="json"
                code={`{
  "id": "tracking_123",
  "trackingNumber": "TRACK123456",
  "status": "pending",
  "carrierId": "fedex",
  "events": [],
  "createdAt": "2024-01-21T10:00:00Z",
  "estimatedDelivery": "2024-01-25T15:00:00Z"
}`}
              />
            </div>

            {/* Create Alarm */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Alarm</h3>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <code className="text-sm">POST /v1/alarms</code>
              </div>
              <p className="text-gray-600 mb-4">Create a new tracking alarm with specified conditions.</p>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Request</h4>
              <CodeBlock
                id="create-alarm-request"
                language="json"
                code={`{
  "name": "Transit Time Alert",
  "scope": "specific",  // or "global"
  "trackingNumber": "TRACK123456",  // required if scope is "specific"
  "conditions": [
    {
      "type": "transit_time",
      "params": {
        "maxDays": 5
      }
    },
    {
      "type": "status_duration",
      "params": {
        "status": "in_transit",
        "durationHours": 48
      }
    }
  ],
  "notifyEmail": "alerts@example.com"
}`}
              />
              <div className="mt-4 mb-4">
                <h5 className="text-base font-medium text-gray-900 mb-2">Available Condition Types:</h5>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>
                    <code>transit_time</code> - Alert when shipment exceeds maximum transit days
                    <br />
                    <span className="text-sm">Params: maxDays (number)</span>
                  </li>
                  <li>
                    <code>status_duration</code> - Alert when shipment stays in a status for too long
                    <br />
                    <span className="text-sm">Params: status (string), durationHours (number)</span>
                  </li>
                  <li>
                    <code>description_match</code> - Alert when tracking description matches keywords
                    <br />
                    <span className="text-sm">Params: keywords (string[])</span>
                  </li>
                  <li>
                    <code>delivery_date</code> - Alert when delivery date exceeds specified date
                    <br />
                    <span className="text-sm">Params: latestDeliveryDate (ISO date string)</span>
                  </li>
                </ul>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Response</h4>
              <CodeBlock
                id="create-alarm-response"
                language="json"
                code={`{
  "id": "alarm_123",
  "name": "Transit Time Alert",
  "scope": "specific",
  "trackingNumber": "TRACK123456",
  "conditions": [
    {
      "type": "transit_time",
      "params": {
        "maxDays": 5
      }
    },
    {
      "type": "status_duration",
      "params": {
        "status": "in_transit",
        "durationHours": 48
      }
    }
  ],
  "notifyEmail": "alerts@example.com",
  "active": true,
  "createdAt": "2024-01-21T10:00:00Z"
}`}
              />
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Webhooks</h2>
            <p className="text-gray-600 mb-4">
              Webhook requests include a signature header for verification:
            </p>
            <CodeBlock
              id="webhook-example"
              language="typescript"
              code={`// Verify webhook signature
const isValid = crypto
  .createHmac('sha256', webhookSecret)
  .update(JSON.stringify(payload))
  .digest('hex') === signature;

// Example webhook payload
{
  "event": "shipment.status_updated",
  "trackingNumber": "TRACK123456",
  "status": "delivered",
  "timestamp": "2024-01-21T15:30:00Z",
  "location": {
    "city": "Los Angeles",
    "country": "USA"
  }
}`}
            />
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Error Handling</h2>
            <p className="text-gray-600 mb-4">
              The API uses conventional HTTP response codes to indicate the success or failure of an API request:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><code>200</code> - Success</li>
              <li><code>400</code> - Bad Request (invalid parameters)</li>
              <li><code>401</code> - Unauthorized (invalid API key)</li>
              <li><code>403</code> - Forbidden (insufficient permissions)</li>
              <li><code>404</code> - Not Found</li>
              <li><code>429</code> - Too Many Requests (rate limit exceeded)</li>
              <li><code>500</code> - Internal Server Error</li>
            </ul>
            <div className="mt-4">
              <CodeBlock
                id="error-example"
                language="json"
                code={`{
  "error": {
    "code": "invalid_tracking",
    "message": "Tracking number not found",
    "details": {
      "trackingNumber": "TRACK123456"
    }
  }
}`}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;