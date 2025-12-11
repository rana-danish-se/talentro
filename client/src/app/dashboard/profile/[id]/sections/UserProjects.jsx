"use client";
import React from "react";
import { FolderOpen, Calendar, ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const UserProjects = ({ projects }) => {
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
          Projects
        </h2>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {!projects || projects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No projects added yet.</p>
          </div>
        ) : (
          projects.map((project) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-neutral-700 rounded-lg overflow-hidden hover:border-purple-500/50 transition-all"
            >
              {/* Project Images Grid */}
              {project.media && project.media.length > 0 && (
                <div
                  className={`grid gap-1 bg-neutral-900 ${
                    project.media.length === 1
                      ? "grid-cols-1 h-64"
                      : project.media.length === 2
                      ? "grid-cols-2 h-64"
                      : project.media.length === 3
                      ? "grid-cols-2 h-64"
                      : "grid-cols-2 h-64"
                  }`}
                >
                  {project.media.slice(0, 4).map((item, idx) => (
                    <div
                      key={idx}
                      className={`relative overflow-hidden ${
                        project.media.length === 3 && idx === 0
                          ? "row-span-2"
                          : ""
                      } ${project.media.length === 1 ? "h-full" : "h-full"}`}
                    >
                      <Image
                        src={item.url}
                        alt={`${project.name} ${idx + 1}`}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(project.startDate)} -{" "}
                        {project.isOngoing
                          ? "Present"
                          : formatDate(project.endDate)}
                      </span>
                    </div>

                    <p className="text-gray-300 mt-3 text-sm leading-relaxed">
                      {project.description}
                    </p>

                    {/* Skills */}
                    {project.skillsUsed && project.skillsUsed.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.skillsUsed.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-900/30 text-purple-400 text-xs rounded-full border border-purple-700/50"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex gap-3 mt-4">
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          GitHub
                        </a>
                      )}
                    </div>
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

export default UserProjects;
