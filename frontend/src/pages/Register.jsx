import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiArrowRight, FiCheckCircle, FiBook } from 'react-icons/fi';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Account created successfully! 🎉');
      navigate('/notes');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      toast.success('Welcome to ScholarSync! 🎉');
      navigate('/notes');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google sign up failed');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google sign up was cancelled or failed');
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
              Start your journey.<br />Share knowledge.<br />Achieve more.
            </h2>
            <p className="text-slate-400 text-base mb-5">
              Join thousands of students sharing knowledge together.
            </p>

            {/* Features List */}
            <div className="space-y-2">
              {[
                'Upload unlimited notes for free',
                'Access 50K+ study materials',
                'Connect with study groups',
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-slate-300 text-sm">
                  <FiCheckCircle className="w-4 h-4 text-white shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
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

      {/* Right Panel - Register Form */}
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
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Create your account
            </h1>
            <p className="text-sm text-slate-600">
              Start sharing and accessing study materials today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pl-9 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  placeholder="John Doe"
                />
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pl-9 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  placeholder="••••••••"
                />
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pl-9 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  placeholder="••••••••"
                />
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="w-3.5 h-3.5 mt-0.5 border-2 border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-slate-900 focus:ring-offset-0 transition-all"
              />
              <label htmlFor="terms" className="ml-1.5 block text-xs text-slate-700">
                I agree to the{' '}
                <button type="button" className="font-medium text-slate-900 hover:text-slate-700 transition-colors">
                  Terms
                </button>{' '}
                and{' '}
                <button type="button" className="font-medium text-slate-900 hover:text-slate-700 transition-colors">
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-2.5 text-sm rounded-lg font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                {!loading && (
                  <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
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
              text="signup_with"
              shape="rectangular"
              width="384"
            />
          </div>

          {/* Sign In Link */}
          <p className="mt-4 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-slate-900 hover:text-slate-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
