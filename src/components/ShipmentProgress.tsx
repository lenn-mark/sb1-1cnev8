import React from 'react';
import { Shipment } from '../types/shipment';
import { calculateProgress } from '../utils/shipmentUtils';

interface ShipmentProgressProps {
  shipment: Shipment;
}

export const ShipmentProgress: React.FC<ShipmentProgressProps> = ({ shipment }) => {
  const progress = calculateProgress(shipment);

  return (
    <div className="w-full">
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-sm text-gray-600">
        <span>Order Placed</span>
        <span>In Transit</span>
        <span>Delivered</span>
      </div>
    </div>
  );
};