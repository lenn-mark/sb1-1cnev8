import nodemailer from 'nodemailer';
import { z } from 'zod';

const emailConfigSchema = z.object({
  host: z.string(),
  port: z.number(),
  secure: z.boolean(),
  auth: z.object({
    user: z.string(),
    pass: z.string(),
  }),
});

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(config: z.infer<typeof emailConfigSchema>) {
    try {
      emailConfigSchema.parse(config);
      this.transporter = nodemailer.createTransport(config);
    } catch (error) {
      throw new Error('Invalid email configuration');
    }
  }

  async sendShipmentUpdate(to: string, shipmentData: {
    trackingNumber: string;
    status: string;
    location: string;
    timestamp: Date;
  }) {
    const html = `
      <h2>Shipment Update</h2>
      <p>Tracking Number: ${shipmentData.trackingNumber}</p>
      <p>Status: ${shipmentData.status}</p>
      <p>Location: ${shipmentData.location}</p>
      <p>Time: ${shipmentData.timestamp.toLocaleString()}</p>
    `;

    try {
      await this.transporter.sendMail({
        from: '"Shipment Tracking" <notifications@shipment-tracking.com>',
        to,
        subject: `Shipment Update - ${shipmentData.trackingNumber}`,
        html,
      });
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendDeliveryConfirmation(to: string, shipmentData: {
    trackingNumber: string;
    deliveryLocation: string;
    deliveryTime: Date;
  }) {
    const html = `
      <h2>Delivery Confirmation</h2>
      <p>Your shipment has been delivered!</p>
      <p>Tracking Number: ${shipmentData.trackingNumber}</p>
      <p>Delivery Location: ${shipmentData.deliveryLocation}</p>
      <p>Delivery Time: ${shipmentData.deliveryTime.toLocaleString()}</p>
    `;

    try {
      await this.transporter.sendMail({
        from: '"Shipment Tracking" <notifications@shipment-tracking.com>',
        to,
        subject: `Delivery Confirmation - ${shipmentData.trackingNumber}`,
        html,
      });
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}