import React from 'react';
import { CheckCircle, Users, BadgeCheck, Wallet, Shield, Sparkles } from "lucide-react";
import BenefitCard from './components/BenefitCard';


const Benefits = () => {
const benefits = [
  {
    icon: "Users",
    title: "Find the Right People",
    description:
      "Connect instantly with learners and mentors who match your skills, interests, and learning goals.",
  },
  {
    icon: "Sparkles",
    title: "Learn Faster & Smarter",
    description:
      "Get personalized matches and real progress by learning directly from skilled individuals.",
  },
  {
    icon: "Wallet",
    title: "Flexible Earning Options",
    description:
      "Teach to earn money or use hybrid mode to combine both for maximum freedom.",
  },
  {
    icon: "Shield",
    title: "Safe & Verified Platform",
    description:
      "Verified profiles and secure payments ensure your skill exchanges stay trusted and protected.",
  },
  {
    icon: "BadgeCheck",
    title: "Build Your Reputation",
    description:
      "Earn ratings, and reviews that highlight your expertise and help you stand out.",
  },
  {
    icon: "CheckCircle",
    title: "Grow With Real Experience",
    description:
      "Expand your network, and improve your skills through hands-on teaching and learning.",
  },
];


  return (
    <section className="w-full  p-10">
      <div className="py-3 px-5 mt-10 text-xs rounded-md border border-gray-500 w-fit mx-auto">
        Our Benefits
      </div>
      <h2 className="max-w-2xl font-semibold text-3xl md:text-4xl lg:text-5xl text-center mx-auto mt-10">
  The Key Benefits of AI for Your Business Growth
      </h2>
      <p className="mt-5 text-md text-neutral-400 max-w-xl text-center mx-auto">
   Discover how AI automation enhances efficiency, reduces costs, and drives business growth with smarter, faster processes.
      </p>
      <div className="mt-10  flex flex-wrap items-center justify-center gap-5 w-full mx-auto">
        {benefits.map((benefit, index) => (
          <BenefitCard
            key={index}
            title={benefit.title}
            description={benefit.description}
            Icon={benefit.icon}
          />
        ))}
      </div>
    </section>
  );
};

export default Benefits;
