"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useJobs } from "@/context/JobsContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  User,
  CheckCircle,
  XCircle,
  Briefcase,
  ExternalLink,
  Layers,
  Globe,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";

const ApplicationDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { fetchApplicationById, updateApplicationStatus, loading } = useJobs();
  const [application, setApplication] = useState(null);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadApplication = async () => {
      const result = await fetchApplicationById(id);
      if (result?.success) {
        setApplication(result.data);
      } else {
        setError(result?.message || "Failed to load application details");
      }
    };
    loadApplication();
  }, [id, fetchApplicationById]);

  const handleStatusUpdate = async (newStatus) => {
    if (updating) return;
    setUpdating(true);
    try {
      const result = await updateApplicationStatus(id, newStatus);
      if (result?.success) {
        setApplication((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white gap-4">
        <p className="text-red-500 text-lg">
          {error || "Application not found"}
        </p>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  const {
    applicantId,
    jobId,
    proposal,
    estimatedDuration,
    attachments,
    createdAt,
    selectedMode,
    status,
  } = application;

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "shortlisted":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "shortlisted":
        return <ThumbsUp className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto pb-20">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group px-4 py-2 rounded-xl hover:bg-neutral-900"
          >
            <ArrowLeft className="w-5 h-5 cursor-pointer group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium cursor-pointer">Back to Job</span>
          </button>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(
              status
            )}`}
          >
            {getStatusIcon(status)}
            <span className="capitalize font-semibold text-sm">{status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Applicant Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-900/70 backdrop-blur-xl rounded-3xl p-8 border border-neutral-800 relative overflow-hidden group"
            >
              <div className="absolute -right-20 -top-20 w-94 h-94 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-all duration-700"></div>

              <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                <div className="relative">
                  <div className="w-28 h-28  rounded-full overflow-hidden border-4 border-neutral-800 shadow-2xl ring-2 ring-purple-500/20">
                    {applicantId.profileImage ? (
                      <Image
                        src={applicantId.profileImage}
                        alt={applicantId.firstName}
                        fill
                        className="object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-neutral-800 flex items-center justify-center text-3xl font-bold text-gray-500">
                        {applicantId.firstName?.[0] || "?"}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1   -right-1 bg-neutral-900 p-1.5 rounded-full border border-neutral-800">
                    <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {applicantId.firstName} {applicantId.lastName}
                    </h1>
                    <p className="text-purple-400 font-medium text-lg">
                      {applicantId.headline || "Talented Professional"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2 bg-neutral-800/50 px-3 py-1.5 rounded-lg border border-neutral-700">
                      <Mail className="w-4 h-4 text-gray-300" />
                      {applicantId.email}
                    </div>
                    {applicantId.location?.city && (
                      <div className="flex items-center gap-2 bg-neutral-800/50 px-3 py-1.5 rounded-lg border border-neutral-700">
                        <MapPin className="w-4 h-4 text-gray-300" />
                        {applicantId.location.city},{" "}
                        {applicantId.location.country}
                      </div>
                    )}
                    <div className="flex items-center gap-2 bg-neutral-800/50 px-3 py-1.5 rounded-lg border border-neutral-700">
                      <Clock className="w-4 h-4 text-gray-300" />
                      Applied {formatDistanceToNow(new Date(createdAt))} ago
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                  <button className="flex-1 md:w-full bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5 active:scale-95">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </button>
                  <button className="flex-1 md:w-full cursor-pointer text-white px-6 py-3 rounded-xl font-semibold hover:bg-neutral-700 transition-all border border-neutral-700 flex items-center justify-center gap-2 active:scale-95">
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Proposal Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-neutral-900/50 backdrop-blur-sm rounded-3xl p-8 border border-neutral-800"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 border-b border-neutral-800 pb-4">
                <FileText className="w-6 h-6 text-purple-500" />
                Cover Letter
              </h2>
              <div className="prose prose-invert prose-purple max-w-none text-gray-300 leading-relaxed">
                <ReactMarkdown>{proposal}</ReactMarkdown>
              </div>
            </motion.div>

            {/* Attachments */}
            {attachments && attachments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-neutral-900/50 backdrop-blur-sm rounded-3xl p-8 border border-neutral-800"
              >
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <Download className="w-6 h-6 text-blue-500" />
                  Attachments ({attachments.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {attachments.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col p-5 bg-neutral-800/30 rounded-2xl border border-neutral-800 hover:border-purple-500/50 hover:bg-neutral-800/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <FileText className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">
                            Attachment {index + 1}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Click to view file
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-auto pt-3 border-t border-neutral-700/50 group-hover:text-purple-400 transition-colors">
                        <ExternalLink className="w-3 h-3" />
                        View Document
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Status Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-neutral-900/80 backdrop-blur-xl rounded-3xl p-6 border border-neutral-800 shadow-xl lg:sticky lg:top-6"
            >
              <h3 className="text-lg font-bold text-white mb-6">
                Application Actions
              </h3>

              <div className="space-y-3">
                {status !== "accepted" && (
                  <button
                    onClick={() => handleStatusUpdate("accepted")}
                    disabled={updating}
                    className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Accept Application
                  </button>
                )}

                {status !== "rejected" && (
                  <button
                    onClick={() => handleStatusUpdate("rejected")}
                    disabled={updating}
                    className="w-full cursor-pointer bg-neutral-800 hover:bg-neutral-700 hover:text-red-400 text-gray-300 py-4 rounded-xl font-semibold transition-all border border-neutral-700 hover:border-red-900/50 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Application
                  </button>
                )}

                {status !== "shortlisted" &&
                  status !== "accepted" &&
                  status !== "rejected" && (
                    <button
                      onClick={() => handleStatusUpdate("shortlisted")}
                      disabled={updating}
                      className="w-full cursor-pointer bg-neutral-800 hover:bg-neutral-700 hover:text-yellow-400 text-gray-300 py-4 rounded-xl font-semibold transition-all border border-neutral-700 hover:border-yellow-900/50 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ThumbsUp className="w-5 h-5" />
                      Shortlist Candidate
                    </button>
                  )}
              </div>
            </motion.div>

            {/* Application Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-neutral-900/50 backdrop-blur-sm rounded-3xl p-6 border border-neutral-800"
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-500" />
                Review Details
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Proposed Mode
                  </label>
                  <p className="text-white font-medium capitalize flex items-center gap-2 mt-1">
                    <Globe className="w-4 h-4 text-blue-400" />
                    {selectedMode || "Not Specified"}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Estimated Duration
                  </label>
                  <p className="text-white font-medium flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-orange-400" />
                    {estimatedDuration || "Not Specified"}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </label>
                  <p className="text-white font-medium mt-1">
                    {new Date(createdAt).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Job Context */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-neutral-900/50 backdrop-blur-sm rounded-3xl p-6 border border-neutral-800"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-500" />
                Job Context
              </h3>

              <h4 className="text-white font-semibold mb-2 line-clamp-2 leading-snug">
                {jobId.title}
              </h4>
              <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                {jobId.description}
              </p>

              <button
                onClick={() => router.push(`/dashboard/jobs/${jobId._id}`)}
                className="w-full py-2.5 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-sm text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                View Original Job
                <ExternalLink className="w-3 h-3" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;
