import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Package, Bell, CreditCard, Settings, LogOut, AlertTriangle } from 'lucide-react';

const DashboardNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Shipments', href: '/dashboard', icon: Package },
    { name: 'Alarms', href: '/dashboard/alarms', icon: Bell },
    { name: 'Triggered', href: '/dashboard/triggered', icon: AlertTriangle },
    { name: 'Subscription', href: '/dashboard/subscription', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-semibold text-blue-600 mr-8">
              Dashboard
            </Link>
            <div className="hidden md:flex space-x-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`mr-1.5 h-5 w-5 ${
                      isActive ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">
                {user?.email}
              </span>
              <button 
                onClick={() => logout()}
                className="inline-flex items-center text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;