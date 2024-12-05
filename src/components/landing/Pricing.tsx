import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { subscriptionPlans } from '../../utils/subscriptionUtils';

const Pricing: React.FC = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the perfect plan for your shipping needs
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-5">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-sm divide-y divide-gray-200 bg-white ${
                plan.recommended ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="p-6">
                {plan.recommended && (
                  <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-blue-100 text-blue-600 mb-4">
                    Recommended
                  </span>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                  </span>
                  {typeof plan.price === 'number' && (
                    <span className="text-base font-medium text-gray-500">/{plan.billingPeriod}</span>
                  )}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Up to {plan.shipmentLimit === Infinity ? 'unlimited' : plan.shipmentLimit} shipments
                </p>

                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-gray-300 shrink-0" />
                      )}
                      <span className="ml-3 text-sm text-gray-700">
                        {feature.name}
                        {feature.limit && ` (${feature.limit})`}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link
                    to="/signup"
                    className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                      typeof plan.price === 'number'
                        ? 'text-white bg-blue-600 hover:bg-blue-700'
                        : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                    }`}
                  >
                    {typeof plan.price === 'number' ? 'Get started' : 'Contact sales'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600">
            All plans include 24/7 support, real-time tracking, and secure data encryption.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;