import React, { useState } from 'react';
import { subscriptionPlans } from '../../utils/subscriptionUtils';
import { PlanCard } from './PlanCard';

const UpgradePlan: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    // Here you would typically integrate with your payment provider
    console.log(`Selected plan: ${planId}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Upgrade Your Plan</h2>
        <p className="mt-2 text-gray-600">Choose the plan that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {subscriptionPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onSelect={handlePlanSelect}
            isSelected={selectedPlan === plan.id}
          />
        ))}
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Need help choosing a plan? Contact our sales team</p>
      </div>
    </div>
  );
};

export default UpgradePlan;