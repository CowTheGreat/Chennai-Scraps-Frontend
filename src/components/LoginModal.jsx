import { useState } from 'react';
import { authAPI } from '../services/api';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await authAPI.sendOTP(phone);
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.verifyOTP(phone, otp);
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      localStorage.setItem('phone', phone);
      onLoginSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {step === 'phone' ? 'Login' : 'Verify OTP'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP}>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="91XXXXXXXXXX"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <p className="text-gray-600 mb-4">OTP sent to {phone}</p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.slice(0, 6))}
              placeholder="000000"
              maxLength="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 mb-2"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400"
            >
              Back
            </button>
          </form>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full text-gray-600 hover:text-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
}
