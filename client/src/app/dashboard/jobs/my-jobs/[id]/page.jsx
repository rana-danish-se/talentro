"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useJobs } from "@/context/JobsContext";
import ReactMarkdown from "react-markdown";
import { formatDistanceToNow } from "date-fns";
import {
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  User,
  Loader2,
} from "lucide-react";
import Image from "next/image";

const MyJobDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { fetchMyJobById, loading } = useJobs();
  const [jobData, setJobData] = useState(null);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const loadJob = async () => {
      const result = await fetchMyJobById(id);
      if (result?.success) {
        setJobData(result.data);
      } else {
        setError(result?.message || "Failed to load job details");
      }
    };
    loadJob();
  }, [id, fetchMyJobById]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <Loader2 className="animate-spin w-12 h-12 text-purple-500" />
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <p className="text-red-500">{error || "Job not found"}</p>
      </div>
    );
  }

  const { job, applications } = jobData;

  const filteredApplications =
    applications?.filter((app) => {
      if (filterStatus === "all") return true;
      return app.status === filterStatus;
    }) || [];

  const getStatusCount = (status) => {
    if (!applications) return 0;
    if (status === "all") return applications.length;
    return applications.filter((app) => app.status === status).length;
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition-colors"
          >
            &larr; Back to Jobs
          </button>
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 backdrop-blur-sm">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {job.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  {job.location?.city
                    ? `${job.location.city}, ${job.location.country}`
                    : "Remote"}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  Posted {formatDistanceToNow(new Date(job.createdAt))} ago
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/dashboard/jobs/edit-job/${id}`)}
                className="px-5 cursor-pointer py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border border-neutral-700"
              >
                Edit Job
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Description</h3>
              <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                <ReactMarkdown>{job.description}</ReactMarkdown>
              </div>
            </div>

            {/* Attachments Section */}
            {job.attachments && job.attachments.length > 0 && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  Attachments
                  <span className="text-sm font-normal text-gray-500">
                    ({job.attachments.length})
                  </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {job.attachments.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl bg-neutral-800/30 border border-neutral-700/50 hover:bg-neutral-800 hover:border-purple-500/30 transition-all group"
                    >
                      <div className="relative w-12 h-12 flex-shrink-0 bg-neutral-800 rounded-lg overflow-hidden flex items-center justify-center border border-neutral-700 group-hover:border-purple-500/30 transition-colors">
                        {url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                          <Image
                            src={url}
                            alt="Attachment"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-2xl">📄</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-200 truncate group-hover:text-purple-400 transition-colors">
                          {url.split("/").pop()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Click to view file
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Applicants List */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  Applicants
                  <span className="bg-purple-600/20 text-purple-400 text-sm px-3 py-1 rounded-full border border-purple-500/20 font-mono">
                    {filteredApplications.length}
                  </span>
                </h2>

                {/* Filter Tabs */}
                <div className="flex bg-neutral-900/50 p-1 rounded-xl border border-neutral-800 overflow-x-auto no-scrollbar">
                  {[
                    "all",
                    "pending",
                    "shortlisted",
                    "accepted",
                    "rejected",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-all ${
                        filterStatus === status
                          ? "bg-neutral-800 text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {status}
                      <span
                        className={`ml-2 text-xs opacity-60 ${
                          filterStatus === status ? "text-white" : ""
                        }`}
                      >
                        ({getStatusCount(status)})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                {filteredApplications.map((app) => (
                  <div
                    key={app._id}
                    onClick={() =>
                      router.push(`/dashboard/jobs/application/${app._id}`)
                    }
                    className="bg-neutral-900 p-5 rounded-xl border border-neutral-800 hover:border-purple-500/50 hover:bg-neutral-800/50 cursor-pointer transition-all flex items-center gap-5 group"
                  >
                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 flex-shrink-0">
                      {app.applicantId.profileImage ? (
                        <Image
                          src={app.applicantId.profileImage}
                          alt={app.applicantId.firstName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-500">
                          {app.applicantId?.firstName?.[0] || "?"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold text-lg group-hover:text-purple-400 transition-colors">
                          {app.applicantId.firstName} {app.applicantId.lastName}
                        </h3>
                        {/* Status Badge */}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                            app.status === "accepted"
                              ? "bg-green-900/30 text-green-400 border border-green-800"
                              : app.status === "rejected"
                              ? "bg-red-900/30 text-red-400 border border-red-800"
                              : app.status === "shortlisted"
                              ? "bg-yellow-900/30 text-yellow-400 border border-yellow-800"
                              : "bg-blue-900/30 text-blue-400 border border-blue-800"
                          }`}
                        >
                          {app.status || "pending"}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm truncate mb-1">
                        {app.applicantId.headline || "No headline"}
                      </p>
                      {app.selectedMode && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-900/30 text-purple-300 border border-purple-800/30 capitalize">
                          APPLIED FOR:{" "}
                          <strong className="ml-1">{app.selectedMode}</strong>
                        </span>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm text-gray-500 mb-2">
                        {formatDistanceToNow(new Date(app.createdAt))} ago
                      </div>
                      <span className="text-xs bg-white text-black font-semibold px-4 py-2 rounded-full hover:bg-gray-200 transition-colors shadow-sm">
                        View Application
                      </span>
                    </div>
                  </div>
                ))}
                {filteredApplications.length === 0 && (
                  <div className="text-center py-20 bg-neutral-900 rounded-2xl border border-neutral-800 border-dashed">
                    <User className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No {filterStatus === "all" ? "" : filterStatus} applicants
                      found
                    </h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      {filterStatus === "all"
                        ? "Applications will appear here once candidates start applying to this job."
                        : `No applications currently matching the '${filterStatus}' status.`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar details */}
          <div className="space-y-6">
            {/* Job Status & Mode Card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sticky top-6">
              <h3 className="text-lg font-bold text-white mb-6">Job Info</h3>
              <div className="space-y-5">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-400 font-medium">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      job.status === "active" || job.status === "open"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <div className="py-1">
                  <span className="text-gray-400 block mb-3 font-medium">
                    Engagement Modes
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(job.mode) ? job.mode : [job.mode]).map(
                      (m) => (
                        <span
                          key={m}
                          className="px-3 py-1.5 rounded-lg bg-purple-900/20 text-purple-300 border border-purple-800/30 text-xs font-bold uppercase tracking-wide"
                        >
                          {m}
                        </span>
                      )
                    )}
                  </div>
                </div>
                {job.industry && (
                  <div className="flex justify-between items-center py-1 border-t border-neutral-800/50 pt-4">
                    <span className="text-gray-400">Industry</span>
                    <span className="text-white font-medium">
                      {job.industry}
                    </span>
                  </div>
                )}
                {job.category && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-400">Category</span>
                    <span className="text-white font-medium">
                      {job.category}
                    </span>
                  </div>
                )}
                {job.deadline && (
                  <div className="py-1 border-t border-neutral-800/50 pt-4">
                    <span className="text-gray-400 block mb-1 text-sm">
                      Project Deadline
                    </span>
                    <span className="text-white font-semibold flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {job.applicationDeadline && (
                  <div className="py-1">
                    <span className="text-gray-400 block mb-1 text-sm">
                      Applications Close
                    </span>
                    <span className="text-red-300 font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {new Date(job.applicationDeadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-800">
                <h3 className="text-lg font-bold text-white mb-4">
                  Attributes
                </h3>

                {job.servicesOffered?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                      Offered in Return
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.servicesOffered.map((s, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-blue-900/20 text-blue-300 border border-blue-500/20 text-xs font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Skills Required
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired?.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-neutral-800 text-gray-300 border border-neutral-700 text-xs font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJobDetailsPage;
