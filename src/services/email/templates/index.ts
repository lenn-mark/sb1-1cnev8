export const shipmentUpdateTemplate = (data: {
  trackingNumber: string;
  status: string;
  location: string;
  timestamp: Date;
}): string => `
  <h2>Shipment Update</h2>
  <p>Tracking Number: ${data.trackingNumber}</p>
  <p>Status: ${data.status}</p>
  <p>Location: ${data.location}</p>
  <p>Time: ${data.timestamp.toLocaleString()}</p>
`;

export const deliveryConfirmationTemplate = (data: {
  trackingNumber: string;
  deliveryLocation: string;
  deliveryTime: Date;
}): string => `
  <h2>Delivery Confirmation</h2>
  <p>Your shipment has been delivered!</p>
  <p>Tracking Number: ${data.trackingNumber}</p>
  <p>Delivery Location: ${data.deliveryLocation}</p>
  <p>Delivery Time: ${data.deliveryTime.toLocaleString()}</p>
`;