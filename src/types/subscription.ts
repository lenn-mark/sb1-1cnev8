export type PlanFeature = {
  name: string;
  included: boolean;
  limit?: number;
};

export type SubscriptionTier = {
  id: string;
  name: string;
  price: number | 'Contact Us';
  billingPeriod: 'monthly' | 'yearly';
  shipmentLimit: number;
  features: PlanFeature[];
  recommended?: boolean;
};

export type SubscriptionStatus = {
  currentPlan: string;
  shipmentCount: number;
  nextBillingDate: Date;
  isActive: boolean;
};