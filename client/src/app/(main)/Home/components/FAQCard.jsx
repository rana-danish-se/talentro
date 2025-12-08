"use client"
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQCard = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-3xl mx-auto border border-neutral-800 rounded-xl backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-purple-500/50">
      {/* Question Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between gap-4 text-left transition-colors duration-200 hover:bg-black"
      >
        <span className="text-md font-medium text-white pr-4">
          {faq.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-purple-400 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Answer Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-6 pb-6 pt-2">
          <p className="text-neutral-400 leading-relaxed">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
};

export default FAQCard;