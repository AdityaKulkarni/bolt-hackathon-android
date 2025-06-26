import React, { useState, useRef, useEffect } from 'react';
import { X, Camera } from 'lucide-react';
import { useContacts } from '../contexts/ContactContext';

interface CameraModalProps {
  onClose: () => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ onClose }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recognizedContact, setRecognizedContact] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { contacts, recordSighting } = useContacts();

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
        
        // Simulate face recognition
        simulateFaceRecognition();
      }
    }
  };

  const simulateFaceRecognition = () => {
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      // For demo, randomly select a contact
      const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
      setRecognizedContact({
        ...randomContact,
        lastSeenText: 'last seen 3 days ago'
      });
      setIsProcessing(false);
    }, 2000);
  };

  const saveSnap = () => {
    if (recognizedContact) {
      recordSighting(recognizedContact.id, 'Current Location');
    }
    onClose();
  };

  const deleteSnap = () => {
    setCapturedImage(null);
    setRecognizedContact(null);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-t-3xl w-full h-full max-w-md mx-auto relative">
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

        {/* Recognition Results */}
        {capturedImage && (
          <div className="px-6">
            {isProcessing ? (
              <div className="bg-gray-50 rounded-2xl p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Recognizing face...</p>
              </div>
            ) : recognizedContact ? (
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  You just saw {recognizedContact.name}
                </h3>
                <p className="text-gray-600 mb-6 flex items-center">
                  <span className="text-yellow-500 mr-2">👑</span>
                  Your {recognizedContact.relationship.toLowerCase()} — {recognizedContact.lastSeenText}
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={deleteSnap}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Delete Snap
                  </button>
                  <button
                    onClick={saveSnap}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Save Snap
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-6 text-center">
                <p className="text-gray-600">No familiar faces detected</p>
                <button
                  onClick={deleteSnap}
                  className="mt-4 bg-gray-100 text-gray-700 py-3 px-6 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CameraModal;