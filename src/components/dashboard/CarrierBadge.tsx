import React from 'react';
import { useCarriers } from '../../hooks/useCarriers';

interface CarrierBadgeProps {
  carrierId: string;
  trackingNumber?: string;
}

const CarrierBadge: React.FC<CarrierBadgeProps> = ({ carrierId, trackingNumber }) => {
  const { getCarrierById, getTrackingUrl } = useCarriers();
  const carrier = getCarrierById(carrierId);
  const trackingUrl = trackingNumber ? getTrackingUrl(carrierId, trackingNumber) : null;

  if (!carrier) return null;

  const Badge = () => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      {carrier.logo ? (
        <img src={carrier.logo} alt={carrier.name} className="w-4 h-4 mr-1" />
      ) : null}
      {carrier.name}
    </span>
  );

  return trackingUrl ? (
    <a
      href={trackingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:opacity-75"
    >
      <Badge />
    </a>
  ) : (
    <Badge />
  );
};

export default CarrierBadge;