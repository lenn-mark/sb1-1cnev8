import { Location, TrackingEvent } from '../../types/shipment';

export interface TrackingUpdate {
  trackingNumber: string;
  status: string;
  location: Location;
  timestamp: Date;
  description: string;
}

export interface TrackingProvider {
  getShipmentUpdates(trackingNumber: string): Promise<TrackingEvent[]>;
  subscribeToUpdates(trackingNumber: string, callback: (update: TrackingUpdate) => void): void;
  unsubscribeFromUpdates(trackingNumber: string): void;
}

export type ShipmentStatus = 
  | 'pending'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'exception';