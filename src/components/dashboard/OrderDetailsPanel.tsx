import React from 'react';
import { MapPin, Phone, User, Package, Store } from 'lucide-react';
import { OrderDetails } from '../../types/order';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface OrderDetailsPanelProps {
  order: OrderDetails;
}

const OrderDetailsPanel: React.FC<OrderDetailsPanelProps> = ({ order }) => {
  const mapContainerStyle = {
    width: '100%',
    height: '300px'
  };

  const center = {
    lat: order.buyer.address.latitude || 0,
    lng: order.buyer.address.longitude || 0
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Details</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start">
            <Package className="h-5 w-5 text-gray-400 mt-1 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Order ID</p>
              <p className="text-sm text-gray-900">{order.orderId}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Store className="h-5 w-5 text-gray-400 mt-1 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Platform</p>
              <p className="text-sm text-gray-900">{order.platform.name}</p>
            </div>
          </div>

          {order.shippingNumber && (
            <div className="flex items-start col-span-2">
              <Package className="h-5 w-5 text-gray-400 mt-1 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Shipping Number</p>
                <p className="text-sm text-gray-900">{order.shippingNumber}</p>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Buyer Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <User className="h-5 w-5 text-gray-400 mt-1 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-sm text-gray-900">{order.buyer.name}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-5 w-5 text-gray-400 mt-1 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                <p className="text-sm text-gray-900">{order.buyer.phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mt-1 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Delivery Address</p>
                <div className="text-sm text-gray-900">
                  <p>{order.buyer.address.line1}</p>
                  {order.buyer.address.line2 && <p>{order.buyer.address.line2}</p>}
                  {order.buyer.address.line3 && <p>{order.buyer.address.line3}</p>}
                  <p>
                    {order.buyer.address.city}, {order.buyer.address.state} {order.buyer.address.postalCode}
                  </p>
                  <p>{order.buyer.address.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {order.buyer.address.latitude && order.buyer.address.longitude && (
          <div className="mt-4">
            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={15}
              >
                <Marker position={center} />
              </GoogleMap>
            </LoadScript>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPanel;