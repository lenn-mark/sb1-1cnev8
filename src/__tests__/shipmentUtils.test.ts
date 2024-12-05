import { describe, it, expect } from 'vitest';
import { 
  getShipmentStatus, 
  formatDate, 
  getLatestEvent,
  isDelivered,
  calculateProgress 
} from '../utils/shipmentUtils';
import { Shipment, TrackingEvent } from '../types/shipment';

describe('shipmentUtils', () => {
  const mockEvent: TrackingEvent = {
    status: 'in_transit',
    location: {
      city: 'New York',
      country: 'USA',
      timestamp: new Date('2023-08-15')
    },
    description: 'Package in transit',
    timestamp: new Date('2023-08-15')
  };

  const mockShipment: Shipment = {
    id: '1',
    trackingNumber: 'TRACK123',
    carrierId: 'fedex',
    status: 'in_transit',
    origin: {
      city: 'New York',
      country: 'USA',
      timestamp: new Date('2023-08-15')
    },
    destination: {
      city: 'Los Angeles',
      country: 'USA',
      timestamp: new Date('2023-08-18')
    },
    estimatedDelivery: new Date('2023-08-18'),
    latestDeliveryDate: new Date('2023-08-18'),
    events: [mockEvent],
    order: {
      orderId: 'ORDER123',
      platform: { id: 'shopify', name: 'Shopify' },
      buyer: {
        name: 'John Doe',
        phoneNumber: '123-456-7890',
        address: {
          line1: '123 Main St',
          city: 'Los Angeles',
          state: 'CA',
          postalCode: '90001',
          country: 'USA'
        }
      }
    }
  };

  it('should format shipment status correctly', () => {
    expect(getShipmentStatus(mockShipment)).toBe('In_transit');
  });

  it('should format date correctly', () => {
    const date = new Date('2023-08-15T10:00:00');
    expect(formatDate(date)).toBe('Aug 15, 2023 10:00');
  });

  it('should get latest event correctly', () => {
    const events = [
      { ...mockEvent, timestamp: new Date('2023-08-15') },
      { ...mockEvent, timestamp: new Date('2023-08-16') }
    ];
    const latest = getLatestEvent(events);
    expect(latest?.timestamp).toEqual(new Date('2023-08-16'));
  });

  it('should check if shipment is delivered', () => {
    expect(isDelivered({ ...mockShipment, status: 'delivered' })).toBe(true);
    expect(isDelivered(mockShipment)).toBe(false);
  });

  it('should calculate progress correctly', () => {
    expect(calculateProgress({ ...mockShipment, status: 'pending' })).toBe(0);
    expect(calculateProgress({ ...mockShipment, status: 'in_transit' })).toBe(50);
    expect(calculateProgress({ ...mockShipment, status: 'delivered' })).toBe(100);
  });
});