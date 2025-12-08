"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  X,
  Plus,
  MapPin,
  Loader2,
  FileText,
  ChevronDown,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useJobs } from "@/context/JobsContext";
import { toast } from "react-toastify";
import Image from "next/image";

const MapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full bg-gray-700 animate-pulse rounded-lg" />
  ),
});

const CreateJobPage = () => {
  const { createJob } = useJobs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [industrySearch, setIndustrySearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [serviceInput, setServiceInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    industry: "",
    category: "",
    mode: ["paid"], // Array of strings: paid, hybrid, barter
    servicesOffered: [],
    skillsRequired: [],
    deadline: "",
    applicationDeadline: "",
    removeDate: "",
    location: {
      type: "Point",
      coordinates: {
        type: "Point",
        coordinates: [0, 0],
      },
      address: "",
      city: "",
      country: "",
    },
  });

  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const industries = {
    Technology: [
      "Software Development",
      "Data Science",
      "Cybersecurity",
      "IT Support",
      "Cloud Computing",
      "AI/Machine Learning",
      "DevOps",
      "Quality Assurance",
      "Network Administration",
      "Database Administration",
    ],
    Creative: [
      "Graphic Design",
      "Content Writing",
      "Video Editing",
      "UI/UX Design",
      "Photography",
      "Animation",
      "Music Production",
      "Illustration",
      "Copywriting",
      "Art Direction",
    ],
    Business: [
      "Marketing",
      "Finance",
      "Human Resources",
      "Sales",
      "Business Analysis",
      "Management Consulting",
      "Accounting",
      "Operations Management",
      "Supply Chain Management",
      "Business Development",
    ],
    Education: [
      "Teaching",
      "Curriculum Development",
      "Tutoring",
      "Educational Administration",
      "Training & Development",
      "Academic Research",
      "E-Learning Development",
      "School Counseling",
    ],
    Healthcare: [
      "Nursing",
      "Medical Administration",
      "Telehealth",
      "Medical Coding",
      "Pharmacy",
      "Physical Therapy",
      "Mental Health Counseling",
      "Medical Research",
      "Healthcare IT",
      "Public Health",
    ],
    Engineering: [
      "Mechanical Engineering",
      "Electrical Engineering",
      "Civil Engineering",
      "Chemical Engineering",
      "Aerospace Engineering",
      "Industrial Engineering",
      "Environmental Engineering",
      "Biomedical Engineering",
    ],
    Finance: [
      "Investment Banking",
      "Financial Planning",
      "Risk Management",
      "Insurance",
      "Wealth Management",
      "Real Estate Finance",
      "Trading",
      "Audit",
    ],
    "Legal Services": [
      "Corporate Law",
      "Criminal Law",
      "Paralegal Services",
      "Legal Research",
      "Compliance",
      "Intellectual Property Law",
      "Contract Management",
    ],
    Manufacturing: [
      "Production Management",
      "Quality Control",
      "Process Engineering",
      "Assembly",
      "Logistics",
      "Maintenance",
      "Industrial Design",
    ],
    "Retail & E-commerce": [
      "Store Management",
      "Merchandising",
      "Customer Service",
      "E-commerce Management",
      "Inventory Management",
      "Visual Merchandising",
      "Buying",
    ],
    "Hospitality & Tourism": [
      "Hotel Management",
      "Event Planning",
      "Travel Agent",
      "Restaurant Management",
      "Tourism Marketing",
      "Catering",
      "Guest Services",
    ],
    Construction: [
      "Project Management",
      "Architecture",
      "Carpentry",
      "Plumbing",
      "Electrical Work",
      "Surveying",
      "Construction Safety",
      "Estimating",
    ],
    Transportation: [
      "Logistics",
      "Fleet Management",
      "Aviation",
      "Maritime Operations",
      "Supply Chain",
      "Dispatch",
      "Transportation Planning",
    ],
    "Media & Communications": [
      "Journalism",
      "Public Relations",
      "Broadcasting",
      "Social Media Management",
      "Media Planning",
      "Communications Strategy",
      "Podcasting",
    ],
    "Real Estate": [
      "Real Estate Agent",
      "Property Management",
      "Real Estate Development",
      "Appraisal",
      "Leasing",
      "Commercial Real Estate",
    ],
    "Non-Profit": [
      "Fundraising",
      "Program Management",
      "Grant Writing",
      "Community Outreach",
      "Volunteer Coordination",
      "Advocacy",
      "Social Work",
    ],
    Agriculture: [
      "Farming",
      "Agricultural Science",
      "Livestock Management",
      "Agribusiness",
      "Farm Management",
      "Agricultural Engineering",
      "Food Safety",
    ],
    Energy: [
      "Renewable Energy",
      "Oil & Gas",
      "Power Generation",
      "Energy Consulting",
      "Utilities Management",
      "Energy Trading",
    ],
    "Government & Public Sector": [
      "Public Administration",
      "Policy Analysis",
      "Urban Planning",
      "Emergency Management",
      "Law Enforcement",
      "Military",
      "Diplomacy",
    ],
    "Arts & Entertainment": [
      "Acting",
      "Film Production",
      "Game Design",
      "Museum Curation",
      "Theater Management",
      "Music Performance",
      "Dance",
      "Event Production",
    ],
    "Science & Research": [
      "Laboratory Research",
      "Clinical Research",
      "Data Analysis",
      "Environmental Science",
      "Biotechnology",
      "Pharmaceuticals",
      "Astronomy",
    ],
    "Sports & Fitness": [
      "Personal Training",
      "Sports Management",
      "Coaching",
      "Athletic Training",
      "Sports Marketing",
      "Nutrition",
      "Recreation Management",
    ],
    Telecommunications: [
      "Network Engineering",
      "Telecom Sales",
      "Customer Support",
      "RF Engineering",
      "Infrastructure Management",
    ],
    "Consumer Services": [
      "Beauty & Cosmetology",
      "Personal Care",
      "Cleaning Services",
      "Repair Services",
      "Pet Care",
      "Child Care",
    ],
  };

  const filteredIndustries = Object.keys(industries).filter((ind) =>
    ind.toLowerCase().includes(industrySearch.toLowerCase())
  );

  const filteredCategories =
    formData.industry && industries[formData.industry]
      ? industries[formData.industry].filter((cat) =>
          cat.toLowerCase().includes(categorySearch.toLowerCase())
        )
      : [];

  useEffect(() => {
    const searchLocation = async () => {
      if (locationSearch.length > 2) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
              locationSearch
            )}`
          );
          const data = await response.json();
          setLocationSuggestions(data);
        } catch (error) {
          console.error("Error searching location:", error);
        }
      } else {
        setLocationSuggestions([]);
      }
    };

    const timeoutId = setTimeout(searchLocation, 500);
    return () => clearTimeout(timeoutId);
  }, [locationSearch]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (attachments.length + files.length > 4) {
      alert("Maximum 4 files allowed");
      return;
    }

    const newAttachments = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "document",
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    URL.revokeObjectURL(attachments[index].preview);
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const addService = () => {
    if (
      serviceInput.trim() &&
      !formData.servicesOffered.includes(serviceInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        servicesOffered: [...prev.servicesOffered, serviceInput.trim()],
      }));
      setServiceInput("");
    }
  };

  const removeService = (service) => {
    setFormData((prev) => ({
      ...prev,
      servicesOffered: prev.servicesOffered.filter((s) => s !== service),
    }));
  };

  const addSkill = () => {
    if (
      skillInput.trim() &&
      !formData.skillsRequired.includes(skillInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((s) => s !== skill),
    }));
  };

  const getCurrentLocation = () => {
    setLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();

            const address = data.address || {};
            const city =
              address.city ||
              address.town ||
              address.village ||
              address.hamlet ||
              address.suburb ||
              address.county ||
              "";
            const country = address.country || "";

            setFormData((prev) => ({
              ...prev,
              location: {
                type: "Point",
                coordinates: {
                  type: "Point",
                  coordinates: [longitude, latitude],
                },
                address: data.display_name,
                city,
                country,
              },
            }));
            setLocationSearch(data.display_name);
            setShowMap(true);
          } catch (error) {
            console.error("Error getting location details:", error);
          } finally {
            setLoadingLocation(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoadingLocation(false);
        }
      );
    }
  };

  const selectLocation = (location) => {
    const address = location.address || {};
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.hamlet ||
      address.suburb ||
      address.county ||
      "";
    const country = address.country || "";

    setFormData((prev) => ({
      ...prev,
      location: {
        type: "Point",
        coordinates: {
          type: "Point",
          coordinates: [parseFloat(location.lon), parseFloat(location.lat)],
        },
        address: location.display_name,
        city,
        country,
      },
    }));
    setLocationSearch(location.display_name);
    setLocationSuggestions([]);
    setShowMap(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "location") {
          submitData.append("location", JSON.stringify(formData.location));
        } else if (Array.isArray(formData[key])) {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });
      attachments.forEach((att) => {
        submitData.append("attachments", att.file);
      });
      await createJob(submitData);
      window.location.href = "/dashboard/jobs";
    } catch (error) {
      toast.error("Error creating job:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Job</h1>
          <p className="text-gray-400 mb-8">
            Fill in the details to post a new job opportunity
          </p>

          <div className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-white font-medium mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                placeholder="e.g., Full Stack Developer"
                maxLength={100}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-medium mb-2">
                Job Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 min-h-32"
                placeholder="Describe the job requirements, responsibilities, and expectations..."
                maxLength={5000}
                required
              />
              <p className="text-gray-400 text-sm mt-1">
                {formData.description.length}/5000 characters
              </p>
            </div>

            {/* Industry */}
            <div className="relative">
              <label className="block text-white font-medium mb-2">
                Industry
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={industrySearch}
                  onFocus={() => setShowIndustryDropdown(true)}
                  onBlur={() =>
                    setTimeout(() => setShowIndustryDropdown(false), 200)
                  }
                  onChange={(e) => {
                    setIndustrySearch(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      industry: e.target.value,
                      category: "",
                    }));
                  }}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 pr-10"
                  placeholder="Select or search industry..."
                />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
              {showIndustryDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg max-h-60 overflow-y-auto shadow-lg">
                  {filteredIndustries.length > 0 ? (
                    filteredIndustries.map((industry) => (
                      <div
                        key={industry}
                        onMouseDown={() => {
                          setFormData((prev) => ({
                            ...prev,
                            industry,
                            category: "",
                          }));
                          setIndustrySearch(industry);
                          setCategorySearch("");
                          setShowIndustryDropdown(false);
                        }}
                        className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors border-b border-gray-700/50 last:border-0"
                      >
                        {industry}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-400">
                      No industries found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Category */}
            {formData.industry && (
              <div className="relative">
                <label className="block text-white font-medium mb-2">
                  Category
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={categorySearch}
                    onFocus={() => setShowCategoryDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => setShowCategoryDropdown(false), 200)
                    }
                    onChange={(e) => {
                      setCategorySearch(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }));
                    }}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 pr-10"
                    placeholder="Select or search category..."
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
                {showCategoryDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg max-h-60 overflow-y-auto shadow-lg">
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((category) => (
                        <div
                          key={category}
                          onMouseDown={() => {
                            setFormData((prev) => ({ ...prev, category }));
                            setCategorySearch(category);
                            setShowCategoryDropdown(false);
                          }}
                          className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors border-b border-gray-700/50 last:border-0"
                        >
                          {category}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-400">
                        No categories found
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Mode */}
            <div>
              <label className="block text-white font-medium mb-2">
                Job Mode *{" "}
                <span className="text-gray-400 text-sm font-normal">
                  (Select up to 3)
                </span>
              </label>
              <div className="flex gap-4">
                {["paid", "hybrid", "barter"].map((mode) => (
                  <label
                    key={mode}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="mode"
                      value={mode}
                      checked={formData.mode.includes(mode)}
                      onChange={(e) => {
                        const { value, checked } = e.target;
                        setFormData((prev) => {
                          let newModes = [...prev.mode];
                          if (checked) {
                            if (!newModes.includes(value)) newModes.push(value);
                          } else {
                            newModes = newModes.filter((m) => m !== value);
                          }
                          return { ...prev, mode: newModes };
                        });
                      }}
                      className="mr-2 w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700"
                    />
                    <span className="text-white capitalize">{mode}</span>
                  </label>
                ))}
              </div>
              {formData.mode.length === 0 && (
                <p className="text-red-500 text-sm mt-1">
                  Please select at least one mode.
                </p>
              )}
            </div>

            {/* Services Offered (for Hybrid/Barter) */}
            {(formData.mode.includes("hybrid") ||
              formData.mode.includes("barter")) && (
              <div>
                <label className="block text-white font-medium mb-2">
                  Services Offered in Return
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addService())
                    }
                    className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                    placeholder="e.g., Web Design, Marketing Support..."
                  />
                  <button
                    type="button"
                    onClick={addService}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.servicesOffered.map((service, index) => (
                    <span
                      key={index}
                      className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {service}
                      <X
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => removeService(service)}
                      />
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Required */}
            <div>
              <label className="block text-white font-medium mb-2">
                Skills Required
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSkill())
                  }
                  className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  placeholder="e.g., React, Node.js, Python..."
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-6 py-3 cursor-pointer bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skillsRequired.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <X
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    />
                  </span>
                ))}
              </div>
            </div>

            {/* Application Deadline */}
            <div>
              <label className="block text-white font-medium mb-2">
                Last Date to Apply
              </label>
              <input
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    applicationDeadline: e.target.value,
                  }))
                }
                min={new Date().toISOString().split("T")[0]}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
              />
              <p className="text-gray-400 text-sm mt-1">
                When should this job stop accepting applications?
              </p>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Project Completion Date
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, deadline: e.target.value }))
                }
                min={new Date().toISOString().split("T")[0]}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
              />
              <p className="text-gray-400 text-sm mt-1">
                When do you need this project/service completed by?
              </p>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Remove Post On
              </label>
              <input
                type="date"
                value={formData.removeDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    removeDate: e.target.value,
                  }))
                }
                min={new Date().toISOString().split("T")[0]}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
              />
              <p className="text-gray-400 text-sm mt-1">
                Date when this job post will be automatically removed from the
                list.
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-white font-medium mb-2">
                Location
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  placeholder="Search for a location..."
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={loadingLocation}
                  className="px-4 py-3 cursor-pointer bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
                >
                  {loadingLocation ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <MapPin className="w-5 h-5" />
                  )}
                  Use Current
                </button>
              </div>

              {locationSuggestions.length > 0 && (
                <div className="bg-gray-700 border border-gray-600 rounded-lg max-h-48 overflow-y-auto">
                  {locationSuggestions.map((location, index) => (
                    <div
                      key={index}
                      onClick={() => selectLocation(location)}
                      className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white text-sm"
                    >
                      {location.display_name}
                    </div>
                  ))}
                </div>
              )}

              {showMap &&
                formData.location.coordinates.coordinates[0] !== 0 && (
                  <div className="mt-4">
                    <MapComponent
                      coordinates={formData.location.coordinates.coordinates}
                    />
                  </div>
                )}
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-white font-medium mb-2">
                Attachments (Max 4 files)
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={attachments.length >= 4}
                />
                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer ${
                    attachments.length >= 4
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-400">
                    Click to upload images, PDFs, or Word documents
                  </p>
                  <p className="text-gray-500 text-sm mt-1">Maximum 4 files</p>
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="relative bg-gray-700 rounded-lg p-4"
                    >
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="absolute cursor-pointer top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {attachment.type === "image" ? (
                        <Image
                          width={200}
                          height={200}
                          src={attachment.preview}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-32">
                          <FileText className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <p className="text-white text-sm mt-2 truncate">
                        {attachment.file.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-purple-600 cursor-pointer hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Job...
                  </>
                ) : (
                  "Create Job"
                )}
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-8 bg-gray-700 hover:bg-gray-600 cursor-pointer text-white font-medium py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPage;
