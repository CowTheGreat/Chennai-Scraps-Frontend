import { useState } from 'react';
import { authAPI } from '../services/api';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const digitsOnlyPhone = phone.replace(/\D/g, '').slice(-10);
  const canSendOtp = digitsOnlyPhone.length === 10;

  if (!isOpen) return null;

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.sendOTP(digitsOnlyPhone);
      setIsNewUser(!!response?.is_new_user);
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
      const response = await authAPI.verifyOTP(
        digitsOnlyPhone,
        otp,
        isNewUser ? referralCode : '',
        isNewUser ? fullName : ''
      );
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      localStorage.setItem('phone', digitsOnlyPhone);
      localStorage.setItem('profile_display_name', response?.user?.full_name || fullName || '');
      onLoginSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          {step === 'phone' ? 'Login with your mobile number' : 'Enter OTP'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP}>
            <div className="w-full mb-4 border-2 border-green-500 rounded-lg flex items-center overflow-hidden">
              <span className="px-3 py-3 bg-gray-50 border-r text-gray-700 font-medium">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="99999 99999"
                className="w-full px-4 py-3 focus:outline-none"
                required
              />
            </div>

            <p className="text-sm text-gray-600 mb-6">
              By signing in, I agree to{' '}
              <a href="#" className="text-blue-600 underline">T&C</a>
              {' '}and{' '}
              <a href="#" className="text-blue-600 underline">Privacy Policy</a>
            </p>

            <button
              type="submit"
              disabled={loading || !canSendOtp}
              className={`w-full text-white py-3 rounded-xl text-2xl font-semibold transition-colors ${
                canSendOtp ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 hover:bg-gray-500'
              } disabled:cursor-not-allowed`}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <p className="text-gray-600 mb-4">OTP sent to +91 {digitsOnlyPhone}</p>

            {isNewUser && (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name *"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            )}

            {isNewUser && (
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase().trim())}
                placeholder="Referral Code (optional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
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
              onClick={() => {
                setStep('phone');
                setReferralCode('');
                setFullName('');
                setIsNewUser(false);
              }}
              className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400"
            >
              Change Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
