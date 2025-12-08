"use client";
import React, { useState } from "react";
import {
  Edit2,
  X,
  Plus,
  Trash2,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Repeat2,
  Users,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const ServicesSection = () => {
  const [services, setServices] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Programming & Tech",
    modesAvailable: [],
    deliveryOptions: [],
    location: { city: "", country: "" },
    skillLevel: "all-levels",
    requirements: "",
    media: { images: [], video: "", links: [] },
    availability: { schedule: [], timezone: "UTC" },
  });

  const [linkInput, setLinkInput] = useState("");
  const [imageInput, setImageInput] = useState("");

  const categories = [
    "Programming & Tech",
    "Design & Creative",
    "Music & Arts",
    "Language Learning",
    "Business & Marketing",
    "Cooking & Culinary",
    "Fitness & Sports",
    "Photography & Video",
    "Writing & Content",
    "Crafts & DIY",
    "Other",
  ];

  const skillLevels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "all-levels", label: "All Levels" },
  ];

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      name: "",
      description: "",
      category: "Programming & Tech",
      modesAvailable: [],
      deliveryOptions: [],
      location: { city: "", country: "" },
      skillLevel: "all-levels",
      requirements: "",
      media: { images: [], video: "", links: [] },
      availability: { schedule: [], timezone: "UTC" },
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      modesAvailable: service.modesAvailable,
      deliveryOptions: service.deliveryOptions,
      location: service.location,
      skillLevel: service.skillLevel,
      requirements: service.requirements || "",
      media: service.media,
      availability: service.availability,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (field, value) => {
    setFormData((prev) => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const addLink = () => {
    if (linkInput.trim() && formData.media.links.length < 5) {
      setFormData((prev) => ({
        ...prev,
        media: {
          ...prev.media,
          links: [...prev.media.links, linkInput.trim()],
        },
      }));
      setLinkInput("");
    }
  };

  const removeLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        links: prev.media.links.filter((_, i) => i !== index),
      },
    }));
  };

  const addImage = () => {
    if (imageInput.trim() && formData.media.images.length < 4) {
      setFormData((prev) => ({
        ...prev,
        media: {
          ...prev.media,
          images: [...prev.media.images, imageInput.trim()],
        },
      }));
      setImageInput("");
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        images: prev.media.images.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSave = () => {
    if (editingService) {
      setServices(
        services.map((service) =>
          service._id === editingService._id
            ? { ...formData, _id: service._id, isActive: service.isActive }
            : service
        )
      );
    } else {
      const newService = {
        ...formData,
        _id: Date.now().toString(),
        isActive: true,
      };
      setServices([newService, ...services]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setServices(services.filter((service) => service._id !== id));
  };

  const getModeIcons = (modes) => {
    return modes.map((mode) => {
      if (mode === "paid") return <DollarSign key={mode} className="w-4 h-4" />;
      if (mode === "barter") return <Repeat2 key={mode} className="w-4 h-4" />;
      if (mode === "hybrid") return <Users key={mode} className="w-4 h-4" />;
      return null;
    });
  };

  return (
    <>
      <section className="max-w-4xl bg-neutral-950 shadow-2xl my-10 border-neutral-700 border p-10 mx-auto rounded-xl overflow-hidden mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-purple-500">
            Services
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

        <div className="space-y-6">
          {services.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No services added yet.</p>
              <button
                onClick={openAddModal}
                className="mt-4 cursor-pointer px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Add Service
              </button>
            </div>
          ) : (
            services.map((service) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-neutral-700 rounded-lg overflow-hidden hover:border-purple-500/50 transition-all group"
              >
                {service.media.images.length > 0 && (
                  <div className="w-full h-48 overflow-hidden bg-neutral-800">
                    <Image
                      width={500}
                      height={500}
                      src={service.media.images[0]}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                        <div className="flex gap-1">
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
                        {service.location.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {service.location.city}, {service.location.country}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {service.skillLevel}
                        </span>
                        {service.deliveryOptions.map((option) => (
                          <span key={option} className="capitalize">
                            {option}
                          </span>
                        ))}
                      </div>

                      {service.availability.schedule.length > 0 && (
                        <div className="text-xs text-gray-500">
                          Available:{" "}
                          {service.availability.schedule
                            .map((s) => s.day)
                            .join(", ")}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openEditModal(service)}
                        className="p-2 text-purple-400 hover:bg-purple-900/30 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(service._id)}
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

      {/* Add/Edit Modal */}
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
              className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-neutral-900 border-b border-neutral-700 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-2xl font-bold text-white">
                  {editingService ? "Edit Service" : "Add Service"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    maxLength={100}
                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                    placeholder="Ex: Web Development Services"
                    required
                  />
                </div>

                {/* Category & Skill Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Skill Level
                    </label>
                    <select
                      name="skillLevel"
                      value={formData.skillLevel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                    >
                      {skillLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
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
                    maxLength={1000}
                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all resize-none"
                    placeholder="Describe your service..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/1000
                  </p>
                </div>

                {/* Modes Available */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Modes Available *
                  </label>
                  <div className="flex gap-4">
                    {["paid", "hybrid", "barter"].map((mode) => (
                      <label
                        key={mode}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.modesAvailable.includes(mode)}
                          onChange={() =>
                            handleCheckboxChange("modesAvailable", mode)
                          }
                          className="w-4 h-4 text-purple-600 bg-neutral-800 border-neutral-700 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-300 capitalize">
                          {mode}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Delivery Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Delivery Options
                  </label>
                  <div className="flex gap-4">
                    {["online", "in-person"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.deliveryOptions.includes(option)}
                          onChange={() =>
                            handleCheckboxChange("deliveryOptions", option)
                          }
                          className="w-4 h-4 text-purple-600 bg-neutral-800 border-neutral-700 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-300 capitalize">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                      placeholder="Ex: Lahore"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="location.country"
                      value={formData.location.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                      placeholder="Ex: Pakistan"
                    />
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Requirements
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows={3}
                    maxLength={1000}
                    className="w-full px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all resize-none"
                    placeholder="Any requirements from clients..."
                  />
                </div>

                {/* Media - Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Images (Max 4)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                      placeholder="Image URL"
                    />
                    <button
                      type="button"
                      onClick={addImage}
                      disabled={formData.media.images.length >= 4}
                      className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.media.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt=""
                          className="w-20 h-20 object-cover rounded"
                        />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Media - Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Links
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-neutral-800 text-white transition-all"
                      placeholder="Portfolio or project link"
                    />
                    <button
                      type="button"
                      onClick={addLink}
                      className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.media.links.map((link, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 bg-neutral-800 rounded"
                      >
                        <LinkIcon className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-gray-300 flex-1 truncate">
                          {link}
                        </span>
                        <button
                          onClick={() => removeLink(idx)}
                          className="text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

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
                    !formData.name ||
                    !formData.description ||
                    formData.modesAvailable.length === 0
                  }
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingService ? "Update" : "Add"} Service
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ServicesSection;
