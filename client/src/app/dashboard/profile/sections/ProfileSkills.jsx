"use client";
import {
  Edit2,
  X,
  Plus,
  Trash2,
  Award,
  TrendingUp,
  Briefcase,
  GraduationCap,
  FolderOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useProfile } from "@/context/ProfileContext";
import { toast } from "react-toastify";

const ProfileSkills = () => {
  const {
    skills,
    addSkill,
    updateSkill,
    deleteSkill,
    fetchSkills,
    educations,
    experiences,
    projects,
  } = useProfile();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    proficiencyLevel: "intermediate",
    yearsOfExperience: 0,
    usage: {
      education: [],
      work: [],
      project: [],
    },
  });

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const proficiencyLevels = [
    { value: "beginner", label: "Beginner", color: "text-blue-400" },
    { value: "intermediate", label: "Intermediate", color: "text-green-400" },
    { value: "advanced", label: "Advanced", color: "text-orange-400" },
    { value: "expert", label: "Expert", color: "text-purple-400" },
  ];

  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({
      name: "",
      proficiencyLevel: "intermediate",
      yearsOfExperience: 0,
      usage: {
        education: [],
        work: [],
        project: [],
      },
    });
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      proficiencyLevel: skill.proficiencyLevel,
      yearsOfExperience: skill.yearsOfExperience,
      usage: {
        education: skill.usage?.education || [],
        work: skill.usage?.work || [],
        project: skill.usage?.project || [],
      },
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUsageChange = (type, itemName, isChecked) => {
    setFormData((prev) => {
      const currentUsage = prev.usage[type] || [];
      let newUsage;

      if (isChecked) {
        newUsage = [...currentUsage, { name: itemName }];
      } else {
        newUsage = currentUsage.filter((item) => item.name !== itemName);
      }

      return {
        ...prev,
        usage: {
          ...prev.usage,
          [type]: newUsage,
        },
      };
    });
  };

  const isItemChecked = (type, itemName) => {
    return formData.usage[type]?.some((item) => item.name === itemName);
  };

  const handleSave = async () => {
    let result;
    if (editingSkill) {
      result = await updateSkill(editingSkill._id, formData);
    } else {
      result = await addSkill(formData);
    }

    if (result.success) {
      toast.success(
        editingSkill ? "Skill updated successfully" : "Skill added successfully"
      );
      setIsModalOpen(false);
    } else {
      toast.error(result.error || "Failed to save skill");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      const result = await deleteSkill(id);
      if (result.success) {
        toast.success("Skill deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete skill");
      }
    }
  };

  const getProficiencyColor = (level) => {
    const proficiency = proficiencyLevels.find((p) => p.value === level);
    return proficiency ? proficiency.color : "text-gray-400";
  };

  const getProficiencyLabel = (level) => {
    const proficiency = proficiencyLevels.find((p) => p.value === level);
    return proficiency ? proficiency.label : level;
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Others";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <>
      <section className="max-w-4xl bg-neutral-950 shadow-2xl my-10 border-neutral-700 border p-10 mx-auto rounded-xl overflow-hidden mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-purple-500">
            Skills
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={openAddModal}
            className="text-purple-500 cursor-pointer p-2 hover:bg-purple-900/20 rounded-full transition-all"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Skills List */}
        <div className="space-y-8">
          {skills.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No skills added yet.</p>
              <button
                onClick={openAddModal}
                className="mt-4 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Add Skill
              </button>
            </div>
          ) : (
            Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="text-xl font-semibold text-gray-300 mb-4 border-b border-neutral-800 pb-2">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categorySkills.map((skill) => (
                    <motion.div
                      key={skill._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border border-neutral-700 rounded-lg p-5 hover:border-purple-500/50 transition-all group relative"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Award className="w-5 h-5 text-purple-400" />
                            {skill.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={`text-sm font-medium ${getProficiencyColor(
                                skill.proficiencyLevel
                              )}`}
                            >
                              {getProficiencyLabel(skill.proficiencyLevel)}
                            </span>
                            <span className="text-gray-500">•</span>
                            <span className="text-sm text-gray-400">
                              {skill.yearsOfExperience}{" "}
                              {skill.yearsOfExperience === 1 ? "year" : "years"}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openEditModal(skill)}
                            className="p-2 text-purple-400 hover:bg-purple-900/30 rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(skill._id)}
                            className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Usage Summary */}
                      <div className="space-y-2 mt-3 text-xs">
                        {skill.usage?.education?.length > 0 && (
                          <div className="flex items-start gap-2 text-gray-400">
                            <GraduationCap className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <div className="flex flex-wrap gap-1">
                              {skill.usage.education.map((edu, idx) => (
                                <span
                                  key={idx}
                                  className="bg-neutral-800 px-1.5 py-0.5 rounded text-gray-300"
                                >
                                  {edu.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {skill.usage?.work?.length > 0 && (
                          <div className="flex items-start gap-2 text-gray-400">
                            <Briefcase className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <div className="flex flex-wrap gap-1">
                              {skill.usage.work.map((work, idx) => (
                                <span
                                  key={idx}
                                  className="bg-neutral-800 px-1.5 py-0.5 rounded text-gray-300"
                                >
                                  {work.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {skill.usage?.project?.length > 0 && (
                          <div className="flex items-start gap-2 text-gray-400">
                            <FolderOpen className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <div className="flex flex-wrap gap-1">
                              {skill.usage.project.map((proj, idx) => (
                                <span
                                  key={idx}
                                  className="bg-neutral-800 px-1.5 py-0.5 rounded text-gray-300"
                                >
                                  {proj.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Add/Edit Skill Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-neutral-900 border-b border-neutral-700 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-2xl font-bold text-white">
                  {editingSkill ? "Edit Skill" : "Add Skill"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Skill Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                    placeholder="Ex: React.js, Python, Project Management"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Category will be automatically determined
                  </p>
                </div>

                {/* Proficiency Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Proficiency Level *
                  </label>
                  <select
                    name="proficiencyLevel"
                    value={formData.proficiencyLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                  >
                    {proficiencyLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Years of Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    min="0"
                    step="0.5"
                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                    placeholder="Ex: 2.5"
                  />
                </div>

                {/* Usage Section - Shows only if skill name is entered */}
                {formData.name && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="border border-neutral-700 rounded-lg p-5 bg-neutral-800/50"
                  >
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      Where have you used this skill?
                    </h4>

                    <div className="space-y-5">
                      {/* Education */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <GraduationCap className="w-5 h-5 text-purple-400" />
                          <h5 className="font-medium text-gray-300">
                            Education
                          </h5>
                        </div>
                        <div className="space-y-2 ml-7">
                          {educations && educations.length === 0 ? (
                            <p className="text-sm text-gray-500">
                              No education entries found
                            </p>
                          ) : (
                            educations &&
                            educations.map((edu) => (
                              <label
                                key={edu._id}
                                className="flex items-start gap-3 p-2 rounded hover:bg-neutral-700/50 cursor-pointer transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={isItemChecked(
                                    "education",
                                    edu.degree
                                  )}
                                  onChange={(e) =>
                                    handleUsageChange(
                                      "education",
                                      edu.degree,
                                      e.target.checked
                                    )
                                  }
                                  className="mt-0.5 w-4 h-4 text-purple-600 bg-neutral-800 border-neutral-600 rounded focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-300">
                                  {edu.degree} at {edu.schoolOrUniversity}
                                </span>
                              </label>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Work Experience */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Briefcase className="w-5 h-5 text-purple-400" />
                          <h5 className="font-medium text-gray-300">
                            Work Experience
                          </h5>
                        </div>
                        <div className="space-y-2 ml-7">
                          {experiences && experiences.length === 0 ? (
                            <p className="text-sm text-gray-500">
                              No work experience entries found
                            </p>
                          ) : (
                            experiences &&
                            experiences.map((exp) => (
                              <label
                                key={exp._id}
                                className="flex items-start gap-3 p-2 rounded hover:bg-neutral-700/50 cursor-pointer transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={isItemChecked("work", exp.title)}
                                  onChange={(e) =>
                                    handleUsageChange(
                                      "work",
                                      exp.title,
                                      e.target.checked
                                    )
                                  }
                                  className="mt-0.5 w-4 h-4 text-purple-600 bg-neutral-800 border-neutral-600 rounded focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-300">
                                  {exp.title} at {exp.company}
                                </span>
                              </label>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Projects */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FolderOpen className="w-5 h-5 text-purple-400" />
                          <h5 className="font-medium text-gray-300">
                            Projects
                          </h5>
                        </div>
                        <div className="space-y-2 ml-7">
                          {projects && projects.length === 0 ? (
                            <p className="text-sm text-gray-500">
                              No project entries found
                            </p>
                          ) : (
                            projects &&
                            projects.map((proj) => (
                              <label
                                key={proj._id}
                                className="flex items-start gap-3 p-2 rounded hover:bg-neutral-700/50 cursor-pointer transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={isItemChecked("project", proj.name)}
                                  onChange={(e) =>
                                    handleUsageChange(
                                      "project",
                                      proj.name,
                                      e.target.checked
                                    )
                                  }
                                  className="mt-0.5 w-4 h-4 text-purple-600 bg-neutral-800 border-neutral-600 rounded focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-300">
                                  {proj.name}
                                </span>
                              </label>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-neutral-900 border-t border-neutral-700 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 border border-neutral-700 rounded-lg font-medium text-gray-300 hover:bg-neutral-800 transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={!formData.name}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingSkill ? "Update" : "Add"} Skill
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileSkills;
