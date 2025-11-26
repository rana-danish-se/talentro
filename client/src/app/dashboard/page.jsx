"use client";
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { useAuth } from '../../Context/Authentication';

const DashboardPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  return (
    <main className="p-6">

    </main>
  )
}

export default DashboardPage;