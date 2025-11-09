import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiBook, FiArrowRight } from 'react-icons/fi';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back! 🎉');
      navigate('/notes');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      toast.success('Welcome! 🎉');
      navigate('/notes');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google login failed');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login was cancelled or failed');
  };

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Left Panel - Minimal Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        
        <div className="relative z-10 flex flex-col justify-between p-8 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <FiBook className="w-4 h-4 text-slate-900" />
            </div>
            <span className="text-white text-lg font-semibold">ScholarSync</span>
          </Link>

          {/* Center Content */}
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
              Your notes.<br />Your success.<br />One platform.
            </h2>
            <p className="text-slate-400 text-base">
              Join thousands of students sharing knowledge and achieving their goals together.
            </p>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-bold text-white mb-1">50K+</div>
              <div className="text-slate-500 text-xs">Notes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">15K+</div>
              <div className="text-slate-500 text-xs">Students</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">200+</div>
              <div className="text-slate-500 text-xs">Subjects</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md py-4">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <FiBook className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-900 text-lg font-semibold">ScholarSync</span>
          </Link>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-slate-600">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 pl-9 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  placeholder="name@company.com"
                />
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pl-9 pr-9 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  placeholder="••••••••"
                />
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <FiEye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 border-2 border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-slate-900 focus:ring-offset-0 transition-all"
                />
                <span className="ml-1.5 text-xs text-slate-700 group-hover:text-slate-900 transition-colors">
                  Remember me
                </span>
              </label>
              <button className="text-xs font-medium text-slate-900 hover:text-slate-700 transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-2.5 text-sm rounded-lg font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>{loading ? 'Signing in...' : 'Sign in'}</span>
                {!loading && (
                  <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-slate-50 text-slate-500">or continue with</span>
            </div>
          </div>

          {/* Google Login Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="384"
            />
          </div>

          {/* Sign Up Link */}
          <p className="mt-5 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-slate-900 hover:text-slate-700 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;