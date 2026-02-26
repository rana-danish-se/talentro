"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/Authentication";
import Benefits from "./Home/Benefits.jsx";
import CTA from "./Home/CTA.jsx";
import FAQ from "./Home/FAQ.jsx";
import HomeHero from "./Home/HomeHero.jsx";
import HomeServices from "./Home/HomeServices.jsx";
import Pricing from "./Home/Pricing.jsx";
import Process from "./Home/Process.jsx";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="animate-pulse">
        <section className="relative w-full overflow-hidden bg-background pt-32 pb-20 md:pt-48 md:pb-32 px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <div className="w-3/4 max-w-4xl h-12 md:h-20 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-6"></div>
            <div className="w-2/3 max-w-2xl h-6 md:h-8 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-10"></div>
            <div className="flex flex-wrap gap-4 justify-center">
               <div className="w-40 h-12 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
               <div className="w-40 h-12 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
            </div>
          </div>
        </section>
      </main>
    );
  }
  return (
    <main>
      <HomeHero />
      <HomeServices />
      <Process />
      <Benefits />
      <Pricing />
      <FAQ />
      <CTA />
    </main>
  );
}
