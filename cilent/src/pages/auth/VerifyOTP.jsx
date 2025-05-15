import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaKey, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { verifyOTP } from '../../api/api'
import Navbar from '../../components/LandingPage/Navbar'

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);
  
  useEffect(() => {
    if (location?.state) {
      setUserData(location?.state);
      setTimeLeft(300); // Reset timer when new OTP is sent
      setCanResend(false);
      
      if (location?.state?.successMessage) {
        setSuccessMessage(location?.state?.successMessage);
        
        // Auto-hide the success message after 5 seconds
        const timer = setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    } else {
      navigate('/forgot-pass');
    }
  }, [location.state, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }
    
    try {
      const data = { 
        otp,
        email: userData?.email || location.state?.email,
        newPassword
      };
    //   console.log('--> Verification data:', data);
      const response = await verifyOTP(data);
      
      
      // Redirect to login page on success
      if (response?.status === 200) {
        navigate('/login', { 
          state: { 
            successMessage: 'Password reset successful. Please login with your new password.' 
          } 
        });
      } else {
        setError('Password reset failed. Please try again.');
      }
      
    } catch (err) {
      console.error('OTP verification error:', err);
      
      // Handle error responses
      if (err.response) {
        setError(err.response.data.message || 'Invalid OTP');
      } else if (err.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Verify OTP Form Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-zinc-800 rounded-xl border border-zinc-700 shadow-xl overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 px-6 py-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
              <p className="text-indigo-200">Enter OTP and your new password</p>
            </div>
            
            {/* Form Body */}
            <div className="p-6">
              {/* Success Message */}
              {successMessage && (
                <div className="mb-6 p-3 bg-green-600/20 border border-green-500 rounded-md text-green-200 text-center">
                  {successMessage}
                </div>
              )}
              
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-200 text-center">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* OTP Field */}
                <div className="space-y-2">
                  <label htmlFor="otp" className="block text-sm font-medium text-zinc-300">
                    OTP Code
                    <span className="float-right text-zinc-400">
                      {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaKey className="text-zinc-500" />
                    </div>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                      placeholder="Enter OTP code"
                    />
                  </div>
                </div>

                {/* New Password Field */}
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-zinc-300">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-zinc-500" />
                    </div>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash className="text-zinc-500" /> : <FaEye className="text-zinc-500" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-zinc-500" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash className="text-zinc-500" /> : <FaEye className="text-zinc-500" />}
                    </button>
                  </div>
                </div>
              
                {/* Submit Button with Loading State */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full px-4 py-3 ${
                      isLoading ? 'bg-indigo-700 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                    } rounded-md font-medium transition duration-300 flex items-center justify-center`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Resetting Password...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </div>

                {/* Resend OTP Link */}
                <div className="text-center mt-4">
                  <button 
                    type="button"
                    onClick={() => navigate('/forgot-pass')}
                    disabled={!canResend}
                    className={`text-indigo-400 hover:text-indigo-300 text-sm ${!canResend && 'opacity-50 cursor-not-allowed'}`}
                  >
                    {canResend ? "Didn't receive code? Request again" : "Please wait before requesting new code"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="mt-8 text-center text-zinc-500 text-sm">
            <p>© 2025 ComsiConnect Connect. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default VerifyOTP