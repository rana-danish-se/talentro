import Image from 'next/image';
import React from 'react';

const ServiceCard = ({ title, description, imageUrl, index, tags }) => {
  return (
    <div
      className={`flex items-center md:mt-20 flex-col justify-center max-w-4xl mx-auto gap-8 ${
        index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'
      }`}
    >
      <div className="flex-shrink-0">
        <Image
          src={imageUrl}
          width={300}
          height={300}
          alt={`${title} representation`}
          className="rounded-lg object-cover"
        />
      </div>
      <div className="flex flex-col items-start justify-start gap-5 px-6">
        <h3 className="text-3xl font-bold">{title}</h3>
        <p className="text-neutral-600 text-md dark:text-neutral-400 leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-4 py-2 text-sm font-medium rounded-md backdrop-blur-md bg-white/20 border border-white/20 shadow-lg text-neutral-700 dark:text-neutral-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;