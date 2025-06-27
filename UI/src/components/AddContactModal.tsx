import React, { useState, useRef } from 'react';
import { X, Camera, Upload } from 'lucide-react';
import { useContacts } from '../contexts/ContactContext';

interface AddContactModalProps {
  onClose: () => void;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ onClose }) => {
  const { addContact } = useContacts();
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [avatar, setAvatar] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !relationship) {
      alert('Please fill in all required fields');
      return;
    }

    addContact({
      name,
      relationship,
      avatar: avatar || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      notes: ''
    });

    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Add Contact</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <Camera size={32} className="text-gray-400" />
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <Upload size={16} className="mr-2" />
                Upload
              </button>
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className="flex items-center px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <Camera size={16} className="mr-2" />
                Camera
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter full name"
              required
            />
          </div>

          {/* Relationship */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship *
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Select relationship</option>
              <option value="Spouse">Spouse</option>
              <option value="Partner">Partner</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Grandson">Grandson</option>
              <option value="Granddaughter">Granddaughter</option>
              <option value="Friend">Friend</option>
              <option value="Neighbor">Neighbor</option>
              <option value="Caregiver">Caregiver</option>
              <option value="Doctor">Doctor</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Add Contact
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddContactModal;