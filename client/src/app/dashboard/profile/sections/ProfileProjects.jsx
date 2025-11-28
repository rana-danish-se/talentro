"use client";
import {
  Edit2,
  X,
  Plus,
  Trash2,
  FolderOpen,
  Calendar,
  ExternalLink,
  Github,
  Image,
  Upload,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useProfile } from "@/context/ProfileContext";
import { toast } from "react-toastify";

const ProfileProjects = () => {
  const { projects, addProject, updateProject, deleteProject, fetchProjects } =
    useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    skillsUsed: [],
    projectUrl: "",
    githubUrl: "",
    startDate: "",
    endDate: "",
    isOngoing: false,
  });

  const [skillInput, setSkillInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      name: "",
      description: "",
      skillsUsed: [],
      projectUrl: "",
      githubUrl: "",
      startDate: "",
      endDate: "",
      isOngoing: false,
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setExistingImages([]);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      skillsUsed: project.skillsUsed || [],
      projectUrl: project.projectUrl || "",
      githubUrl: project.githubUrl || "",
      startDate: project.startDate ? project.startDate.split("T")[0] : "",
      endDate: project.endDate ? project.endDate.split("T")[0] : "",
      isOngoing: project.isOngoing,
    });
    setExistingImages(project.media ? project.media.map((m) => m.url) : []);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "isOngoing" && checked) {
      setFormData((prev) => ({ ...prev, endDate: "" }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skillsUsed.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skillsUsed: [...prev.skillsUsed, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skillsUsed: prev.skillsUsed.filter((s) => s !== skill),
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages =
      existingImages.length + selectedFiles.length + files.length;

    if (totalImages > 4) {
      toast.error("You can only upload up to 4 images per project.");
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previewUrls];

    URL.revokeObjectURL(newPreviews[index]); // Cleanup
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("projectUrl", formData.projectUrl);
    data.append("githubUrl", formData.githubUrl);
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);
    data.append("isOngoing", formData.isOngoing);
    data.append("skillsUsed", JSON.stringify(formData.skillsUsed));

    if (existingImages.length > 0) {
      data.append("existingMedia", JSON.stringify(existingImages));
    }

    selectedFiles.forEach((file) => {
      data.append("images", file);
    });

    let result;
    if (editingProject) {
      result = await updateProject(editingProject._id, data);
    } else {
      result = await addProject(data);
    }

    if (result.success) {
      toast.success(
        editingProject
          ? "Project updated successfully"
          : "Project added successfully"
      );
      setIsModalOpen(false);
    } else {
      toast.error(result.error || "Failed to save project");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const result = await deleteProject(id);
      if (result.success) {
        toast.success("Project deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete project");
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
            Projects
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

        {/* Projects List */}
        <div className="space-y-6">
          {projects && projects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No projects added yet.</p>
              <button
                onClick={openAddModal}
                className="mt-4 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Add Project
              </button>
            </div>
          ) : (
            projects &&
            projects.map((project) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-neutral-700 rounded-lg overflow-hidden hover:border-purple-500/50 transition-all group"
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
                        <img
                          src={item.url}
                          alt={`${project.name} ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openEditModal(project)}
                        className="p-2 text-purple-400 hover:bg-purple-900/30 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(project._id)}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Add/Edit Project Modal */}
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
                  {editingProject ? "Edit Project" : "Add Project"}
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
                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    maxLength={100}
                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                    placeholder="Ex: E-Commerce Platform"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    maxLength={2000}
                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all resize-none"
                    placeholder="Describe your project, its features, and your role..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/2000 characters
                  </p>
                </div>

                {/* Skills Used */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Skills Used
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
                      placeholder="Ex: React, Node.js"
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
                    {formData.skillsUsed.map((skill, idx) => (
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

                {/* Media Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Images (Max 4)
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-neutral-700 border-dashed rounded-lg cursor-pointer bg-neutral-800 hover:bg-neutral-700 transition-all"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG or GIF (MAX. 4 images total)
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>

                    {/* Previews */}
                    {(existingImages.length > 0 || previewUrls.length > 0) && (
                      <div className="grid grid-cols-4 gap-2">
                        {existingImages.map((url, idx) => (
                          <div
                            key={`existing-${idx}`}
                            className="relative h-20 rounded-lg overflow-hidden border border-neutral-700 group"
                          >
                            <img
                              src={url}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removeExistingImage(idx)}
                              className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {previewUrls.map((url, idx) => (
                          <div
                            key={`new-${idx}`}
                            className="relative h-20 rounded-lg overflow-hidden border border-neutral-700 group"
                          >
                            <img
                              src={url}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removeNewImage(idx)}
                              className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project URL
                    </label>
                    <input
                      type="url"
                      name="projectUrl"
                      value={formData.projectUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                      placeholder="https://project-demo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
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

                {/* Is Ongoing */}
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
                    This project is ongoing
                  </label>
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
                  disabled={!formData.name || !formData.description}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingProject ? "Update" : "Add"} Project
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileProjects;
