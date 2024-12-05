import { OrderDetails } from './order';

export interface BuyerAddress {
  line1: string;
  line2?: string;
  line3?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface BuyerInfo {
  name: string;
  phoneNumber: string;
  address: BuyerAddress;
}

export interface Location {
  city: string;
  country: string;
  timestamp: Date;
}

export interface TrackingEvent {
  status: string;
  location: Location;
  description: string;
  timestamp: Date;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  carrierId: string;
  status: string;
  origin: Location;
  destination: Location;
  estimatedDelivery: Date;
  latestDeliveryDate: Date;
  events: TrackingEvent[];
  internalNotes?: string;
  order: OrderDetails;
}