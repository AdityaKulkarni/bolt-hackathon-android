import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2 } from 'lucide-react';
import { useContacts } from '../contexts/ContactContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BottomNavigation from './BottomNavigation';

const ContactsPage: React.FC = () => {
  const { contacts, deleteContact } = useContacts();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.relationship.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 pb-24 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button onClick={() => navigate('/profile')}>
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover mr-3 hover:opacity-80 transition-opacity"
              />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          </div>
          <button
            onClick={() => navigate('/add-contact')}
            className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Contacts List */}
        <div className="space-y-4">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate(`/edit-contact/${contact.id}`)}
                  className="flex items-center flex-1 text-left hover:bg-gray-50 transition-colors rounded-lg p-2 -m-2"
                >
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-500">{contact.relationship}</p>
                    {contact.lastSeen && (
                      <p className="text-xs text-gray-400">{contact.lastSeen}</p>
                    )}
                  </div>
                </button>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => navigate(`/edit-contact/${contact.id}`)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No contacts found' : 'No contacts yet'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate('/add-contact')}
                className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
              >
                Add Your First Contact
              </button>
            )}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ContactsPage;