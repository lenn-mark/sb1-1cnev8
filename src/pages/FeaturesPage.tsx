import React from 'react';
import Features from '../components/landing/Features';
import Navbar from '../components/landing/Navbar';

const FeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Features />
    </div>
  );
};

export default FeaturesPage;