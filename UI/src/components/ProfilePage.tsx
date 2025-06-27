import React from 'react';
import { Settings, HelpCircle, Shield, LogOut, Edit3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: Edit3, label: 'Edit Profile', action: () => navigate('/edit-profile') },
    { icon: Settings, label: 'Settings', action: () => navigate('/settings') },
    { icon: Shield, label: 'Privacy & Security', action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', action: () => {} },
    { icon: LogOut, label: 'Log Out', action: handleLogout, danger: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-4 text-sm font-medium">
        <span>9:30</span>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 bg-black rounded-sm"></div>
          <div className="w-6 h-3 border border-black rounded-sm">
            <div className="w-4 h-1 bg-black rounded-sm m-0.5"></div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-24">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

        {/* Profile Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <button 
              onClick={() => navigate('/edit-profile')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Edit3 size={20} />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className={`w-full bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between hover:bg-gray-50 transition-colors ${
                  item.danger ? 'text-red-600' : 'text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <Icon size={20} className="mr-4" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {!item.danger && (
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* App Info */}
        <div className="mt-8 text-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
            <img
              src="/bolt_logo.png.png"
              alt="Company Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          <p className="text-xs text-gray-500">memorie.io v1.0.0</p>
          <p className="text-xs text-gray-500">Powered by AI</p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;