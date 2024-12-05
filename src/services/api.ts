import axios from 'axios';
import { z } from 'zod';

const apiKeySchema = z.string().min(32);

export class ShipmentAPI {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string, baseURL: string = 'https://api.shipment-tracking.com/v1') {
    try {
      this.apiKey = apiKeySchema.parse(apiKey);
      this.baseURL = baseURL;
    } catch (error) {
      throw new Error('Invalid API key format');
    }
  }

  private get headers() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async getShipment(trackingNumber: string) {
    try {
      const response = await axios.get(
        `${this.baseURL}/shipments/${trackingNumber}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateWebhook(url: string, events: string[]) {
    try {
      const response = await axios.post(
        `${this.baseURL}/webhooks`,
        { url, events },
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      return new Error(`API Error: ${message}`);
    }
    return error;
  }
}