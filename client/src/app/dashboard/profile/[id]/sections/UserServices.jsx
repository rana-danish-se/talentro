"use client";
import React from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Repeat2,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const UserServices = ({ services }) => {
  const getModeIcons = (modes) => {
    return modes?.map((mode) => {
      if (mode === "paid") return <DollarSign key={mode} className="w-4 h-4" />;
      if (mode === "barter") return <Repeat2 key={mode} className="w-4 h-4" />;
      if (mode === "hybrid") return <Users key={mode} className="w-4 h-4" />;
      return null;
    });
  };

  const getSkillLevelLabel = (level) => {
    const labels = {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
      "all-levels": "All Levels",
    };
    return labels[level] || level;
  };

  return (
    <section className="max-w-4xl bg-neutral-950 shadow-2xl my-10 border-neutral-700 border p-10 mx-auto rounded-xl overflow-hidden mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-purple-500">
          Services
        </h2>
      </div>

      <div className="space-y-6">
        {!services || services.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No services added yet.</p>
          </div>
        ) : (
          services.map((service) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-neutral-700 rounded-lg overflow-hidden hover:border-purple-500/50 transition-all"
            >
              {service.media?.images?.length > 0 && (
                <div className="w-full h-48 overflow-hidden bg-neutral-800">
                  <Image
                    width={500}
                    height={300}
                    src={service.media.images[0]}
                    alt={service.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {service.name}
                      </h3>
                      <div className="flex gap-1 text-purple-400">
                        {getModeIcons(service.modesAvailable)}
                      </div>
                    </div>

                    <span className="inline-block px-3 py-1 bg-purple-900/30 text-purple-400 text-xs rounded-full mb-3">
                      {service.category}
                    </span>

                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      {service.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                      {service.location?.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {service.location.city}, {service.location.country}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {getSkillLevelLabel(service.skillLevel)}
                      </span>
                      {service.deliveryOptions?.map((option) => (
                        <span key={option} className="capitalize">
                          {option}
                        </span>
                      ))}
                    </div>

                    {service.availability?.schedule?.length > 0 && (
                      <div className="text-xs text-gray-500">
                        Available:{" "}
                        {service.availability.schedule
                          .map((s) => s.day)
                          .join(", ")}
                      </div>
                    )}

                    {service.requirements && (
                      <div className="mt-3 p-3 bg-neutral-800/50 rounded-lg">
                        <p className="text-xs text-gray-400 font-medium mb-1">
                          Requirements:
                        </p>
                        <p className="text-sm text-gray-300">
                          {service.requirements}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
};

export default UserServices;
