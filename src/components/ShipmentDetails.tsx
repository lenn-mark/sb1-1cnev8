import React from 'react';
import { Shipment } from '../types/shipment';
import { formatDate, getShipmentStatus } from '../utils/shipmentUtils';
import { ShipmentProgress } from './ShipmentProgress';
import { TrackingTimeline } from './TrackingTimeline';

interface ShipmentDetailsProps {
  shipment: Shipment;
}

export const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({ shipment }) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Tracking Number: {shipment.trackingNumber}
        </h1>
        <p className="text-lg text-blue-600 font-semibold">
          Status: {getShipmentStatus(shipment)}
        </p>
      </div>

      <div className="mb-8">
        <ShipmentProgress shipment={shipment} />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">From</h2>
          <p className="text-gray-600">{shipment.origin.city}</p>
          <p className="text-gray-600">{shipment.origin.country}</p>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(shipment.origin.timestamp)}
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">To</h2>
          <p className="text-gray-600">{shipment.destination.city}</p>
          <p className="text-gray-600">{shipment.destination.country}</p>
          <p className="text-sm text-gray-500 mt-1">
            Expected: {formatDate(shipment.estimatedDelivery)}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Tracking History</h2>
        <TrackingTimeline events={shipment.events} />
      </div>
    </div>
  );
};