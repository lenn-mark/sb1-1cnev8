import React from 'react';
import { TrackingEvent } from '../types/shipment';
import { formatDate } from '../utils/shipmentUtils';

interface TrackingTimelineProps {
  events: TrackingEvent[];
}

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ events }) => {
  return (
    <div className="space-y-8">
      {events.map((event, index) => (
        <div key={index} className="relative pl-8 border-l-2 border-gray-200">
          <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-0" />
          <div className="mb-1">
            <span className="font-semibold text-gray-900">{event.status}</span>
            <span className="ml-2 text-sm text-gray-500">{formatDate(event.timestamp)}</span>
          </div>
          <p className="text-gray-600">{event.description}</p>
          <p className="text-sm text-gray-500">
            {event.location.city}, {event.location.country}
          </p>
        </div>
      ))}
    </div>
  );
};