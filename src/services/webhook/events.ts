import { Shipment } from '../../types/shipment';

export enum WebhookEventType {
  SHIPMENT_CREATED = 'shipment.created',
  SHIPMENT_UPDATED = 'shipment.updated',
  SHIPMENT_DELIVERED = 'shipment.delivered',
  SHIPMENT_EXCEPTION = 'shipment.exception',
  TRACKING_STARTED = 'tracking.started',
  TRACKING_UPDATED = 'tracking.updated'
}

export interface WebhookEventData {
  shipment: Shipment;
  metadata?: Record<string, unknown>;
}

export class WebhookEventManager {
  private static formatEventData(
    eventType: WebhookEventType,
    data: WebhookEventData
  ): Record<string, unknown> {
    const baseData = {
      event: eventType,
      timestamp: new Date().toISOString(),
      shipment: data.shipment,
    };

    if (data.metadata) {
      return { ...baseData, metadata: data.metadata };
    }

    return baseData;
  }

  static createShipmentEvent(shipment: Shipment): Record<string, unknown> {
    return this.formatEventData(WebhookEventType.SHIPMENT_CREATED, { shipment });
  }

  static updateShipmentEvent(
    shipment: Shipment,
    metadata?: Record<string, unknown>
  ): Record<string, unknown> {
    return this.formatEventData(WebhookEventType.SHIPMENT_UPDATED, { shipment, metadata });
  }

  static deliveryEvent(shipment: Shipment): Record<string, unknown> {
    return this.formatEventData(WebhookEventType.SHIPMENT_DELIVERED, { shipment });
  }

  static exceptionEvent(
    shipment: Shipment,
    metadata: { reason: string; details?: string }
  ): Record<string, unknown> {
    return this.formatEventData(WebhookEventType.SHIPMENT_EXCEPTION, { shipment, metadata });
  }
}