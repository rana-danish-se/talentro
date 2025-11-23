import React from 'react';
import StepCard from './components/StepCard';
const Process = () => {
const steps = [
  {
    number: 1,
    title: "Create Your Skill Profile",
    description:
      "Tell the platform what skills you can teach and which ones you want to learn. Your personalized profile helps the system understand your goals.",
    imageUrl:
      "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=900&q=60",
  },
  {
    number: 2,
    title: "Get Smart Matches",
    description:
      "The system automatically recommends learners and mentors based on your skills and preferences. Discover the right people to grow with.",
    imageUrl:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=60",
  },
  {
    number: 3,
    title: "Connect & Schedule Sessions",
    description:
      "Chat instantly to discuss details and find the perfect time. Book online or in-person sessions through the integrated scheduling system.",
    imageUrl:
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=900&q=60"

  },
  {
    number: 4,
    title: "Learn, Teach & Grow",
    description:
      "Exchange skills through paid, barter, or hybrid modes. Earn credits, share knowledge, and build your network while learning something new.",
    imageUrl:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&fit=crop&w=900&q=60",
  },
];

  return (
    <section className="w-full  p-10">
      <div className="py-3 px-5 mt-10 text-xs rounded-md border border-gray-500 w-fit mx-auto">
        Our Process
      </div>
      <h2 className="max-w-xl font-semibold text-3xl md:text-4xl lg:text-5xl text-center mx-auto mt-10">
        Our Simple, Smart, <br /> and Scalable Process
      </h2>
      <p className="mt-5 text-md text-neutral-400 max-w-xl text-center mx-auto">
        We design, develop, and implement automation tools that help you work
        smarter, not harder
      </p>
      <div className="mt-10  flex flex-wrap items-center justify-center gap-5 max-w-4xl mx-auto">
        {
          steps.map((step,index)=>(
            <StepCard key={index} title={step.title} description={step.description} imageUrl={step.imageUrl} number={step.number}/>
          ))
        }
      </div>
    </section>
  );
};

export default Process;
