import React, { useState } from 'react';
import { subscriptionPlans } from '../../utils/subscriptionUtils';
import { PlanCard } from './PlanCard';

export const SubscriptionPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    const plan = subscriptionPlans.find(p => p.id === planId);
    
    if (plan?.price === 'Contact Us') {
      // Handle enterprise plan selection
      window.location.href = 'mailto:sales@example.com?subject=Enterprise Plan Inquiry';
    } else {
      // Handle regular plan selection
      console.log(`Selected plan: ${planId}`);
      // Here you would typically integrate with your payment provider
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Subscription Plans</h2>
        <p className="mt-4 text-lg text-gray-600">
          Choose the perfect plan for your shipping needs
        </p>
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

      <div className="mt-12 text-center text-gray-600">
        <p>All plans include:</p>
        <ul className="mt-2">
          <li>24/7 customer support</li>
          <li>99.9% uptime guarantee</li>
          <li>Secure data encryption</li>
        </ul>
      </div>
    </div>
  );
};