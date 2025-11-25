'use client';

// 1. Import useRouter for navigation
import { useRouter } from 'next/navigation'; 
import apiClient from '@/api/apiClient';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';

// Corrected: Text color should be light for a dark-themed form background (bg-white/10)
const inputClasses =
  'w-full p-4 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150 ease-in-out placeholder-neutral-500 bg-neutral-800 text-white';

const labelClasses = 'text-sm font-medium text-neutral-300 block mb-2'; // Adjusted text color for dark theme

const LoginPage = () => {

  const router = useRouter();   
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
        toast.error('Please enter both email and password.');
        return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/api/auth/login', {
        email,
        password,
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Login successful!');
        
        setEmail('');
        setPassword('');
        router.push('/dashboard'); 
      } else {
        toast.error(res.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        'Login failed. Please check your credentials and try again.';

      toast.error(errorMsg);
    }

    setLoading(false);
  };

  return (
    // Adjusted: Added a dark background to make the form pop
    <main className="min-h-screen text-white flex flex-col items-center justify-center py-10 px-5">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Welcome Back Talentro</h1>
        {/* Adjusted: Copying the signup message here is confusing for a login page */}
        <p className="mt-4 text-lg text-neutral-400 max-w-xl mx-auto">
          Please sign in to access your account and continue your journey.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        // Background changed to neutral-800 for better contrast with the main background
        className="p-8 w-full max-w-lg bg-white/10 shadow-2xl rounded-xl border border-neutral-700"
      >

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

        {/* Password Field */}
        <div className="mb-2">
          <label htmlFor="password" className={labelClasses}>
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className={inputClasses}
          />
        </div>
        
        {/* Forgot Password Link */}
        <div className="flex items-end justify-end w-full text-right mb-6">
          <Link 
            href='/auth/forget-password' 
            className='text-sm text-purple-400 hover:text-purple-300 transition duration-150'
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-4 cursor-pointer text-white font-semibold rounded-lg transition duration-300 ease-in-out ${
            loading
              ? 'bg-purple-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 hover:-translate-y-0.5' // Added subtle hover effect
          }`}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>


        {/* Sign Up Link */}
        <p className="mt-6 text-center text-neutral-400">
          Don't have an account?{' '}
          <Link
            href="/auth/signup"
            className="text-purple-500 hover:text-purple-400 font-medium hover:underline transition duration-150"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;