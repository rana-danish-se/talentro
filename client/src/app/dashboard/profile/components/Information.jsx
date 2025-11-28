"use client";
import { Edit2, X, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/context/ProfileContext";
import { toast } from "react-toastify";

const Information = () => {
  const { profile, updateProfile, updateContactInfo } = useProfile();

  // Display states (synced from profile)
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("No headline");
  const [location, setLocation] = useState({
    city: "City",
    country: "Country",
  });

  // Modal states
  const [isBasicInfoModalOpen, setIsBasicInfoModalOpen] = useState(false);
  const [isContactInfoModalOpen, setIsContactInfoModalOpen] = useState(false);

  // Basic Info Form States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [editHeadline, setEditHeadline] = useState("");
  const [industry, setIndustry] = useState("Information Technology");
  const [industrySearch, setIndustrySearch] = useState("");
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneType, setPhoneType] = useState("Mobile");
  const [websites, setWebsites] = useState([{ url: "", type: "Personal" }]);

  const industries = [
    "Information Technology",
    "Software Development",
    "Web Development",
    "Data Science",
    "Artificial Intelligence",
    "Cybersecurity",
    "Cloud Computing",
    "Mobile App Development",
    "FinTech",
    "Blockchain",
    "Gaming",
    "IT Services & Consulting",
    "Telecommunications",
    "Electronics Manufacturing",
    "Aerospace & Defense",
    "Automotive",
    "Manufacturing",
    "Construction",
    "Real Estate",
    "Agriculture",
    "Forestry",
    "Fishing",
    "Mining",
    "Oil & Gas",
    "Renewable Energy",
    "Utilities",
    "Logistics & Supply Chain",
    "Transportation",
    "Warehousing",
    "Wholesale Trade",
    "Retail",
    "E-commerce",
    "Banking",
    "Insurance",
    "Accounting",
    "Investment / Asset Management",
    "Business Consulting",
    "Legal Services",
    "Human Resources",
    "Marketing",
    "Digital Marketing",
    "Advertising",
    "Design",
    "Media & Broadcasting",
    "Film & Television",
    "Publishing",
    "Photography",
    "Music & Entertainment",
    "Healthcare",
    "Medical Devices",
    "Biotechnology",
    "Pharmaceuticals",
    "Life Sciences",
    "Research & Development",
    "Education",
    "EdTech",
    "Government",
    "Public Administration",
    "Nonprofit / NGO",
    "Social Services",
    "Hospitality",
    "Tourism",
    "Restaurants & Food Services",
    "Sports & Recreation",
    "Beauty & Personal Care",
    "Customer Support",
    "General Services",
    "Freelancing",
    "Other",
  ];

  const phoneTypes = ["Mobile", "Home", "Work"];

  const websiteTypes = [
    "Portfolio",
    "Personal",
    "Company",
    "Blog",
    "GitHub",
    "LinkedIn",
    "Other",
  ];

  useEffect(() => {
    if (profile) {
      setFullName(`${profile.firstName || ""} ${profile.lastName || ""}`);
      setHeadline(profile.headline || "No headline");
      setLocation({
        city: profile.location?.city || "City",
        country: profile.location?.country || "Country",
      });

      // Form states
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setEditHeadline(profile.headline || "");
      setIndustry(profile.industry || "Information Technology");
      setIndustrySearch(profile.industry || "Information Technology");
      setCity(profile.location?.city || "");
      setCountry(profile.location?.country || "");

      if (profile.contactInfo) {
        setEmail(profile.contactInfo.primaryEmail || "");
        setPhoneNumber(profile.contactInfo.phoneNumber || "");
        setPhoneType(profile.contactInfo.phoneType || "Mobile");
        if (
          profile.contactInfo.websites &&
          profile.contactInfo.websites.length > 0
        ) {
          setWebsites(profile.contactInfo.websites);
        }
      }
    }
  }, [profile]);

  const handleSaveBasicInfo = async () => {
    const updateData = {
      firstName,
      lastName,
      headline: editHeadline,
      industry,
      city,
      country,
    };
    const result = await updateProfile(updateData);
    if (result.success) {
      toast.success("Profile updated successfully.");
      setIsBasicInfoModalOpen(false);
    }
  };

  const handleSaveContactInfo = async () => {
    const updateData = {
      phoneNumber,
      phoneType,
      websites,
    };

    const result = await updateContactInfo(updateData);
    if (result.success) {
      setIsContactInfoModalOpen(false);
    }
  };

  const addWebsite = () => {
    setWebsites([...websites, { url: "", type: "Personal" }]);
  };

  const removeWebsite = (index) => {
    setWebsites(websites.filter((_, i) => i !== index));
  };

  const updateWebsite = (index, field, value) => {
    const updatedWebsites = [...websites];
    updatedWebsites[index][field] = value;
    setWebsites(updatedWebsites);
  };

  return (
    <>
      <div className="px-10 flex items-start justify-between">
        <div className="max-w-2xl">
          <h1 className="text-2xl md:text-4xl text-purple-500 font-bold">
            {fullName}
          </h1>
          <p className="text-md mt-2">{headline}</p>
          <div className="flex items-center gap-2 w-fit">
            <p className="text-sm text-neutral-500 mt-2">
              {location.city}, {location.country}
            </p>
            <button
              onClick={() => setIsContactInfoModalOpen(true)}
              className="text-sm hover:underline text-purple-500 cursor-pointer mt-2"
            >
              Contact Info
            </button>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsBasicInfoModalOpen(true)}
          className="text-purple-500 cursor-pointer p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition-all"
        >
          <Edit2 className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Basic Info Modal */}
      <AnimatePresence>
        {isBasicInfoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsBasicInfoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Basic Information
                </h3>
                <button
                  onClick={() => setIsBasicInfoModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 cursor-pointer dark:text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* Headline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Headline *
                  </label>
                  <textarea
                    value={editHeadline}
                    onChange={(e) => setEditHeadline(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none"
                    placeholder="Enter your professional headline"
                  />
                </div>

                {/* Industry */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Industry *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={industrySearch}
                      onChange={(e) => {
                        setIndustrySearch(e.target.value);
                        setIndustry(e.target.value);
                        setShowIndustryDropdown(true);
                      }}
                      onFocus={() => setShowIndustryDropdown(true)}
                      onBlur={() =>
                        setTimeout(() => setShowIndustryDropdown(false), 200)
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="Search or type industry..."
                    />
                    <AnimatePresence>
                      {showIndustryDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                        >
                          {industries
                            .filter((ind) =>
                              ind
                                .toLowerCase()
                                .includes(industrySearch.toLowerCase())
                            )
                            .map((ind) => (
                              <button
                                key={ind}
                                onClick={() => {
                                  setIndustry(ind);
                                  setIndustrySearch(ind);
                                  setShowIndustryDropdown(false);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300 transition-colors"
                              >
                                {ind}
                              </button>
                            ))}
                          {industries.filter((ind) =>
                            ind
                              .toLowerCase()
                              .includes(industrySearch.toLowerCase())
                          ).length === 0 && (
                            <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                              No matches found
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="Enter country"
                    />
                  </div>
                </div>

                {/* Edit Contact Info Button */}
                <button
                  onClick={() => {
                    setIsBasicInfoModalOpen(false);
                    setIsContactInfoModalOpen(true);
                  }}
                  className="w-full  text-purple-400 rounded-lg font-semibold  cursor-pointer text-left text-sm transition-all"
                >
                  Edit Contact Info
                </button>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setIsBasicInfoModalOpen(false)}
                  className="px-6 py-2.5 cursor-pointer border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveBasicInfo}
                  className="px-6 py-2.5 cursor-pointer bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Info Modal */}
      <AnimatePresence>
        {isContactInfoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsContactInfoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Contact Information
                </h3>
                <button
                  onClick={() => setIsContactInfoModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                {/* Phone Number & Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Type
                    </label>
                    <select
                      value={phoneType}
                      onChange={(e) => setPhoneType(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    >
                      {phoneTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Websites Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Websites
                    </label>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addWebsite}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Website
                    </motion.button>
                  </div>

                  <div className="space-y-3">
                    {websites.map((website, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 space-y-3">
                            <input
                              type="url"
                              value={website.url}
                              onChange={(e) =>
                                updateWebsite(index, "url", e.target.value)
                              }
                              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                              placeholder="https://example.com"
                            />
                            <select
                              value={website.type}
                              onChange={(e) =>
                                updateWebsite(index, "type", e.target.value)
                              }
                              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                            >
                              {websiteTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          </div>
                          {websites.length > 1 && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeWebsite(index)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setIsContactInfoModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveContactInfo}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Information;
