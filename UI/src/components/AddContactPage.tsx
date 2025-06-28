import React, { useState, useRef } from 'react';
import { ArrowLeft, Edit3, Camera, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../contexts/ContactContext';
import { createTrustedContact, TrustedContactRequest, Relationship } from '../api';
import { storage } from '../utils/storage';
import BottomNavigation from './BottomNavigation';

interface PhotoItem {
  id: string;
  url: string;
  title: string;
  updatedAt: string;
}

const AddContactPage: React.FC = () => {
  const navigate = useNavigate();
  const { addContact } = useContacts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = storage.getUser();
  
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    locationMet: '',
    contact: '',
    email: '',
    note: ''
  });
  
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [showSavedState, setShowSavedState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < Math.min(files.length, 10 - photos.length); i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = (event) => {
          const newPhoto: PhotoItem = {
            id: Date.now().toString() + i,
            url: event.target?.result as string,
            title: 'Title',
            updatedAt: i === 0 ? 'Updated today' : i === 1 ? 'Updated yesterday' : `Updated ${i + 1} days ago`
          };
          
          setPhotos(prev => [...prev, newPhoto]);
        };
        
        reader.readAsDataURL(file);
      }
    }
  };

  const removePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.relationship) {
      setError('Please fill in required fields');
      return;
    }

    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // Prepare the request data
      const contactData: Omit<TrustedContactRequest, 'picture'> = {
        name: formData.name,
        relationship: formData.relationship as Relationship,
        location: formData.locationMet,
        phone: formData.contact,
        email: formData.email || undefined,
        note: formData.note || undefined,
        user: user.id
      };

      // Get the first photo as image file if available
      let imageFile: File | undefined;
      if (photos.length > 0) {
        // Convert base64 to file
        const response = await fetch(photos[0].url);
        const blob = await response.blob();
        imageFile = new File([blob], 'contact-image.jpg', { type: 'image/jpeg' });
      }

      const result = await createTrustedContact(contactData, imageFile);

      if (result.success) {
        // Show saved state first
        setShowSavedState(true);
        
        // After showing saved state, add contact to local context and navigate
        setTimeout(() => {
          addContact({
            name: formData.name,
            relationship: formData.relationship,
            avatar: photos.length > 0 ? photos[0].url : 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
            notes: formData.note,
            location: formData.locationMet
          });
          
          navigate('/contacts');
        }, 2000);
      } else {
        setError(result.error || 'Failed to create contact');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/contacts');
  };

  if (showSavedState) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Saved!</h2>
          <p className="text-gray-600">Your contact has been successfully added.</p>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/contacts')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Add Contact</h1>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
              {photos.length > 0 ? (
                <img
                  src={photos[0].url}
                  alt="Contact"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 text-purple-400">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
            </div>
            <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200">
              <Edit3 size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship
            </label>
            <select
              value={formData.relationship}
              onChange={(e) => handleInputChange('relationship', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
              disabled={isLoading}
            >
              <option value="">Select</option>
              <option value="Mother">Mother</option>
              <option value="Father">Father</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Wife">Wife</option>
              <option value="Husband">Husband</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Girlfriend">Girlfriend</option>
              <option value="Boyfriend">Boyfriend</option>
              <option value="Friend">Friend</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Met
            </label>
            <input
              type="text"
              placeholder="Add a location"
              value={formData.locationMet}
              onChange={(e) => handleInputChange('locationMet', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="(000) 000 0000"
              value={formData.contact}
              onChange={(e) => handleInputChange('contact', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note
            </label>
            <textarea
              placeholder="Add a note to remember"
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              rows={3}
              maxLength={300}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">300 characters limit</p>
          </div>

          {/* Photo Upload Section */}
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors"
              disabled={isLoading}
            >
              <Camera size={20} className="mr-2 text-gray-400" />
              <span className="text-gray-600 font-medium">
                Add up to 10 photos ({photos.length}/10)
              </span>
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          {/* Photo Grid */}
          {photos.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Camera size={20} className="mr-2 text-gray-600" />
                  <span className="font-medium text-gray-900">Meeting Logs</span>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                  disabled={isLoading}
                >
                  Add Photos
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative">
                    <div className="bg-purple-100 rounded-lg p-4 aspect-square flex items-center justify-center relative">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        disabled={isLoading}
                      >
                        <X size={12} />
                      </button>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-900">{photo.title}</p>
                      <p className="text-xs text-gray-500">{photo.updatedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-8">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-purple-100 text-purple-600 py-3 rounded-full font-semibold hover:bg-purple-200 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 bg-purple-600 text-white py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default AddContactPage;