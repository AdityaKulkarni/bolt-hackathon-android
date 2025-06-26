import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const floatingFaces = [
    { src: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', delay: '0s', position: 'top-32 right-16' },
    { src: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', delay: '0.5s', position: 'top-48 right-4' },
    { src: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', delay: '1s', position: 'top-96 left-8' },
    { src: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', delay: '1.5s', position: 'bottom-80 right-8' },
    { src: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', delay: '2s', position: 'bottom-96 left-16' },
    { src: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', delay: '2.5s', position: 'bottom-64 right-20' },
    { src: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', delay: '3s', position: 'top-64 left-4' },
    { src: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', delay: '3.5s', position: 'bottom-48 left-4' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
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

      {/* Floating Face Photos */}
      {floatingFaces.map((face, index) => (
        <div
          key={index}
          className={`absolute ${face.position} animate-bounce`}
          style={{
            animationDelay: face.delay,
            animationDuration: '3s',
            animationIterationCount: 'infinite'
          }}
        >
          <img
            src={face.src}
            alt="Face"
            className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-white"
          />
        </div>
      ))}

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-8 relative z-10">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
            <Globe size={64} className="text-gray-800" strokeWidth={1.5} />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-wide">
          MEMWAR
        </h1>

        {/* Tagline */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16 leading-tight max-w-sm">
          Remember the faces that matter.
        </h2>

        {/* Bolt Badge */}
        <div className="mb-16">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">b</span>
          </div>
          <p className="text-xs text-gray-600 text-center mt-2 max-w-20">
            POWERED BY BOLT NEW AI AGENT
          </p>
        </div>

        {/* Get Started Button */}
        <button
          onClick={() => navigate('/login')}
          className="w-full max-w-sm bg-purple-600 text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-purple-700 transition-colors duration-200 active:scale-95 transform"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;