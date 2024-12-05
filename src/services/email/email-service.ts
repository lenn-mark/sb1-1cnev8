import nodemailer from 'nodemailer';
import { emailConfigSchema, EmailConfig, ShipmentUpdateData, DeliveryConfirmationData } from './types';
import { shipmentUpdateTemplate, deliveryConfirmationTemplate } from './templates';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(config: EmailConfig) {
    this.initializeTransporter(config);
  }

  private initializeTransporter(config: EmailConfig): void {
    try {
      emailConfigSchema.parse(config);
      this.transporter = nodemailer.createTransport(config);
    } catch (error) {
      throw new Error('Invalid email configuration');
    }
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: '"Shipment Tracking" <notifications@shipment-tracking.com>',
        to,
        subject,
        html,
      });
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendShipmentUpdate(to: string, data: ShipmentUpdateData): Promise<void> {
    const html = shipmentUpdateTemplate(data);
    await this.sendEmail(to, `Shipment Update - ${data.trackingNumber}`, html);
  }

  async sendDeliveryConfirmation(to: string, data: DeliveryConfirmationData): Promise<void> {
    const html = deliveryConfirmationTemplate(data);
    await this.sendEmail(to, `Delivery Confirmation - ${data.trackingNumber}`, html);
  }
}