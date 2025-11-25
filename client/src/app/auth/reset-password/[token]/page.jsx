'use client';

import apiClient from '@/api/apiClient';
import Link from 'next/link';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const inputClasses =
  'w-full p-4 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150 ease-in-out placeholder-neutral-500 bg-neutral-800 text-white';
const labelClasses = 'text-sm font-medium text-neutral-300 block mb-2';

const ResetPasswordPage = () => {
  const router = useRouter();
  const params = useParams();
  const token = params.token;

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!token) {
      toast.error('Missing reset token. Please check your link.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }
    try {
      const res = await apiClient.post(`/api/auth/reset-password/${token}`, {
        password,
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Password reset successful!');

        setPassword('');
        setConfirmPassword('');
        router.push('/auth/login');
      } else {
        toast.error(
          res.data.message ||
            'Failed to reset password. The link may be expired.'
        );
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        'Error connecting to the server. Please try again.';

      toast.error(errorMsg);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen  text-white flex flex-col items-center justify-center py-10 px-5">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          New Password
        </h1>
        <p className="mt-4 text-lg text-neutral-400 max-w-xl mx-auto">
          Enter and confirm your new password below.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-8 w-full max-w-md bg-white/10 shadow-2xl rounded-xl border border-neutral-700"
      >
        {/* Token Check (optional visual feedback) */}
        {!token && (
          <div className="mb-6 p-3 text-sm text-red-400 bg-red-900/50 border border-red-700 rounded-lg">
            Error: Password reset token not found in the URL.
          </div>
        )}
        <div className="mb-6">
          <label htmlFor="password" className={labelClasses}>
            New Password (Min 6 characters)
          </label>
          <input
            id="password"
            type="password"
            required
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className={inputClasses}
          />
        </div>
        <div className="mb-8">
          <label htmlFor="confirmPassword" className={labelClasses}>
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            name="confirmPassword"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            className={inputClasses}
          />
        </div>

        <button
          type="submit"
          // Disable button if loading or if token is missing
          disabled={loading || !token}
          className={`w-full p-3 cursor-pointer text-white font-semibold rounded-lg transition duration-300 ease-in-out ${
            loading || !token
              ? 'bg-purple-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 hover:-translate-y-0.5'
          }`}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        <p className="mt-6 text-center text-neutral-400">
          Remember your password?{' '}
          <Link
            href="/auth/login"
            className="text-purple-500 hover:text-purple-400 font-medium hover:underline"
          >
            Go to Login
          </Link>
        </p>
      </form>
    </main>
  );
};

export default ResetPasswordPage;
