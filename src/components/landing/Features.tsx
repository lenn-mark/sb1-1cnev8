import React from 'react';
import { Globe, Bell, Shield, Clock } from 'lucide-react';

const features = [
  {
    name: 'Real-time Tracking',
    description: 'Track your shipments in real-time with detailed status updates and location information.',
    icon: Globe,
  },
  {
    name: 'Instant Notifications',
    description: 'Receive instant notifications via email or webhooks when your shipment status changes.',
    icon: Bell,
  },
  {
    name: 'Secure Platform',
    description: 'Enterprise-grade security ensuring your shipping data is always protected.',
    icon: Shield,
  },
  {
    name: '24/7 Monitoring',
    description: 'Continuous monitoring of your shipments with automated alerts for any delays or issues.',
    icon: Clock,
  },
];

const Features: React.FC = () => {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to track shipments
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Comprehensive shipment tracking solution for businesses of all sizes
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;