'use client';

import apiClient from '@/api/apiClient';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
const inputClasses =
  'w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150 ease-in-out placeholder-gray-500 text-black';
const labelClasses = 'text-sm font-medium text-neutral-400 block mb-2';

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient.post('/api/auth/register', {
        email,
        password,
        firstName,
        lastName,
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Registration successful!');
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
      } else {
        toast.error(res.data.message || 'Something went wrong');
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        'Registration failed. Please try again.';

      toast.error(errorMsg);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen   flex flex-col items-center justify-center py-10 px-5">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">Welcome To Talentro</h1>
        <p className="mt-4 text-lg text-neutral-400 max-w-xl mx-auto">
          Join our platform today! Fill out the form below to create your
          account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit} // Attach the onSubmit handler
        className="p-8  w-full max-w-lg bg-white/10  shadow-2xl rounded-xl border border-neutral-600"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* First Name Field */}
          <div>
            <label htmlFor="firstName" className={labelClasses}>
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              required
              name="firstName"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={loading}
              className={inputClasses}
            />
          </div>
          {/* Second Name Field (Adjusted from your original) */}
          <div>
            <label htmlFor="lastName" className={labelClasses}>
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              required
              name="lastName"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={loading}
              className={inputClasses}
            />
          </div>
        </div>

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
        <div className="mb-6 relative">
          <label htmlFor="password" className={labelClasses}>
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              name="password"
              placeholder="Must be at least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className={`${inputClasses} pr-10`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="mb-8 relative">
          <label htmlFor="confirmPassword" className={labelClasses}>
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              name="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className={`${inputClasses} pr-10`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading} // Disable button when loading
          className={`w-full p-3 cursor-pointer text-white font-semibold rounded-lg transition duration-300 ease-in-out ${
            loading
              ? 'bg-purple-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 hover:shadow-lg'
          }`}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>

        {/* Sign In Link */}
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-purple-600 hover:text-purple-800 font-medium hover:underline"
          >
            Sign In
          </Link>
        </p>
      </form>
    </main>
  );
};

export default SignupPage;
