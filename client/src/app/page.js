"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../Context/Authentication';
import Benefits from './Home/Benefits.jsx';
import CTA from './Home/CTA.jsx';
import FAQ from './Home/FAQ.jsx';
import HomeHero from './Home/HomeHero.jsx';
import HomeServices from './Home/HomeServices.jsx';
import Pricing from './Home/Pricing.jsx';
import Process from './Home/Process.jsx';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  return (
    <main>
      <HomeHero />
      <HomeServices />
      <Process/>
      <Benefits/>
      <Pricing/>
      <FAQ/>
      <CTA/>
    </main>
  );
}