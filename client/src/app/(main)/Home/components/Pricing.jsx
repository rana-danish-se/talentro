import React from 'react';
import { Check, Rocket } from 'lucide-react';

const PricingCard = ({ plan }) => {
  const isPopular = plan.tagline === "Popular";
  
  return (
    <div className="relative w-full max-w-[30%] h-[600px] p-8 rounded-xl  border border-neutral-800 hover:border-purple-500/50 transition-all duration-300 overflow-hidden group">
      {/* Conditional Purple Glow - Top for Popular, Bottom for Others */}
      <div 
        className={`absolute ${
          isPopular 
            ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' 
            : 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2'
        } w-70 h-70 bg-purple-500/30 rounded-full blur-3xl group-hover:bg-purple-500/50 transition-all duration-300`}
      ></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Plan Name with Icon */}
        <div className="flex items-center gap-2 mb-6">
          <Rocket className="w-5 h-5 text-neutral-400" />
          <span className="text-neutral-400 font-medium">{plan.tagline}</span>
        </div>
        
        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold text-white">{plan.price}</span>
            <span className="text-neutral-400 text-lg">{plan.priceUnit}</span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
          {plan.description}
        </p>
        
        {/* CTA Button */}
        <button className="w-full py-2 cursor-pointer px-6 rounded-xl bg-white/10 hover:bg-purple-600 text-white font-medium transition-all duration-300 mb-8 border border-neutral-700 hover:border-purple-500">
          {plan.cta}
        </button>
        
        {/* What's Included */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-lg mb-4">What's Included:</h4>
          <div className="space-y-3">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-300 text-sm leading-relaxed">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;