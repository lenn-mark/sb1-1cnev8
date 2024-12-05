import React from 'react';
import { MapPin, Phone, User } from 'lucide-react';
import { BuyerInfo } from '../../types/shipment';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface OrderDetailsProps {
  buyer: BuyerInfo;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ buyer }) => {
  const mapContainerStyle = {
    width: '100%',
    height: '300px'
  };

  const center = {
    lat: buyer.address.latitude || 0,
    lng: buyer.address.longitude || 0
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Details</h2>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <User className="h-5 w-5 text-gray-400 mt-1 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500">Buyer Name</p>
            <p className="text-sm text-gray-900">{buyer.name}</p>
          </div>
        </div>

        <div className="flex items-start">
          <Phone className="h-5 w-5 text-gray-400 mt-1 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500">Phone Number</p>
            <p className="text-sm text-gray-900">{buyer.phoneNumber}</p>
          </div>
        </div>

        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-gray-400 mt-1 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500">Delivery Address</p>
            <div className="text-sm text-gray-900">
              <p>{buyer.address.line1}</p>
              {buyer.address.line2 && <p>{buyer.address.line2}</p>}
              {buyer.address.line3 && <p>{buyer.address.line3}</p>}
              <p>
                {buyer.address.city}, {buyer.address.state} {buyer.address.postalCode}
              </p>
              <p>{buyer.address.country}</p>
            </div>
          </div>
        </div>

        {buyer.address.latitude && buyer.address.longitude && (
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

export default OrderDetails;