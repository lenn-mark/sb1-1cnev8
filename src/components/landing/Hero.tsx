import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, MapPin, Bell } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Track Your Shipments</span>
                <span className="block text-blue-600">In Real Time</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Get real-time updates, notifications, and insights for all your shipments in one place. Perfect for businesses and individuals.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    to="/signup"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    to="/pricing"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                  >
                    View Pricing
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Animated Illustration */}
      <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="relative h-full">
          {/* Animated Elements */}
          <div className="relative h-full flex items-center justify-center">
            {/* Central Package Icon */}
            <div className="absolute p-6 bg-white rounded-2xl shadow-xl animate-float">
              <Package className="h-16 w-16 text-blue-500" />
            </div>

            {/* Orbiting Elements */}
            <div className="absolute w-96 h-96">
              {/* Location Pin */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white rounded-xl shadow-lg animate-orbit-1">
                <MapPin className="h-8 w-8 text-red-500" />
              </div>

              {/* Notification Bell */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 p-4 bg-white rounded-xl shadow-lg animate-orbit-2">
                <Bell className="h-8 w-8 text-yellow-500" />
              </div>

              {/* Arrow */}
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 p-4 bg-white rounded-xl shadow-lg animate-orbit-3">
                <ArrowRight className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;