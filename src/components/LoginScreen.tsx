import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

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

      <div className="px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-12">
          <Globe size={32} className="text-gray-800 mr-3" strokeWidth={1.5} />
          <h1 className="text-xl font-bold text-gray-900">MEMWAR</h1>
        </div>

        {/* Login Form */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Log In</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-purple-700 transition-colors duration-200 active:scale-95 transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging In...' : 'Log In'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-600 font-semibold hover:text-purple-700">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;