import axios from 'axios';
import { apiKeySchema, APIHeaders, ShipmentResponse, WebhookResponse } from './types';
import { APIErrorHandler } from './error-handler';

export class APIClient {
  private readonly headers: APIHeaders;
  private readonly baseURL: string;

  constructor(apiKey: string, baseURL: string = 'https://api.shipment-tracking.com/v1') {
    this.validateApiKey(apiKey);
    this.baseURL = baseURL;
    this.headers = this.createHeaders(apiKey);
  }

  private validateApiKey(apiKey: string): void {
    try {
      apiKeySchema.parse(apiKey);
    } catch (error) {
      throw new Error('Invalid API key format');
    }
  }

  private createHeaders(apiKey: string): APIHeaders {
    return {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  protected async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await axios.get<T>(
        `${this.baseURL}${endpoint}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      throw APIErrorHandler.handle(error);
    }
  }

  protected async post<T>(endpoint: string, data: unknown): Promise<T> {
    try {
      const response = await axios.post<T>(
        `${this.baseURL}${endpoint}`,
        data,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      throw APIErrorHandler.handle(error);
    }
  }
}