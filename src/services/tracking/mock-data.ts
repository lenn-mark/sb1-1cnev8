import { ShipmentStatus } from './types';
import { Location } from '../../types/shipment';

export const locations: Location[] = [
  { city: 'New York', country: 'USA', timestamp: new Date() },
  { city: 'Los Angeles', country: 'USA', timestamp: new Date() },
  { city: 'Chicago', country: 'USA', timestamp: new Date() },
  { city: 'Miami', country: 'USA', timestamp: new Date() },
  { city: 'Houston', country: 'USA', timestamp: new Date() }
];

export const statusDescriptions: Record<ShipmentStatus, string[]> = {
  pending: [
    'Package information received',
    'Shipping label created',
    'Awaiting pickup'
  ],
  picked_up: [
    'Package picked up by courier',
    'Package received at origin facility',
    'Shipment picked up'
  ],
  in_transit: [
    'Package in transit to next facility',
    'Package departed from sorting facility',
    'Package arrived at intermediate location'
  ],
  out_for_delivery: [
    'Package out for delivery',
    'On vehicle for delivery',
    'Delivery attempt will be made today'
  ],
  delivered: [
    'Package delivered',
    'Delivered to recipient',
    'Successfully delivered to destination'
  ],
  exception: [
    'Delivery attempt failed',
    'Address not found',
    'Weather delay',
    'Package damaged'
  ]
};