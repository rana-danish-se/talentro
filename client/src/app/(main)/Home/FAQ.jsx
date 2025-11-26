import React from 'react';
import FAQCard from './components/FAQCard';

const FAQ = () => {
  const faqs = [
    {
      question: 'Is the platform free to use?',
      answer:
        'Yes! You can create a profile, match with users, and explore the community for free. Premium plans unlock advanced features like unlimited messaging and priority matching.',
    },
    {
      question: 'How do skill credits work?',
      answer:
        'You earn credits by teaching others. These credits can be used to learn new skills from other users. Credits cannot be withdrawn as money—they stay inside the platform.',
    },
    {
      question: 'Can I both teach and learn?',
      answer:
        "Absolutely. Every user can offer skills they know and learn skills they're interested in. You can switch between roles anytime.",
    },
    {
      question: 'How are payments handled?',
      answer:
        'All paid sessions are processed securely through Stripe or PayPal. You will receive earnings in your wallet, and withdrawals are processed safely.',
    },
    {
      question: 'Is online learning supported?',
      answer:
        'Yes, users can choose online sessions, in-person sessions, or both. The platform supports scheduling, chat, and reminders to streamline the experience.',
    },
  ];

  return (
    <section className="w-full p-10 py-20 relative overflow-hidden">
      {/* Oval Purple Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[900px] bg-purple-500/20 rounded-full blur-[120px]  -z-10"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="py-3 px-5 mt-10 text-xs rounded-md border border-gray-500 w-fit mx-auto">
          FAQ
        </div>
        <h2 className="max-w-xl font-semibold text-3xl md:text-4xl lg:text-5xl text-center mx-auto mt-10">
          We've Got the Answers You're Looking For
        </h2>
        <p className="mt-5 text-md text-neutral-400 max-w-xl text-center mx-auto">
          Quick answers to your AI automation questions.
        </p>

        {/* FAQ Cards */}
        <div className="mt-16 space-y-4 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQCard key={index} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;