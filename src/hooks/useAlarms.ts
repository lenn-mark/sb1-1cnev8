import { useState, useEffect } from 'react';
import { Alarm } from '../services/alarms/types';
import { Shipment } from '../types/shipment';

interface TriggeredShipments {
  [alarmId: string]: {
    alarm: Alarm;
    shipments: Shipment[];
  };
}

export const useAlarms = () => {
  const [triggeredShipments, setTriggeredShipments] = useState<TriggeredShipments>({
    '1': {
      alarm: {
        id: '1',
        name: 'Global Transit Time Alert',
        scope: 'global',
        conditions: [
          {
            type: 'transit_time',
            params: { maxDays: 20 }
          }
        ],
        active: true,
        notifyEmail: 'alerts@example.com',
        createdAt: new Date('2024-01-10')
      },
      shipments: [
        {
          id: '1',
          trackingNumber: 'SHIP789012',
          status: 'in_transit',
          origin: {
            city: 'New York',
            country: 'USA',
            timestamp: new Date('2024-01-01')
          },
          destination: {
            city: 'Los Angeles',
            country: 'USA',
            timestamp: new Date('2024-01-25')
          },
          estimatedDelivery: new Date('2024-01-25'),
          events: [
            {
              status: 'in_transit',
              location: {
                city: 'Chicago',
                country: 'USA',
                timestamp: new Date('2024-01-15')
              },
              description: 'Package in transit',
              timestamp: new Date('2024-01-15')
            }
          ]
        }
      ]
    },
    '2': {
      alarm: {
        id: '2',
        name: 'Damage Alert',
        scope: 'global',
        conditions: [
          {
            type: 'description_match',
            params: { keywords: ['damaged', 'lost'] }
          }
        ],
        active: true,
        notifyEmail: 'alerts@example.com',
        createdAt: new Date('2024-01-10')
      },
      shipments: [
        {
          id: '2',
          trackingNumber: 'SHIP345678',
          status: 'exception',
          origin: {
            city: 'Miami',
            country: 'USA',
            timestamp: new Date('2024-01-10')
          },
          destination: {
            city: 'Seattle',
            country: 'USA',
            timestamp: new Date('2024-01-20')
          },
          estimatedDelivery: new Date('2024-01-20'),
          events: [
            {
              status: 'exception',
              location: {
                city: 'Atlanta',
                country: 'USA',
                timestamp: new Date('2024-01-15')
              },
              description: 'Package reported damaged during transit',
              timestamp: new Date('2024-01-15')
            }
          ]
        }
      ]
    }
  });

  const removeTriggeredShipment = (alarmId: string, shipmentId: string) => {
    setTriggeredShipments(prev => {
      const alarm = prev[alarmId];
      if (!alarm) return prev;

      const updatedShipments = alarm.shipments.filter(s => s.id !== shipmentId);
      
      if (updatedShipments.length === 0) {
        const { [alarmId]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [alarmId]: {
          ...alarm,
          shipments: updatedShipments
        }
      };
    });
  };

  return {
    triggeredShipments,
    setTriggeredShipments,
    removeTriggeredShipment
  };
};