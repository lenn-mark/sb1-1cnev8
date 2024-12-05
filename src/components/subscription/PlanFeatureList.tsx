import React from 'react';
import { Check, X } from 'lucide-react';
import { PlanFeature } from '../../types/subscription';

interface PlanFeatureListProps {
  features: PlanFeature[];
}

export const PlanFeatureList: React.FC<PlanFeatureListProps> = ({ features }) => {
  return (
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          {feature.included ? (
            <Check className="h-5 w-5 text-green-500 mr-2" />
          ) : (
            <X className="h-5 w-5 text-gray-300 mr-2" />
          )}
          <span className={feature.included ? 'text-gray-900' : 'text-gray-500'}>
            {feature.name}
            {feature.limit && ` (${feature.limit})`}
          </span>
        </li>
      ))}
    </ul>
  );
};