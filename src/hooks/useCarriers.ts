import { useState } from 'react';
import { Carrier, predefinedCarriers } from '../types/carrier';

export const useCarriers = () => {
  const [carriers, setCarriers] = useState<Carrier[]>(predefinedCarriers);
  const [customCarriers, setCustomCarriers] = useState<Carrier[]>([]);

  const addCustomCarrier = (carrier: Omit<Carrier, 'id'>) => {
    const newCarrier: Carrier = {
      ...carrier,
      id: `custom_${Date.now()}`
    };
    setCustomCarriers([...customCarriers, newCarrier]);
  };

  const getAllCarriers = () => [...carriers, ...customCarriers];

  const getCarrierById = (id: string) => 
    getAllCarriers().find(carrier => carrier.id === id);

  const getTrackingUrl = (carrierId: string, trackingNumber: string) => {
    const carrier = getCarrierById(carrierId);
    if (!carrier?.trackingUrlTemplate) return null;
    
    return carrier.trackingUrlTemplate.replace('{tracking_number}', trackingNumber);
  };

  return {
    carriers: getAllCarriers(),
    addCustomCarrier,
    getCarrierById,
    getTrackingUrl
  };
};