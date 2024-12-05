import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, X } from 'lucide-react';
import { formatDate } from '../../utils/shipmentUtils';
import { Alarm } from '../../services/alarms/types';
import { Shipment } from '../../types/shipment';
import { DataTable } from '../ui/DataTable';
import { useTags } from '../../hooks/useTags';
import TagBadge from '../tags/TagBadge';
import ConfirmDialog from '../ui/ConfirmDialog';

interface AlarmTriggeredShipmentsProps {
  alarm: Alarm;
  shipments: Shipment[];
  onRemoveShipment: (shipmentId: string) => void;
}

const AlarmTriggeredShipments: React.FC<AlarmTriggeredShipmentsProps> = ({
  alarm,
  shipments,
  onRemoveShipment
}) => {
  const { getShipmentTags } = useTags();
  const [shipmentToRemove, setShipmentToRemove] = useState<string | null>(null);

  const handleRemoveClick = (shipmentId: string) => {
    setShipmentToRemove(shipmentId);
  };

  const handleConfirmRemove = () => {
    if (shipmentToRemove) {
      onRemoveShipment(shipmentToRemove);
      setShipmentToRemove(null);
    }
  };

  const columns = [
    {
      key: 'trackingNumber' as keyof Shipment,
      header: 'Tracking Number',
      sortable: true,
      render: (value: string, item: Shipment) => (
        <div className="space-y-1">
          <Link to={`/dashboard/shipments/${item.id}`} className="text-blue-600 hover:text-blue-800">
            {value}
          </Link>
          <div className="flex flex-wrap gap-1">
            {getShipmentTags(item.id).map(tag => (
              <TagBadge
                key={tag.id}
                tag={tag}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      key: 'status' as keyof Shipment,
      header: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'delivered' ? 'bg-green-100 text-green-800' :
          value === 'in_transit' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value.replace('_', ' ').toUpperCase()}
        </span>
      ),
    },
    {
      key: 'origin' as keyof Shipment,
      header: 'Origin',
      render: (value: any) => `${value.city}, ${value.country}`,
    },
    {
      key: 'destination' as keyof Shipment,
      header: 'Destination',
      render: (value: any) => `${value.city}, ${value.country}`,
    },
    {
      key: 'events' as keyof Shipment,
      header: 'Last Event',
      render: (events: any[]) => {
        const lastEvent = events[events.length - 1];
        return lastEvent ? (
          <div>
            <div className="text-sm text-gray-900">{lastEvent.description}</div>
            <div className="text-xs text-gray-500">{formatDate(lastEvent.timestamp)}</div>
          </div>
        ) : null;
      },
    },
    {
      key: 'id' as keyof Shipment,
      header: 'Actions',
      render: (_: any, item: Shipment) => (
        <button
          onClick={() => handleRemoveClick(item.id)}
          className="text-gray-400 hover:text-gray-500"
          title="Remove from triggered shipments"
        >
          <X className="h-5 w-5" />
        </button>
      ),
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {alarm.name}
            </h3>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            {shipments.length} shipments
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Triggered by: {alarm.conditions.map(c => {
            switch (c.type) {
              case 'transit_time':
                return `Transit time exceeded ${c.params.maxDays} days`;
              case 'description_match':
                return `Found keywords: ${c.params.keywords?.join(', ')}`;
              case 'status_duration':
                return `Status "${c.params.status}" for over ${c.params.durationHours}h`;
              default:
                return '';
            }
          }).join(', ')}
        </p>
      </div>

      <div className="p-4">
        <DataTable
          data={shipments}
          columns={columns}
          searchable={true}
          searchKeys={['trackingNumber', 'status']}
          itemsPerPage={5}
        />
      </div>

      <ConfirmDialog
        isOpen={!!shipmentToRemove}
        title="Remove Triggered Shipment"
        message="Are you sure you want to remove this shipment from the triggered list? This action cannot be undone."
        onConfirm={handleConfirmRemove}
        onCancel={() => setShipmentToRemove(null)}
      />
    </div>
  );
};

export default AlarmTriggeredShipments;