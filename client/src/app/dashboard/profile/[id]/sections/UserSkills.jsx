"use client";
import React from "react";
import { Code, Award } from "lucide-react";
import { motion } from "framer-motion";

const UserSkills = ({ skills }) => {
  // Group skills by proficiency level
  const groupedSkills = {
    Beginner: [],
    Intermediate: [],
    Advanced: [],
    Expert: [],
  };

  skills?.forEach((skill) => {
    if (groupedSkills[skill.proficiencyLevel]) {
      groupedSkills[skill.proficiencyLevel].push(skill);
    }
  });

  const getProficiencyColor = (level) => {
    switch (level) {
      case "Beginner":
        return "bg-blue-900/30 text-blue-400 border-blue-700/50";
      case "Intermediate":
        return "bg-green-900/30 text-green-400 border-green-700/50";
      case "Advanced":
        return "bg-orange-900/30 text-orange-400 border-orange-700/50";
      case "Expert":
        return "bg-purple-900/30 text-purple-400 border-purple-700/50";
      default:
        return "bg-gray-900/30 text-gray-400 border-gray-700/50";
    }
  };

  return (
    <section className="max-w-4xl bg-neutral-950 shadow-2xl my-10 border-neutral-700 border p-10 mx-auto rounded-xl overflow-hidden mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-purple-500">
          Skills
        </h2>
      </div>

      {/* Skills List */}
      {!skills || skills.length === 0 ? (
        <div className="text-center py-12">
          <Code className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No skills added yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([level, levelSkills]) => {
            if (levelSkills.length === 0) return null;

            return (
              <div key={level}>
                <div className="flex items-center gap-2 mb-3">
                  <Award
                    className={`w-5 h-5 ${
                      getProficiencyColor(level).split(" ")[1]
                    }`}
                  />
                  <h3 className="text-lg font-semibold text-white">{level}</h3>
                  <span className="text-sm text-gray-500">
                    ({levelSkills.length})
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {levelSkills.map((skill) => (
                    <motion.div
                      key={skill._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`px-4 py-2 rounded-lg border ${getProficiencyColor(
                        skill.proficiencyLevel
                      )} hover:scale-105 transition-transform`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{skill.name}</span>
                        {skill.yearsOfExperience && (
                          <span className="text-xs opacity-70">
                            • {skill.yearsOfExperience}y
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default UserSkills;
