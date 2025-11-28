"use client";
import { Edit2, X, Plus, Trash2, FolderOpen, Calendar, ExternalLink, Github, Link2, Image, Video, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

const ProfileProjects = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "E-Commerce Platform",
      description: "A full-stack e-commerce platform built with MERN stack featuring real-time inventory management, secure payment integration with Stripe, and advanced search functionality. Implemented responsive design and optimized performance for seamless user experience.",
      skillsUsed: ["React", "Node.js", "MongoDB", "Express", "Stripe", "Redux"],
      media: [
        { type: "image", url: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800", thumbnail: "https://images.unsplash.com/photo-1557821552-17105176677c?w=200" }
      ],
      projectUrl: "https://ecommerce-demo.com",
      githubUrl: "https://github.com/username/ecommerce",
      startDate: "2024-01-01",
      endDate: "2024-06-01",
      isOngoing: false
    },
    {
      id: 2,
      name: "AI Chat Application",
      description: "Real-time chat application powered by AI with natural language processing capabilities. Features include smart replies, sentiment analysis, and multi-language support.",
      skillsUsed: ["Next.js", "TypeScript", "Socket.io", "OpenAI", "TailwindCSS"],
      media: [
        { type: "image", url: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800", thumbnail: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=200" }
      ],
      projectUrl: "https://ai-chat-demo.com",
      githubUrl: "https://github.com/username/ai-chat",
      startDate: "2024-08-01",
      endDate: null,
      isOngoing: true
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    skillsUsed: [],
    media: [],
    projectUrl: "",
    githubUrl: "",
    startDate: "",
    endDate: "",
    isOngoing: false
  });

  const [skillInput, setSkillInput] = useState("");
  const [mediaInput, setMediaInput] = useState({ type: "image", url: "", thumbnail: "" });

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      name: "",
      description: "",
      skillsUsed: [],
      media: [],
      projectUrl: "",
      githubUrl: "",
      startDate: "",
      endDate: "",
      isOngoing: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      skillsUsed: project.skillsUsed || [],
      media: project.media || [],
      projectUrl: project.projectUrl || "",
      githubUrl: project.githubUrl || "",
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      isOngoing: project.isOngoing
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'isOngoing' && checked) {
      setFormData(prev => ({ ...prev, endDate: "" }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skillsUsed.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsUsed: [...prev.skillsUsed, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skillsUsed: prev.skillsUsed.filter(s => s !== skill)
    }));
  };

  const addMedia = () => {
    if (mediaInput.url.trim()) {
      setFormData(prev => ({
        ...prev,
        media: [...prev.media, { ...mediaInput }]
      }));
      setMediaInput({ type: "image", url: "", thumbnail: "" });
    }
  };

  const removeMedia = (index) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (editingProject) {
      setProjects(projects.map(proj => 
        proj.id === editingProject.id 
          ? { ...formData, id: proj.id }
          : proj
      ));
    } else {
      const newProject = {
        ...formData,
        id: Date.now()
      };
      setProjects([newProject, ...projects]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setProjects(projects.filter(proj => proj.id !== id));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <>
      <section className='max-w-4xl bg-neutral-950 shadow-2xl my-10 border-neutral-700 border p-10 mx-auto rounded-xl overflow-hidden mt-10'>
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
          {projects.length === 0 ? (
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
            projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-neutral-700 rounded-lg overflow-hidden hover:border-purple-500/50 transition-all group"
              >
                {/* Project Image */}
                {project.media && project.media.length > 0 && (
                  <div className="w-full h-48 overflow-hidden bg-neutral-800">
                    <img
                      src={project.media[0].url}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
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
                          {formatDate(project.startDate)} - {' '}
                          {project.isOngoing ? 'Present' : formatDate(project.endDate)}
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
                        onClick={() => handleDelete(project.id)}
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
                  {editingProject ? 'Edit Project' : 'Add Project'}
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
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
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

                {/* Media */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Media
                  </label>
                  <div className="space-y-3 mb-3">
                    <select
                      value={mediaInput.type}
                      onChange={(e) => setMediaInput({ ...mediaInput, type: e.target.value })}
                      className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="link">Link</option>
                    </select>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={mediaInput.url}
                        onChange={(e) => setMediaInput({ ...mediaInput, url: e.target.value })}
                        className="flex-1 px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                        placeholder="Media URL (Unsplash, YouTube, etc.)"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={addMedia}
                        className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                      >
                        Add
                      </motion.button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {formData.media.map((item, idx) => (
                      <div
                        key={idx}
                        className="relative border border-neutral-700 rounded-lg p-3 group"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {item.type === 'image' && <Image className="w-4 h-4 text-purple-400" />}
                          {item.type === 'video' && <Video className="w-4 h-4 text-purple-400" />}
                          {item.type === 'link' && <Link2 className="w-4 h-4 text-purple-400" />}
                          <span className="text-xs text-gray-400 truncate flex-1">{item.url}</span>
                        </div>
                        <button
                          onClick={() => removeMedia(idx)}
                          className="absolute top-2 right-2 p-1 bg-red-500/20 text-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
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
                  <label htmlFor="isOngoing" className="text-sm text-gray-300 cursor-pointer">
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
                  {editingProject ? 'Update' : 'Add'} Project
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