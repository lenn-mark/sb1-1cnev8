import { Shipment, TrackingEvent } from '../types/shipment';
import { format } from 'date-fns';

export const getShipmentStatus = (shipment: Shipment): string => {
  return shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1);
};

export const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy HH:mm');
};

export const getLatestEvent = (events: TrackingEvent[]): TrackingEvent | null => {
  if (events.length === 0) return null;
  return events.reduce((latest, current) => 
    current.timestamp > latest.timestamp ? current : latest
  );
};

export const isDelivered = (shipment: Shipment): boolean => {
  return shipment.status.toLowerCase() === 'delivered';
};

export const calculateProgress = (shipment: Shipment): number => {
  const statusMap: { [key: string]: number } = {
    'pending': 0,
    'picked_up': 25,
    'in_transit': 50,
    'out_for_delivery': 75,
    'delivered': 100
  };
  
  return statusMap[shipment.status.toLowerCase()] || 0;
};