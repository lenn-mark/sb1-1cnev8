import React from 'react';
import { SubscriptionTier } from '../../types/subscription';
import { PlanFeatureList } from './PlanFeatureList';
import { formatPrice } from '../../utils/subscriptionUtils';

interface PlanCardProps {
  plan: SubscriptionTier;
  onSelect: (planId: string) => void;
  isSelected?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onSelect,
  isSelected = false,
}) => {
  return (
    <div
      className={`relative p-6 rounded-lg border ${
        plan.recommended
          ? 'border-blue-500 shadow-lg'
          : 'border-gray-200'
      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      {plan.recommended && (
        <div className="absolute top-0 right-0 -translate-y-1/2 px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
          Recommended
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
        <div className="mt-2">
          <span className="text-3xl font-bold text-gray-900">
            {formatPrice(plan.price)}
          </span>
          {typeof plan.price === 'number' && (
            <span className="text-gray-500">/{plan.billingPeriod}</span>
          )}
        </div>
        <p className="mt-2 text-gray-500">
          Up to {plan.shipmentLimit === Infinity ? 'unlimited' : plan.shipmentLimit} shipments
        </p>
      </div>

      <PlanFeatureList features={plan.features} />

      <button
        onClick={() => onSelect(plan.id)}
        className={`mt-6 w-full py-2 px-4 rounded-md ${
          typeof plan.price === 'number'
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
        } transition-colors duration-200`}
      >
        {typeof plan.price === 'number' ? 'Select Plan' : 'Contact Sales'}
      </button>
    </div>
  );
};