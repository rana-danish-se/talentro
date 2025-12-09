"use client";
import {
  Edit2,
  X,
  Plus,
  Trash2,
  Briefcase,
  Calendar,
  MapPin,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useProfile } from "@/context/ProfileContext";
import { toast } from "react-toastify";

const ProfileExperience = () => {
  const {
    experiences,
    addExperience,
    updateExperience,
    deleteExperience,
    fetchExperience,
  } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    employmentType: "full-time",
    location: "",
    locationType: "on-site",
    startDate: "",
    endDate: "",
    isCurrentlyWorking: false,
    description: "",
    skills: [],
  });

  const [skillInput, setSkillInput] = useState("");

  const employmentTypes = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
    { value: "internship", label: "Internship" },
  ];

  const locationTypes = [
    { value: "on-site", label: "On-site" },
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
  ];

  useEffect(() => {
    fetchExperience();
  }, [fetchExperience]);

  const openAddModal = () => {
    setEditingExperience(null);
    setFormData({
      title: "",
      company: "",
      employmentType: "full-time",
      location: "",
      locationType: "on-site",
      startDate: "",
      endDate: "",
      isCurrentlyWorking: false,
      description: "",
      skills: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (experience) => {
    setEditingExperience(experience);
    setFormData({
      title: experience.title,
      company: experience.company,
      employmentType: experience.employmentType,
      location: experience.location || "",
      locationType: experience.locationType,
      startDate: experience.startDate ? experience.startDate.split("T")[0] : "",
      endDate: experience.endDate ? experience.endDate.split("T")[0] : "",
      isCurrentlyWorking: experience.isCurrentlyWorking,
      description: experience.description || "",
      skills: experience.skills || [],
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "isCurrentlyWorking" && checked) {
      setFormData((prev) => ({ ...prev, endDate: "" }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSave = async () => {
    if (editingExperience) {
      const result = await updateExperience(editingExperience._id, formData);
      if (result.success) {
        toast.success("Experience updated successfully");
        setIsModalOpen(false);
      } else {
        toast.error(result.error || "Failed to update experience");
      }
    } else {
      const result = await addExperience(formData);
      if (result.success) {
        toast.success("Experience added successfully");
        setIsModalOpen(false);
      } else {
        toast.error(result.error || "Failed to add experience");
      }
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this experience record?")
    ) {
      const result = await deleteExperience(id);
      if (result.success) {
        toast.success("Experience deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete experience");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getEmploymentTypeLabel = (type) => {
    const employment = employmentTypes.find((e) => e.value === type);
    return employment ? employment.label : type;
  };

  const getLocationTypeLabel = (type) => {
    const location = locationTypes.find((l) => l.value === type);
    return location ? location.label : type;
  };

  return (
    <>
      <section className="max-w-4xl bg-neutral-950 shadow-2xl my-10 border-neutral-700 border p-10 mx-auto rounded-xl overflow-hidden mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-purple-500">
            Experience
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

        {/* Experience List */}
        <div className="space-y-6">
          {experiences && experiences.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No work experience added yet.</p>
              <button
                onClick={openAddModal}
                className="mt-4 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Add Experience
              </button>
            </div>
          ) : (
            experiences &&
            experiences.map((experience) => (
              <motion.div
                key={experience._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-neutral-700 rounded-lg p-6 hover:border-purple-500/50 transition-all group"
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
                        <span className="font-medium">
                          {experience.company}
                        </span>
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

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openEditModal(experience)}
                      className="p-2 text-purple-400 hover:bg-purple-900/30 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(experience._id)}
                      className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Add/Edit Experience Modal */}
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
                  {editingExperience ? "Edit Experience" : "Add Experience"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                    placeholder="Ex: Senior Full Stack Developer"
                    required
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                    placeholder="Ex: Microsoft"
                    required
                  />
                </div>

                {/* Employment Type & Location Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Employment Type
                    </label>
                    <select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                    >
                      {employmentTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Location Type
                    </label>
                    <select
                      name="locationType"
                      value={formData.locationType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                    >
                      {locationTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                    placeholder="Ex: San Francisco, CA"
                  />
                </div>

                {/* Start Date & End Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      disabled={formData.isCurrentlyWorking}
                      className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Currently Working Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isCurrentlyWorking"
                    id="isCurrentlyWorking"
                    checked={formData.isCurrentlyWorking}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-purple-600 bg-neutral-800 border-neutral-700 rounded focus:ring-purple-500"
                  />
                  <label
                    htmlFor="isCurrentlyWorking"
                    className="text-sm text-gray-300 cursor-pointer"
                  >
                    I am currently working in this role
                  </label>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    maxLength={2000}
                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all resize-none"
                    placeholder="Describe your responsibilities, achievements, and impact..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/2000 characters
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Skills
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addSkill())
                      }
                      className="flex-1 px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                      placeholder="Ex: React, Node.js, Leadership"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                    >
                      Add
                    </motion.button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-900/30 text-purple-400 text-sm rounded-full border border-purple-700/50 flex items-center gap-2"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="hover:text-purple-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
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
                  disabled={
                    !formData.title || !formData.company || !formData.startDate
                  }
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingExperience ? "Update" : "Add"} Experience
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileExperience;
