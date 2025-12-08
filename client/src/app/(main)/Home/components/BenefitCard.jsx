import React from 'react';
import { CheckCircle, Users, BadgeCheck, Wallet, Shield, Sparkles } from "lucide-react";

const BenefitCard = ({ title, description, Icon }) => {
  // Map icon names to actual icon components
  const iconMap = {
    Users: Users,
    Sparkles: Sparkles,
    Wallet: Wallet,
    Shield: Shield,
    BadgeCheck: BadgeCheck,
    CheckCircle: CheckCircle,
  };

  const IconComponent = iconMap[Icon];

  return (
    <div className="relative w-full max-w-sm p-6 rounded-xl  border border-neutral-800 hover:border-purple-500/50 transition-all duration-300 overflow-hidden group">
      <div className="absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2 w-62 h-62 bg-purple-500/30 rounded-full blur-3xl group-hover:bg-purple-500/50 transition-all duration-300"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-start  gap-4">
        <div className="p-4 rounded-full bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-500/20 transition-all duration-300">
          {IconComponent && (
            <IconComponent className="w-6 h-6 text-white group-hover:text-purple-300 transition-colors duration-300" />
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-xl md:text-2xl font-medium text-white group-hover:text-purple-200 transition-colors duration-300">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-left text-neutral-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default BenefitCard;