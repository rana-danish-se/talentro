"use client";
import React from "react";
import { Briefcase, Calendar, MapPin, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const UserExperience = ({ experiences }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getEmploymentTypeLabel = (type) => {
    const labels = {
      "full-time": "Full-time",
      "part-time": "Part-time",
      contract: "Contract",
      freelance: "Freelance",
      internship: "Internship",
    };
    return labels[type] || type;
  };

  const getLocationTypeLabel = (type) => {
    const labels = {
      "on-site": "On-site",
      remote: "Remote",
      hybrid: "Hybrid",
    };
    return labels[type] || type;
  };

  return (
    <section className="max-w-4xl bg-neutral-950 shadow-2xl my-10 border-neutral-700 border p-10 mx-auto rounded-xl overflow-hidden mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-purple-500">
          Experience
        </h2>
      </div>

      {/* Experience List */}
      <div className="space-y-6">
        {!experiences || experiences.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No work experience added yet.</p>
          </div>
        ) : (
          experiences.map((experience) => (
            <motion.div
              key={experience._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-neutral-700 rounded-lg p-6 hover:border-purple-500/50 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4 flex-1">
                  <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-purple-400" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">
                      {experience.title}
                    </h3>
                    <div className="flex items-center gap-2 text-purple-400 mt-1">
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium">{experience.company}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(experience.startDate)} -{" "}
                        {experience.isCurrentlyWorking
                          ? "Present"
                          : formatDate(experience.endDate)}
                      </span>
                      <span>•</span>
                      <span>
                        {getEmploymentTypeLabel(experience.employmentType)}
                      </span>
                      {experience.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {experience.location}
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span className="text-purple-400">
                        {getLocationTypeLabel(experience.locationType)}
                      </span>
                    </div>

                    {experience.description && (
                      <p className="text-gray-300 mt-3 text-sm leading-relaxed">
                        {experience.description}
                      </p>
                    )}

                    {/* Skills */}
                    {experience.skills && experience.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {experience.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-900/30 text-purple-400 text-xs rounded-full border border-purple-700/50"
                          >
                            {skill}
                          </span>
                        ))}
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

export default UserExperience;
