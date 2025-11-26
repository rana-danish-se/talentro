// import React from 'react';
// import ServiceCard from './components/ServiceCard';

// const HomeServices = () => {
//   const services = [
//     {
//       title: 'Smart Skill Matching',
//       description:
//         'Get automatically matched with users based on the skills you offer, the skills you want to learn, location, availability, and exchange mode.',
//       imageUrl: '/assets/services/skill-matching.png',
//     },
//     {
//       title: 'Teach & Learn (Skill Exchange)',
//       description:
//         'Offer your skills and learn new ones through paid, barter, or hybrid exchange modes — whatever works best for you.',
//       imageUrl: '/assets/services/skill-exchange.png',
//     },
//     {
//       title: 'In-App Messaging',
//       description:
//         'Chat with other users, discuss details, and plan your learning sessions smoothly with a built-in messaging system.',
//       imageUrl: '/assets/services/messaging.png',
//     },
//     {
//       title: 'Booking & Scheduling',
//       description:
//         'Book learning or teaching sessions directly through the platform using an interactive calendar with reminders.',
//       imageUrl: '/assets/services/booking.png',
//     },

//     {
//       title: 'User Ratings & Reviews',
//       description:
//         'Build trust within the community through detailed ratings, feedback, verification badges, and achievement badges.',
//       imageUrl: '/assets/services/reviews.png',
//     },
//     {
//       title: 'Community & Social Feed',
//       description:
//         'Share updates, posts, achievements, and engage with others in a social feed designed for learning communities.',
//       imageUrl: '/assets/services/community.png',
//     },
//     {
//       title: 'User Analytics Dashboard',
//       description:
//         'Track your progress with insights about earnings, credits, lessons completed, ratings, and skill development.',
//       imageUrl: '/assets/services/analytics.png',
//     },
//     {
//       title: 'Profile & Skill Management',
//       description:
//         'Set up your professional identity with skills you offer, skills you want to learn, preferences, availability, and more.',
//       imageUrl: '/assets/services/profile.png',
//     },
//   ];

//   return (
//     <section className="w-full p-10">
//       <div className="py-3 px-5 mt-10 text-xs rounded-md border border-gray-500 w-fit mx-auto">
//         Our Services
//       </div>
//       <h2 className="max-w-3xl font-bold text-3xl md:text-4xl lg:text-5xl text-center mx-auto mt-10">
//         AI Solutions That Take Your Business to the Next Level
//       </h2>
//       <p className="mt-5 text-md text-neutral-400 max-w-xl text-center  mx-auto">
//         We design, develop, and implement automation tools that help you work
//         smarter, not harder
//       </p>
//       <div className="mt-10 flex flex-col items-center justify-center w-full gap-20">
//         {services.map((service, index) => {
//           return (
//             <ServiceCard
//               key={index}
//               title={service.title}
//               description={service.description}
//               imageUrl={service.imageUrl}
//               index={index+1}
//             />
//           );
//         })}
//       </div>
//     </section>
//   );
// };

// export default HomeServices;

import React from 'react';
import ServiceCard from './components/ServiceCard';

const HomeServices = () => {
  const services = [
    {
      title: 'Smart Skill Matching',
      description:
        'Get automatically matched with users based on the skills you offer, the skills you want to learn, location, availability, and exchange mode.',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=800&fit=crop',
      tags: ['AI Matching', 'Smart Algorithm', 'Personalized', 'Real-time']
    },
    {
      title: 'Teach & Learn (Skill Exchange)',
      description:
        'Offer your skills and learn new ones through paid, barter, or hybrid exchange modes — whatever works best for you.',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=800&fit=crop',
      tags: ['Barter', 'Paid Mode', 'Hybrid', 'Flexible Exchange']
    },
    {
      title: 'In-App Messaging',
      description:
        'Chat with other users, discuss details, and plan your learning sessions smoothly with a built-in messaging system.',
      imageUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&h=800&fit=crop',
      tags: ['Real-time Chat', 'Secure', 'Notifications', 'Easy Communication']
    },
    {
      title: 'Booking & Scheduling',
      description:
        'Book learning or teaching sessions directly through the platform using an interactive calendar with reminders.',
      imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=800&fit=crop',
      tags: ['Calendar', 'Reminders', 'Time Management', 'Automated']
    },
    {
      title: 'User Ratings & Reviews',
      description:
        'Build trust within the community through detailed ratings, feedback, verification badges, and achievement badges.',
      imageUrl: 'https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?w=800&h=800&fit=crop',
      tags: ['Trust Building', 'Verified Badges', 'Reviews', 'Reputation']
    },
    {
      title: 'Community & Social Feed',
      description:
        'Share updates, posts, achievements, and engage with others in a social feed designed for learning communities.',
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=800&fit=crop',
      tags: ['Social Network', 'Community', 'Engagement', 'Sharing']
    },
    {
      title: 'User Analytics Dashboard',
      description:
        'Track your progress with insights about earnings, credits, lessons completed, ratings, and skill development.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=800&fit=crop',
      tags: ['Analytics', 'Progress Tracking', 'Insights', 'Reports']
    },
    {
      title: 'Profile & Skill Management',
      description:
        'Set up your professional identity with skills you offer, skills you want to learn, preferences, availability, and more.',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=800&fit=crop',
      tags: ['Profile Setup', 'Skills Portfolio', 'Customizable', 'Professional']
    },
  ];

  return (
    <section className="w-full p-10">
      <div className="py-3 px-5 mt-10 text-xs rounded-md border border-gray-500 w-fit mx-auto">
        Our Services
      </div>
      <h2 className="max-w-3xl font-bold text-3xl md:text-4xl lg:text-5xl text-center mx-auto mt-10">
        AI Solutions That Take Your Business to the Next Level
      </h2>
      <p className="mt-5 text-md text-neutral-400 max-w-xl text-center mx-auto">
        We design, develop, and implement automation tools that help you work
        smarter, not harder
      </p>
      <div className="mt-10 flex flex-col items-center justify-center w-full gap-10">
        {services.map((service, index) => {
          return (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              imageUrl={service.imageUrl}
              tags={service.tags}
              index={index + 1}
            />
          );
        })}
      </div>
    </section>
  );
};

export default HomeServices;