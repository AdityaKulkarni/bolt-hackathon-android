import React, { useState, useRef, useEffect } from 'react';
import { X, Camera } from 'lucide-react';
import { useContacts } from '../contexts/ContactContext';
import { useNavigate } from 'react-router-dom';

interface CameraModalProps {
  onClose: () => void;
}

type ModalState = 'camera' | 'processing' | 'recognized' | 'unknown' | 'not-remembered';

const CameraModal: React.FC<CameraModalProps> = ({ onClose }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recognizedContact, setRecognizedContact] = useState<any>(null);
  const [modalState, setModalState] = useState<ModalState>('camera');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { contacts, recordSighting } = useContacts();
  const navigate = useNavigate();

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        setModalState('processing');
        
        // Simulate face recognition
        simulateFaceRecognition();
      }
    }
  };

  const simulateFaceRecognition = () => {
    setTimeout(() => {
      // Simulate different scenarios
      const scenario = Math.random();
      
      if (scenario < 0.4 && contacts.length > 0) {
        // Known contact recognized
        const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
        setRecognizedContact(randomContact);
        setModalState('recognized');
      } else if (scenario < 0.7) {
        // Unknown face
        setModalState('unknown');
      } else {
        // User doesn't remember
        setModalState('not-remembered');
      }
    }, 2000);
  };

  const handleSaveSnap = () => {
    if (recognizedContact) {
      recordSighting(recognizedContact.id, 'Current Location');
    }
    onClose();
  };

  const handleDeleteSnap = () => {
    setCapturedImage(null);
    setRecognizedContact(null);
    setModalState('camera');
  };

  const handleTakeAnotherSnap = () => {
    setCapturedImage(null);
    setRecognizedContact(null);
    setModalState('camera');
  };

  const handleAddToMemoryList = () => {
    // Close modal and navigate to add contact page
    onClose();
    navigate('/add-contact');
  };

  const handleNoIDont = () => {
    setModalState('not-remembered');
  };

  const handleYesIKnowIt = () => {
    // Simulate finding the contact
    if (contacts.length > 0) {
      const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
      setRecognizedContact(randomContact);
      setModalState('recognized');
    }
  };

  const renderContent = () => {
    switch (modalState) {
      case 'camera':
        return (
          <>
            {/* Camera/Image Display */}
            <div className="px-6 mb-6">
              <div className="relative bg-gray-200 rounded-2xl overflow-hidden aspect-square">
                {!capturedImage ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={capturePhoto}
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-4 shadow-lg hover:bg-gray-50 transition-colors"
                    >
                      <Camera size={24} className="text-gray-800" />
                    </button>
                  </>
                ) : (
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </>
        );

      case 'processing':
        return (
          <div className="px-6 flex-1 flex items-center justify-center">
            <div className="bg-purple-50 rounded-2xl p-8 text-center w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-6"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Checking if this is someone you've met before...
              </h3>
              <button
                onClick={onClose}
                className="w-full bg-purple-600 text-white py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors mt-4"
              >
                Cancel
              </button>
            </div>
          </div>
        );

      case 'not-remembered':
        return (
          <div className="px-6 flex-1 flex flex-col">
            <div className="relative bg-gray-200 rounded-2xl overflow-hidden aspect-square mb-6">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="bg-purple-50 rounded-2xl p-6 text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Did you remember who this was?
              </h3>
              <p className="text-gray-600 mb-6">
                We'll help you keep track of your memory score
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleNoIDont}
                  className="flex-1 bg-purple-100 text-purple-600 py-3 rounded-full font-semibold hover:bg-purple-200 transition-colors"
                >
                  No, I didn't
                </button>
                <button
                  onClick={handleYesIKnowIt}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
                >
                  Yes, I knew it!
                </button>
              </div>
            </div>
          </div>
        );

      case 'recognized':
        return (
          <div className="px-6 flex-1 flex flex-col">
            <div className="relative bg-gray-200 rounded-2xl overflow-hidden aspect-square mb-6">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                You just saw {recognizedContact?.name}
              </h3>
              <p className="text-gray-600 mb-6 flex items-center">
                <span className="text-yellow-500 mr-2">👑</span>
                Your {recognizedContact?.relationship?.toLowerCase()} — last seen 3 days ago
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteSnap}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                >
                  Delete Snap
                </button>
                <button
                  onClick={handleSaveSnap}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
                >
                  Save Snap
                </button>
              </div>
            </div>
          </div>
        );

      case 'unknown':
        return (
          <div className="px-6 flex-1 flex flex-col">
            <div className="relative bg-gray-200 rounded-2xl overflow-hidden aspect-square mb-6">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="bg-purple-50 rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                New face spotted!
              </h3>
              <p className="text-gray-600 mb-6">
                Hmm, this face isn't in your memory yet. Want to add them?
              </p>
              
              <button
                onClick={handleAddToMemoryList}
                className="w-full bg-purple-600 text-white py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors mb-3"
              >
                Add to Memory List
              </button>
              
              <button
                onClick={handleTakeAnotherSnap}
                className="w-full bg-purple-100 text-purple-600 py-3 rounded-full font-semibold hover:bg-purple-200 transition-colors"
              >
                Take Another Snap
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-t-3xl w-full h-full max-w-md mx-auto relative flex flex-col">
        <div className="pt-4">
          {/* Header */}
          <div className="flex items-center justify-between px-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Who's That Face?</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {renderContent()}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CameraModal;