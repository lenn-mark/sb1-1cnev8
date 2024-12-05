import { APIClient } from './client';
import { ShipmentResponse, WebhookResponse } from './types';

export class ShipmentAPI extends APIClient {
  async getShipment(trackingNumber: string): Promise<ShipmentResponse> {
    return this.get<ShipmentResponse>(`/shipments/${trackingNumber}`);
  }

  async updateWebhook(url: string, events: string[]): Promise<WebhookResponse> {
    return this.post<WebhookResponse>('/webhooks', { url, events });
  }
}