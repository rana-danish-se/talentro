"use client";
import { Edit2, X, Plus, Trash2, GraduationCap, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useProfile } from "@/context/ProfileContext";
import { toast } from "react-toastify";

const Education = () => {
  const {
    educations,
    addEducation,
    updateEducation,
    deleteEducation,
    fetchEducation,
  } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);

  const [formData, setFormData] = useState({
    schoolOrUniversity: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    isOngoing: false,
    grade: "",
    description: "",
    activities: "",
  });


  const openAddModal = () => {
    setEditingEducation(null);
    setFormData({
      schoolOrUniversity: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      isOngoing: false,
      grade: "",
      description: "",
      activities: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (education) => {
    setEditingEducation(education);
    setFormData({
      schoolOrUniversity: education.schoolOrUniversity,
      degree: education.degree,
      fieldOfStudy: education.fieldOfStudy || "",
      startDate: education.startDate ? education.startDate.split("T")[0] : "",
      endDate: education.endDate ? education.endDate.split("T")[0] : "",
      isOngoing: education.isOngoing,
      grade: education.grade || "",
      description: education.description || "",
      activities: education.activities || "",
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (editingEducation) {
      const result = await updateEducation(editingEducation._id, formData);
      if (result.success) {
        toast.success("Education updated successfully");
        setIsModalOpen(false);
      } else {
        toast.error(result.error || "Failed to update education");
      }
    } else {
      const result = await addEducation(formData);
      if (result.success) {
        toast.success("Education added successfully");
        setIsModalOpen(false);
      } else {
        toast.error(result.error || "Failed to add education");
      }
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this education record?")
    ) {
      const result = await deleteEducation(id);
      if (result.success) {
        toast.success("Education deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete education");
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

  return (
    <>
      <section className="max-w-4xl bg-neutral-950 shadow-2xl my-10 border-neutral-700 border p-10 mx-auto rounded-xl overflow-hidden mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-purple-500">
            Education
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

        {/* Education List */}
        <div className="space-y-6">
          {educations && educations.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No education added yet.</p>
              <button
                onClick={openAddModal}
                className="mt-4 px-6 py-2.5 cursor-pointer bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Add Education
              </button>
            </div>
          ) : (
            educations &&
            educations.map((education) => (
              <motion.div
                key={education._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-neutral-700 rounded-lg p-6 hover:border-purple-500/50 transition-all group"
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
                        {education.fieldOfStudy &&
                          ` • ${education.fieldOfStudy}`}
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

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openEditModal(education)}
                      className="p-2 text-purple-400 hover:bg-purple-900/30 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(education._id)}
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

      {/* Add/Edit Education Modal */}
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
              <div className="sticky top-0 bg-neutral-900 border-b border-neutral-700 px-6 py-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">
                  {editingEducation ? "Edit Education" : "Add Education"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 cursor-pointer hover:bg-neutral-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {/* School/University */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    School/University *
                  </label>
                  <input
                    type="text"
                    name="schoolOrUniversity"
                    value={formData.schoolOrUniversity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                    placeholder="Ex: Harvard University"
                    required
                  />
                </div>

                {/* Degree & Field of Study */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Degree *
                    </label>
                    <input
                      type="text"
                      name="degree"
                      value={formData.degree}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                      placeholder="Ex: Bachelor's"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Field of Study
                    </label>
                    <input
                      type="text"
                      name="fieldOfStudy"
                      value={formData.fieldOfStudy}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                      placeholder="Ex: Computer Science"
                    />
                  </div>
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
                      disabled={formData.isOngoing}
                      className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Is Ongoing Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isOngoing"
                    id="isOngoing"
                    checked={formData.isOngoing}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-purple-600 bg-neutral-800 border-neutral-700 rounded focus:ring-purple-500"
                  />
                  <label
                    htmlFor="isOngoing"
                    className="text-sm text-gray-300 cursor-pointer"
                  >
                    I am currently studying here
                  </label>
                </div>

                {/* Grade */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Grade/GPA
                  </label>
                  <input
                    type="text"
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                    placeholder="Ex: 3.8 GPA or A+"
                  />
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
                    rows={4}
                    maxLength={1000}
                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all resize-none"
                    placeholder="Describe your studies, achievements, or relevant coursework..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/1000 characters
                  </p>
                </div>

                {/* Activities */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Activities and Societies
                  </label>
                  <textarea
                    name="activities"
                    value={formData.activities}
                    onChange={handleInputChange}
                    rows={2}
                    maxLength={500}
                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all resize-none"
                    placeholder="Ex: Member of ACM, Debate Club President"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.activities.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-neutral-900 border-t border-neutral-700 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5  cursor pointer border border-neutral-700 rounded-lg font-medium text-gray-300 hover:bg-neutral-800 transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={
                    !formData.schoolOrUniversity ||
                    !formData.degree ||
                    !formData.startDate
                  }
                  className="px-6 py-2.5 cursor-pointer bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingEducation ? "Update" : "Add"} Education
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Education;
