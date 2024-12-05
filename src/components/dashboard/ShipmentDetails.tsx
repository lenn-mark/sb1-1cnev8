import React from 'react';
import { useParams } from 'react-router-dom';
import { Package, MapPin, Calendar, Bell, AlertTriangle } from 'lucide-react';
import { formatDate } from '../../utils/shipmentUtils';
import { useTags } from '../../hooks/useTags';
import TagSelector from '../tags/TagSelector';
import OrderDetails from './OrderDetails';
import CarrierBadge from './CarrierBadge';

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'in_transit':
      return 'bg-blue-100 text-blue-800';
    case 'out_for_delivery':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};

const ShipmentDetails: React.FC = () => {
  const { id } = useParams();
  const { 
    tags, 
    createTag, 
    addTagToShipment, 
    removeTagFromShipment, 
    getShipmentTags 
  } = useTags();

  // Sample data - in a real app, this would come from your API
  const shipment = {
    id,
    trackingNumber: 'SHIP123456789',
    carrierId: 'fedex',
    status: 'in_transit',
    origin: {
      city: 'New York',
      country: 'USA',
      timestamp: new Date('2024-01-15T10:00:00')
    },
    destination: {
      city: 'Los Angeles',
      country: 'USA',
      timestamp: new Date('2024-01-18T15:00:00')
    },
    estimatedDelivery: new Date('2024-01-18T15:00:00'),
    latestDeliveryDate: new Date('2024-01-18T15:00:00'),
    events: [
      {
        status: 'Order Placed',
        location: {
          city: 'New York',
          country: 'USA',
          timestamp: new Date('2024-01-15T10:00:00')
        },
        description: 'Package has been processed and is ready for pickup',
        timestamp: new Date('2024-01-15T10:00:00')
      },
      {
        status: 'In Transit',
        location: {
          city: 'Chicago',
          country: 'USA',
          timestamp: new Date('2024-01-16T14:30:00')
        },
        description: 'Package is in transit to the next facility',
        timestamp: new Date('2024-01-16T14:30:00')
      }
    ],
    order: {
      orderId: 'ORD987654',
      platform: {
        id: 'shopify',
        name: 'Shopify'
      },
      buyer: {
        name: 'John Doe',
        phoneNumber: '+1 (555) 123-4567',
        address: {
          line1: '123 Main Street',
          line2: 'Apt 4B',
          city: 'Los Angeles',
          state: 'CA',
          postalCode: '90001',
          country: 'USA',
          latitude: 34.0522,
          longitude: -118.2437
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {shipment.trackingNumber}
                </h2>
                <span className="text-sm text-gray-500">
                  (ID: {shipment.id})
                </span>
              </div>
              <div className="mt-1 flex items-center space-x-2">
                <CarrierBadge 
                  carrierId={shipment.carrierId} 
                  trackingNumber={shipment.trackingNumber}
                />
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(shipment.status)}`}>
                  {shipment.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Order ID:</span>
              <span className="text-sm font-medium">{shipment.order.orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Platform:</span>
              <span className="text-sm font-medium">{shipment.order.platform.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Buyer:</span>
              <span className="text-sm font-medium">{shipment.order.buyer.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Contact:</span>
              <span className="text-sm font-medium">{shipment.order.buyer.phoneNumber}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <TagSelector
            availableTags={tags}
            selectedTags={getShipmentTags(shipment.id)}
            onAddTag={(tagId) => addTagToShipment(shipment.id, tagId)}
            onRemoveTag={(tagId) => removeTagFromShipment(shipment.id, tagId)}
            onCreateTag={createTag}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipment Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Shipment Details</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mt-1 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">From</p>
                <p className="text-sm text-gray-900">{shipment.origin.city}, {shipment.origin.country}</p>
                <p className="text-xs text-gray-500">{formatDate(shipment.origin.timestamp)}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mt-1 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">To</p>
                <p className="text-sm text-gray-900">{shipment.destination.city}, {shipment.destination.country}</p>
                <p className="text-xs text-gray-500">{formatDate(shipment.destination.timestamp)}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-gray-400 mt-1 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Estimated Delivery</p>
                <p className="text-sm text-gray-900">{formatDate(shipment.estimatedDelivery)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <OrderDetails buyer={shipment.order.buyer} />
      </div>

      {/* Tracking Timeline */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Tracking History</h3>
        <div className="space-y-8">
          {shipment.events.map((event, index) => (
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
      </div>
    </div>
  );
};

export default ShipmentDetails;