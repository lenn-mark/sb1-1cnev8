export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: string;
  status: string;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shipment {
  id: string;
  userId: string;
  trackingNumber: string;
  carrierId: string;
  status: string;
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  estimatedDelivery?: Date;
  latestDeliveryDate?: Date;
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  shipmentId: string;
  orderId: string;
  platformId: string;
  platformName: string;
  buyerName: string;
  buyerPhone?: string;
  buyerEmail?: string;
  addressLine1: string;
  addressLine2?: string;
  addressCity: string;
  addressState: string;
  addressPostalCode: string;
  addressCountry: string;
  addressLatitude?: number;
  addressLongitude?: number;
  createdAt: Date;
}

export interface TrackingEvent {
  id: string;
  shipmentId: string;
  status: string;
  description: string;
  city: string;
  country: string;
  timestamp: Date;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShipmentTag {
  shipmentId: string;
  tagId: string;
  createdAt: Date;
}

export interface Alarm {
  id: string;
  userId: string;
  name: string;
  scope: 'global' | 'specific';
  trackingNumber?: string;
  notifyEmail: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlarmCondition {
  id: string;
  alarmId: string;
  type: string;
  params: Record<string, any>;
  createdAt: Date;
}

export interface TriggeredShipment {
  id: string;
  alarmId: string;
  shipmentId: string;
  triggeredAt: Date;
}

export interface Settings {
  userId: string;
  notificationPreferences: Record<string, any>;
  webhookUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}