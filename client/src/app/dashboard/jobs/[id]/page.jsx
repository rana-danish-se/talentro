"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useJobs } from "@/context/JobsContext";
import apiClient from "@/api/apiClient";
import ReactMarkdown from "react-markdown";
import {
  MapPin,
  Calendar,
  Briefcase,
  Clock,
  Send,
  X,
  Paperclip,
  User,
  Building,
  FileText,
  Download,
  Eye,
  Users,
  ExternalLink,
  Layers,
  Target,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Image from "next/image";
import { useAuth } from "@/context/Authentication";
import { formatDistanceToNow } from "date-fns";

const JobDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { fetchJobById, currentJob, loading, applyForJob } = useJobs();
  const { user } = useAuth();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [proposal, setProposal] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [selectedMode, setSelectedMode] = useState("");
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJobById(id);
    }
  }, [id, fetchJobById]);

  // Separate useEffect to check application status
  useEffect(() => {
    const checkStatus = async () => {
      if (!id || !user) return;

      try {
        const response = await apiClient.get(
          `/api/applications/check-status/${id}`
        );
        if (response.data.success && response.data.data.hasApplied) {
          setHasApplied(true);
        }
      } catch (error) {
        console.error("Error checking application status:", error);
      }
    };

    checkStatus();
  }, [id, user]);

  const handleApplyClick = () => {
    if (!user) {
      toast.error("Please login to apply for jobs");
      router.push("/login");
      return;
    }
    if (currentJob?.userId?._id === user._id) {
      toast.error("You cannot apply to your own job");
      return;
    }
    if (hasApplied) {
      toast.info("You have already applied for this job");
      return;
    }
    setIsApplyModalOpen(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + attachments.length > 4) {
      toast.error("You can only upload up to 4 files");
      return;
    }
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!proposal.trim()) {
      toast.error("Please enter a proposal");
      return;
    }
    if (!selectedMode) {
      toast.error("Please select a mode of engagement");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("proposal", proposal);
      formData.append("estimatedDuration", estimatedDuration);
      formData.append("selectedMode", selectedMode);
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      await applyForJob(id, formData);
      setIsApplyModalOpen(false);
      setProposal("");
      setEstimatedDuration("");
      setSelectedMode("");
      setAttachments([]);
      setHasApplied(true); // Update state after successful application
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getFileIcon = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
      return <FileText className="w-5 h-5 text-green-400" />;
    } else if (["pdf"].includes(extension)) {
      return <FileText className="w-5 h-5 text-red-400" />;
    } else if (["doc", "docx"].includes(extension)) {
      return <FileText className="w-5 h-5 text-blue-400" />;
    }
    return <Paperclip className="w-5 h-5" />;
  };

  const isImageFile = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension);
  };

  const getFileName = (url) => {
    return url.split("/").pop().split("?")[0] || "attachment";
  };

  if (loading || !currentJob) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const modes = Array.isArray(currentJob.mode)
    ? currentJob.mode
    : [currentJob.mode];

  return (
    <div className="min-h-screen bg-black text-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto pb-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-900 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-neutral-800 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {currentJob.status === "active" && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-900/20 text-green-400 border border-green-500/30 text-xs font-semibold">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Active
                  </span>
                )}
                <span className="px-3 py-1.5 bg-blue-900/20 text-blue-300 rounded-full text-xs border border-blue-800/50 font-medium">
                  {currentJob.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {currentJob.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-gray-400 text-sm md:text-base mb-6">
                {currentJob.industry && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-purple-400" />
                    <span>{currentJob.industry}</span>
                  </div>
                )}
                {currentJob.location?.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span>
                      {currentJob.location.city}
                      {currentJob.location.country &&
                        `, ${currentJob.location.country}`}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>
                    Posted {formatDistanceToNow(new Date(currentJob.createdAt))}{" "}
                    ago
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800/50 rounded-xl border border-neutral-700">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">
                    <span className="font-bold text-white">
                      {currentJob.views || 0}
                    </span>{" "}
                    views
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-900/20 rounded-xl border border-purple-500/30">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-300">
                    <span className="font-bold text-purple-200">
                      {currentJob.totalApplications || 0}
                    </span>{" "}
                    applications
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: hasApplied ? 1 : 1.05 }}
              whileTap={{ scale: hasApplied ? 1 : 0.95 }}
              onClick={handleApplyClick}
              disabled={hasApplied}
              className={`${
                hasApplied
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              } text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-purple-900/50 flex items-center gap-2 transition-all`}
            >
              <Send className="w-5 h-5" />
              {hasApplied ? "Applied" : "Apply Now"}
            </motion.button>
          </div>

          {/* Modes and Deadlines */}
          <div className="mt-8 flex flex-wrap gap-3">
            {modes.map((m) => (
              <span
                key={m}
                className="px-4 py-2 bg-purple-500/10 text-purple-300 rounded-xl text-sm border border-purple-500/30 capitalize font-semibold flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                {m}
              </span>
            ))}
            {currentJob.applicationDeadline && (
              <span className="px-4 py-2 bg-red-900/20 text-red-300 rounded-xl text-sm border border-red-800/50 flex items-center gap-2 font-semibold">
                <Calendar className="w-4 h-4" />
                Apply by{" "}
                {new Date(currentJob.applicationDeadline).toLocaleDateString(
                  undefined,
                  { month: "short", day: "numeric", year: "numeric" }
                )}
              </span>
            )}
            {currentJob.deadline && (
              <span className="px-4 py-2 bg-orange-900/20 text-orange-300 rounded-xl text-sm border border-orange-800/50 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Project Deadline:{" "}
                {new Date(currentJob.deadline).toLocaleDateString()}
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-neutral-800 shadow-xl"
            >
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-purple-500" />
                Job Description
              </h2>
              <div className="prose prose-invert prose-purple max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-4 text-gray-300 leading-relaxed">
                        {children}
                      </p>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-purple-400 font-semibold">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="text-purple-300">{children}</em>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside space-y-2 text-gray-300">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-2 text-gray-300">
                        {children}
                      </ol>
                    ),
                  }}
                >
                  {currentJob.description}
                </ReactMarkdown>
              </div>
            </motion.div>

            {/* Attachments Section */}
            {currentJob.attachments && currentJob.attachments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-neutral-800 shadow-xl"
              >
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Paperclip className="w-5 h-5 text-purple-500" />
                  Attachments ({currentJob.attachments.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentJob.attachments.map((url, index) => (
                    <div
                      key={index}
                      className="bg-neutral-800/50 border border-neutral-700 rounded-xl overflow-hidden hover:border-purple-500 transition-all cursor-pointer group"
                      onClick={() =>
                        isImageFile(url)
                          ? setSelectedAttachment(url)
                          : window.open(url, "_blank")
                      }
                    >
                      {isImageFile(url) ? (
                        <div className="relative h-40 w-full bg-neutral-950">
                          <Image
                            src={url}
                            alt={`Attachment ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="h-40 flex items-center justify-center bg-neutral-950">
                          {getFileIcon(url)}
                        </div>
                      )}
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {getFileIcon(url)}
                          <span className="text-sm text-gray-300 truncate">
                            {getFileName(url)}
                          </span>
                        </div>
                        <a
                          href={url}
                          download
                          onClick={(e) => e.stopPropagation()}
                          className="ml-2 p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4 text-purple-400" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Skills Required */}
            {currentJob.skillsRequired?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-neutral-800 shadow-xl"
              >
                <h2 className="text-xl font-semibold text-white mb-6">
                  Skills Required
                </h2>
                <div className="flex flex-wrap gap-3">
                  {currentJob.skillsRequired.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-neutral-800/70 text-gray-300 rounded-xl text-sm border border-neutral-700 hover:border-purple-500 hover:bg-neutral-800 transition-all"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* About the Client */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-neutral-800 shadow-xl"
            >
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-500" />
                About the Client
              </h3>
              <Link
                href={`/dashboard/profile/${currentJob.userId?.slug}`}
                className="block group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500/30 group-hover:border-purple-500 transition-all flex-shrink-0">
                    <Image
                      src={
                        currentJob.userId?.profileImage ||
                        `/assets/default-avatar.jpg`
                      }
                      alt="Client"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-white text-lg truncate group-hover:text-purple-400 transition-colors flex items-center gap-2">
                      {currentJob.userId?.firstName}{" "}
                      {currentJob.userId?.lastName}
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    {currentJob.userId?.headline && (
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {currentJob.userId.headline}
                      </p>
                    )}
                  </div>
                </div>
              </Link>

              <div className="space-y-4 border-t border-neutral-800 pt-6">
                {currentJob.userId?.industry && (
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Industry</p>
                      <p className="text-sm text-gray-300">
                        {currentJob.userId.industry}
                      </p>
                    </div>
                  </div>
                )}
                {currentJob.userId?.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Location</p>
                      <p className="text-sm text-gray-300">
                        {currentJob.userId.location.city && (
                          <>{currentJob.userId.location.city}, </>
                        )}
                        {currentJob.userId.location.country}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Services Offered */}
            {currentJob.servicesOffered?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-neutral-800 shadow-xl"
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  Services Offered
                </h3>
                <ul className="space-y-2">
                  {currentJob.servicesOffered.map((service, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-gray-300 text-sm"
                    >
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0"></div>
                      <span className="flex-1">{service}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>

        {/* Sticky Apply Button for Mobile/Bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800 md:hidden z-40">
          <motion.button
            whileHover={{ scale: hasApplied ? 1 : 1.05 }}
            whileTap={{ scale: hasApplied ? 1 : 0.95 }}
            onClick={handleApplyClick}
            disabled={hasApplied}
            className={`w-full ${
              hasApplied
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            } text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition-all`}
          >
            <Send className="w-5 h-5" />
            {hasApplied ? "Applied" : "Apply Now"}
          </motion.button>
        </div>

        {/* Apply Button at end of page for Desktop */}
        <div className="mt-12 flex justify-center md:justify-end hidden md:flex">
          <motion.button
            whileHover={{ scale: hasApplied ? 1 : 1.05 }}
            whileTap={{ scale: hasApplied ? 1 : 0.95 }}
            onClick={handleApplyClick}
            disabled={hasApplied}
            className={`${
              hasApplied
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            } text-white px-10 py-4 rounded-2xl font-semibold shadow-lg shadow-purple-900/30 flex items-center gap-2 transition-all text-lg`}
          >
            <Send className="w-6 h-6" />
            {hasApplied ? "Applied" : "Apply for this Job"}
          </motion.button>
        </div>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedAttachment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedAttachment(null)}
          >
            <button
              onClick={() => setSelectedAttachment(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 bg-neutral-800/50 rounded-full z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedAttachment}
                alt="Preview"
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Apply Modal */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsApplyModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-neutral-800">
                <h3 className="text-2xl font-bold text-white">
                  Apply for this Job
                </h3>
                <button
                  onClick={() => setIsApplyModalOpen(false)}
                  className="text-gray-400 hover:text-white p-2 hover:bg-neutral-800 rounded-full transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Preferred Mode of Engagement{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {modes.map((mode) => (
                      <label
                        key={mode}
                        className="flex items-center gap-2 cursor-pointer bg-neutral-800 px-4 py-3 rounded-xl border border-neutral-700 hover:border-purple-500 transition-colors"
                      >
                        <input
                          type="radio"
                          name="selectedMode"
                          value={mode}
                          checked={selectedMode === mode}
                          onChange={(e) => setSelectedMode(e.target.value)}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500 bg-neutral-900 border-neutral-600"
                        />
                        <span className="text-gray-300 capitalize font-medium">
                          {mode}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Proposal <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    className="w-full h-40 bg-neutral-950 border border-neutral-700 rounded-xl p-4 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Explain why you are the best fit for this job..."
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-4 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 2 weeks, 1 month"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Attachments (Max 4)
                  </label>
                  <div className="border-2 border-dashed border-neutral-700 rounded-xl p-6 text-center hover:border-purple-500 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Paperclip className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">
                      Click or drag files to upload
                    </p>
                  </div>

                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-neutral-800 p-3 rounded-lg"
                        >
                          <span className="text-sm text-gray-300 truncate max-w-[80%]">
                            {file.name}
                          </span>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-neutral-800 flex justify-end gap-3">
                <button
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-6 py-2.5 bg-neutral-800 text-gray-300 rounded-xl hover:bg-neutral-700 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitApplication}
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobDetailsPage;
