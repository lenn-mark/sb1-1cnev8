import React from 'react';
import Pricing from '../components/landing/Pricing';
import Navbar from '../components/landing/Navbar';

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Pricing />
    </div>
  );
};

export default PricingPage;