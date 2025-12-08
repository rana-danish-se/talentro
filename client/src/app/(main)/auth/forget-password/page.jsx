'use client';

import apiClient from '@/api/apiClient';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';

// Reusing Tailwind classes for consistency
const inputClasses =
  'w-full p-4 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150 ease-in-out placeholder-neutral-500 bg-neutral-800 text-white';
const labelClasses = 'text-sm font-medium text-neutral-300 block mb-2';

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');


  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient.post('/api/auth/forgot-password', { email });
      if (res.data.success) {
        setMessage(
          'If an account with that email exists, a password reset link has been sent.'
        );
        toast.success('Reset email sent successfully!');
        setEmail('');
      } else {
        toast.error(res.data.message || 'Could not initiate password reset.');
      }
    } catch (error) {
      setMessage(
        'If an account with that email exists, a password reset link has been sent.'
      );
      toast.success('Reset process initiated.'); 
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen  text-white flex flex-col items-center justify-center py-10 px-5">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Reset Your Password</h1>
        <p className="mt-4 text-lg text-neutral-400 max-w-xl mx-auto">
          Enter your email address below and we'll send you a link to reset your password.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-8 w-full max-w-md bg-white/10 shadow-2xl rounded-xl border border-neutral-700"
      >
        {/* Success/Error Message Display */}
        {message && (
          <div className="mb-6 p-3 text-sm text-green-400 bg-green-900/50 border border-green-700 rounded-lg">
            {message}
          </div>
        )}

        {/* Email Field */}
        <div className="mb-6">
          <label htmlFor="email" className={labelClasses}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            name="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className={inputClasses}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 cursor-pointer text-white font-semibold rounded-lg transition duration-300 ease-in-out ${
            loading
              ? 'bg-purple-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 hover:-translate-y-0.5'
          }`}
        >
          {loading ? 'Sending Link...' : 'Send Reset Link'}
        </button>

        {/* Back to Login Link */}
        <p className="mt-6 text-center text-neutral-400">
          <Link
            href="/auth/login" // Assuming your login route is /login
            className="text-purple-500 hover:text-purple-400 font-medium hover:underline"
          >
            ← Back to Login
          </Link>
        </p>
      </form>
    </main>
  );
};

export default ForgotPasswordPage;