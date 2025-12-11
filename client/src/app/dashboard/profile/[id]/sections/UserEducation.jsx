"use client";
import React from "react";
import { GraduationCap, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const UserEducation = ({ educations }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="max-w-4xl bg-neutral-950 shadow-2xl my-10 border-neutral-700 border p-10 mx-auto rounded-xl overflow-hidden mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-purple-500">
          Education
        </h2>
      </div>

      {/* Education List */}
      <div className="space-y-6">
        {!educations || educations.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No education added yet.</p>
          </div>
        ) : (
          educations.map((education) => (
            <motion.div
              key={education._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-neutral-700 rounded-lg p-6 hover:border-purple-500/50 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4 flex-1">
                  <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-purple-400" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">
                      {education.schoolOrUniversity}
                    </h3>
                    <p className="text-purple-400 mt-1">
                      {education.degree}
                      {education.fieldOfStudy && ` • ${education.fieldOfStudy}`}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(education.startDate)} -{" "}
                        {education.isOngoing
                          ? "Present"
                          : formatDate(education.endDate)}
                      </span>
                      {education.grade && (
                        <>
                          <span>•</span>
                          <span className="text-purple-400">
                            {education.grade}
                          </span>
                        </>
                      )}
                    </div>

                    {education.description && (
                      <p className="text-gray-300 mt-3 text-sm">
                        {education.description}
                      </p>
                    )}

                    {education.activities && (
                      <p className="text-gray-400 mt-2 text-sm">
                        <span className="font-medium">Activities: </span>
                        {education.activities}
                      </p>
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

export default UserEducation;
