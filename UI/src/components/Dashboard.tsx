import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useContacts } from '../contexts/ContactContext';
import { Camera, ChevronRight, X } from 'lucide-react';
import BottomNavigation from './BottomNavigation';
import CameraModal from './CameraModal';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { recentContacts } = useContacts();
  const [showCamera, setShowCamera] = useState(false);

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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-12 h-12 rounded-full object-cover mr-3"
            />
            <div>
              <p className="text-sm text-gray-600">Hello</p>
              <h1 className="text-lg font-semibold text-gray-900">{user?.name}</h1>
            </div>
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <img
              src="/bolt_logo.png.png"
              alt="Company Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
        </div>

        {/* Main Feature */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Who's That Face?</h2>
          
          <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Who's around you? Let's find out.
            </h3>
            <p className="text-gray-600 mb-6">
              Take a quick snap to find out if you've seen someone familiar.
            </p>
            
            <button
              onClick={() => setShowCamera(true)}
              className="w-full bg-purple-600 text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-purple-700 transition-colors duration-200 active:scale-95 transform flex items-center justify-center"
            >
              <Camera className="mr-2" size={20} />
              Take a Snap
            </button>
          </div>
        </div>

        {/* Recent Contacts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              People you saw today ({recentContacts.length})
            </h3>
            <ChevronRight size={20} className="text-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {recentContacts.map((contact) => (
              <div key={contact.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-16 h-16 rounded-full object-cover mb-3"
                  />
                  <p className="text-xs text-gray-500 mb-1">{contact.relationship}</p>
                  <h4 className="font-semibold text-gray-900 mb-1">{contact.name}</h4>
                  <p className="text-xs text-gray-500">{contact.lastSeen}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraModal onClose={() => setShowCamera(false)} />
      )}

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;