"use client";

import React, { useState, useEffect } from "react";
import { Upload, X, Plus, MapPin, Loader2, FileText } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useJobs } from "@/context/JobsContext";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";

const MapComponent = dynamic(
  () => import("../../create-job/components/MapComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full bg-gray-700 animate-pulse rounded-lg" />
    ),
  }
);

const EditJobPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { fetchJobById, updateJob, currentJob, loading } = useJobs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [industrySearch, setIndustrySearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [serviceInput, setServiceInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    industry: "",
    category: "",
    mode: ["paid"], // paid, hybrid, barter
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

  const industries = {
    Technology: [
      "Software Development",
      "Data Science",
      "Cybersecurity",
      "IT Support",
    ],
    Creative: [
      "Graphic Design",
      "Content Writing",
      "Video Editing",
      "UI/UX Design",
    ],
    Business: ["Marketing", "Finance", "Human Resources", "Sales"],
    Education: ["Teaching", "Curriculum Development", "Tutoring"],
    Healthcare: ["Nursing", "Medical Administration", "Telehealth"],
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
    const loadJob = async () => {
      if (id) {
        setInitialLoading(true);
        const result = await fetchJobById(id);
        if (result?.success) {
          const job = result.data;
          setFormData({
            title: job.title,
            description: job.description,
            industry: job.industry || "",
            category: job.category || "",
            mode: Array.isArray(job.mode) ? job.mode : [job.mode || "paid"],
            servicesOffered: job.servicesOffered || [],
            skillsRequired: job.skillsRequired || [],
            deadline: job.deadline
              ? new Date(job.deadline).toISOString().split("T")[0]
              : "",
            applicationDeadline: job.applicationDeadline
              ? new Date(job.applicationDeadline).toISOString().split("T")[0]
              : "",
            removeDate: job.removeDate
              ? new Date(job.removeDate).toISOString().split("T")[0]
              : "",
            location: job.location || {
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
          setIndustrySearch(job.industry || "");
          setCategorySearch(job.category || "");
          if (job.location?.address) {
            setLocationSearch(job.location.address);
            setShowMap(true);
          }
          setExistingAttachments(job.attachments || []);
        }
        setInitialLoading(false);
      }
    };
    loadJob();
  }, [id, fetchJobById]);

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
    if (attachments.length + existingAttachments.length + files.length > 4) {
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

  const removeExistingAttachment = (index) => {
    setExistingAttachments((prev) => prev.filter((_, i) => i !== index));
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

      // Append new attachments
      attachments.forEach((att) => {
        submitData.append("attachments", att.file);
      });

      // Append existing attachments (backend needs to handle this, usually by keeping them if not replaced, or we send a list of kept URLs)
      // Since the backend updateJob implementation appends new files to existing ones, we might need to handle deletions differently.
      // Looking at the backend code: `let attachmentUrls = [...(job.attachments || [])];`
      // It seems it keeps all existing and adds new ones. It doesn't support deleting specific existing files easily via this FormData approach without modifying backend.
      // For now, we will assume we can only add new files, or if we want to support deletion, we need to send the list of 'kept' attachment URLs.
      // Let's check backend updateJob:
      // `let attachmentUrls = [...(job.attachments || [])];`
      // It uses the existing job's attachments from DB. It doesn't look at req.body.attachments for existing URLs.
      // To support deleting existing attachments, we would need to modify the backend to accept a list of 'kept' attachments.
      // For this task, I will proceed with adding new files. If deletion is critical, I'll need to update backend.
      // Wait, the user asked for "edit job". Deleting attachments is a common edit action.
      // I should probably update the backend to allow updating the attachments list.
      // But for now, let's just implement the frontend part and maybe send the existing attachments as a field if I can update the backend.
      // Actually, I can send `existingAttachments` in the body.
      submitData.append(
        "existingAttachments",
        JSON.stringify(existingAttachments)
      );

      await updateJob(id, submitData);
      router.push("/dashboard/jobs/my-jobs");
    } catch (error) {
      toast.error("Error updating job:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Edit Job</h1>
          <p className="text-gray-400 mb-8">
            Update the details of your job posting
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
            <div>
              <label className="block text-white font-medium mb-2">
                Industry
              </label>
              <input
                type="text"
                value={industrySearch}
                onChange={(e) => {
                  setIndustrySearch(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    industry: e.target.value,
                    category: "",
                  }));
                }}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                placeholder="Type to search industries..."
              />
              {industrySearch && filteredIndustries.length > 0 && (
                <div className="mt-2 bg-gray-700 border border-gray-600 rounded-lg max-h-48 overflow-y-auto">
                  {filteredIndustries.map((industry) => (
                    <div
                      key={industry}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          industry,
                          category: "",
                        }));
                        setIndustrySearch(industry);
                        setCategorySearch("");
                      }}
                      className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white"
                    >
                      {industry}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category */}
            {formData.industry && (
              <div>
                <label className="block text-white font-medium mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => {
                    setCategorySearch(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }));
                  }}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  placeholder="Type to search categories..."
                />
                {categorySearch && filteredCategories.length > 0 && (
                  <div className="mt-2 bg-gray-700 border border-gray-600 rounded-lg max-h-48 overflow-y-auto">
                    {filteredCategories.map((category) => (
                      <div
                        key={category}
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, category }));
                          setCategorySearch(category);
                        }}
                        className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white"
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Mode */}
            <div>
              <label className="block text-white font-medium mb-2">
                Job Mode *
              </label>
              <div className="flex gap-4">
                {["paid", "hybrid", "barter"].map((mode) => (
                  <label
                    key={mode}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={mode}
                      checked={formData.mode.includes(mode)}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => {
                          const newMode = prev.mode.includes(value)
                            ? prev.mode.filter((m) => m !== value)
                            : [...prev.mode, value];
                          return { ...prev, mode: newMode };
                        });
                      }}
                      className="mr-2 w-4 h-4 text-purple-600 rounded focus:ring-purple-500 bg-gray-700 border-gray-600"
                    />
                    <span className="text-white capitalize">{mode}</span>
                  </label>
                ))}
              </div>
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
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Project Completion Deadline
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      deadline: e.target.value,
                    }))
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
                  Applications close after this date.
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
                  className="px-4 cursor-pointer py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
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
                  disabled={
                    attachments.length + existingAttachments.length >= 4
                  }
                />
                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer ${
                    attachments.length + existingAttachments.length >= 4
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

              {/* Existing Attachments */}
              {existingAttachments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-white text-sm font-medium mb-2">
                    Existing Attachments
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {existingAttachments.map((url, index) => (
                      <div
                        key={`existing-${index}`}
                        className="relative bg-gray-700 rounded-lg p-4"
                      >
                        <button
                          type="button"
                          onClick={() => removeExistingAttachment(index)}
                          className="absolute cursor-pointer top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center justify-center h-32">
                          {url.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                            <Image
                              src={url}
                              alt="Attachment"
                              fill
                              className="object-cover rounded"
                            />
                          ) : (
                            <FileText className="w-12 h-12 text-gray-400" />
                          )}
                        </div>
                        <p className="text-white text-sm mt-2 truncate">
                          {url.split("/").pop()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Attachments */}
              {attachments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-white text-sm font-medium mb-2">
                    New Attachments
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {attachments.map((attachment, index) => (
                      <div
                        key={`new-${index}`}
                        className="relative bg-gray-700 rounded-lg p-4"
                      >
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {attachment.type === "image" ? (
                          <Image
                            src={attachment.preview}
                            alt="Preview"
                            fill
                            className="object-cover rounded"
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
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating Job...
                  </>
                ) : (
                  "Update Job"
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition-colors"
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

export default EditJobPage;
