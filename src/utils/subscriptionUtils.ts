import { SubscriptionTier } from '../types/subscription';

export const subscriptionPlans: SubscriptionTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    billingPeriod: 'monthly',
    shipmentLimit: 50,
    features: [
      { name: 'Real-time tracking', included: true },
      { name: 'Email notifications', included: false },
      { name: 'Basic analytics', included: true },
      { name: 'API access', included: false },
      { name: 'Webhook support', included: false },
      { name: 'Custom branding', included: false },
      { name: 'Alert monitoring', included: false },
      { name: 'Shipment tags', included: false },
    ]
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 79,
    billingPeriod: 'monthly',
    shipmentLimit: 200,
    features: [
      { name: 'Real-time tracking', included: true },
      { name: 'Email notifications', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'API access', included: true, limit: 10000 },
      { name: 'Webhook support', included: true },
      { name: 'Custom branding', included: false },
      { name: 'Alert monitoring', included: false },
      { name: 'Shipment tags', included: false },
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 199,
    billingPeriod: 'monthly',
    shipmentLimit: 1000,
    recommended: true,
    features: [
      { name: 'Real-time tracking', included: true },
      { name: 'Email notifications', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'API access', included: true, limit: 50000 },
      { name: 'Webhook support', included: true },
      { name: 'Custom branding', included: true },
      { name: 'Alert monitoring', included: true, limit: 50 },
      { name: 'Shipment tags', included: true, limit: 10 },
    ]
  },
  {
    id: 'business',
    name: 'Business',
    price: 499,
    billingPeriod: 'monthly',
    shipmentLimit: 5000,
    features: [
      { name: 'Real-time tracking', included: true },
      { name: 'Email & SMS notifications', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Priority API access', included: true, limit: 200000 },
      { name: 'Advanced webhook support', included: true },
      { name: 'Custom branding', included: true },
      { name: 'Alert monitoring', included: true, limit: 200 },
      { name: 'Shipment tags', included: true, limit: 50 },
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Contact Us',
    billingPeriod: 'monthly',
    shipmentLimit: Infinity,
    features: [
      { name: 'Unlimited tracking', included: true },
      { name: 'Priority support', included: true },
      { name: 'Custom integration', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'Custom solutions', included: true },
      { name: 'Custom branding', included: true },
      { name: 'Unlimited alert monitoring', included: true },
      { name: 'Unlimited shipment tags', included: true },
    ]
  }
];

export const formatPrice = (price: number | 'Contact Us'): string => {
  if (price === 'Contact Us') return 'Contact Us';
  return `$${price}`;
};

export const isWithinShipmentLimit = (
  currentCount: number,
  planLimit: number
): boolean => {
  return currentCount <= planLimit;
};