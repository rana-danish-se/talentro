import React from 'react';
import PricingCard from './components/Pricing';
const Pricing = () => {
  const pricingPlans = [
    {
      name: "Free",
      tagline: "Starter",
      price: "$0",
      priceUnit: "/month",
      cta: "Choose this plan",
      description: "Perfect for beginners exploring skill exchange.",
      features: [
        "Create your skill profile",
        "Discover and match with users",
        "Join community discussions",
        "Send limited messages",
        "Access basic booking features"
      ],
    },
    {
      name: "Monthly",
      tagline: "Popular",
      price: "$15",
      priceUnit: "/month",
      cta: "Choose this plan",
      description: "Great for active learners and creators with extra features.",
      features: [
        "Unlimited skill matches",
        "Full messaging access",
        "Advanced booking & scheduling",
        "Earn and redeem unlimited credits",
        "Priority support & verification badge",
        "Access to premium skill categories"
      ],
    },
    {
      name: "Yearly",
      tagline: "Best Value",
      price: "$120",
      priceUnit: "/year",
      cta: "Choose this plan",
      description: "Save more with annual access to everything.",
      features: [
        "Everything in Monthly Plan",
        "Exclusive yearly-only features",
        "Early access to new updates",
        "Community spotlight promotions",
        "Dedicated support channel",
        "Free profile enhancement consultation"
      ],
    },
  ];

  return (
    <section className="w-full p-10">
      <div className="py-3 px-5 mt-10 text-xs rounded-md border border-gray-500 w-fit mx-auto">
        Pricings
      </div>
      <h2 className="max-w-2xl font-semibold text-3xl md:text-4xl lg:text-5xl text-center mx-auto mt-10">
        The Best AI Automation, <br /> at the Right Price
      </h2>
      <p className="mt-5 text-md text-neutral-400 max-w-xl text-center mx-auto">
        Choose a plan that fits your business needs and start automating with AI
      </p>
      
      {/* Pricing Cards */}
      <div className="mt-16 flex flex-wrap items-center justify-center gap-8 max-w-7xl mx-auto">
        {pricingPlans.map((plan, index) => (
          <PricingCard key={index} plan={plan} />
        ))}
      </div>
    </section>
  );
};

export default Pricing;