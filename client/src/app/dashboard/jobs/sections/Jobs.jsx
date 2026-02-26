"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Briefcase,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  ExternalLink,
} from "lucide-react";
import { useJobs } from "@/context/JobsContext";
import { formatDistanceToNow } from "date-fns";

const JobCard = ({ job }) => {
  const modes = Array.isArray(job.mode) ? job.mode : [job.mode];
  const userSlug = job.userId?.slug || "";

  return (
    <Link href={`/dashboard/jobs/${job._id}`} className="group relative w-full bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col md:flex-row gap-6 backdrop-blur-sm">
      <Link
        href={`/dashboard/profile/${userSlug}`}
        className="flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-neutral-800 border-2 border-neutral-700 hover:border-purple-500 transition-all shadow-lg cursor-pointer group/avatar">
          <img
            src={
              job.userId?.profileImage ||
              `https://ui-avatars.com/api/?name=${job.userId?.firstName}+${job.userId?.lastName}&background=random`
            }
            alt={`${job.userId?.firstName} ${job.userId?.lastName}`}
            className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-purple-500/0 group-hover/avatar:bg-purple-500/10 transition-colors" />
        </div>
      </Link>

      {/* Middle: Main Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <Link href={`/dashboard/jobs/${job._id}`}>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-1 cursor-pointer">
              {job.title}
            </h3>
          </Link>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400 mb-3">
            <Link
              href={`/dashboard/profile/${userSlug}`}
              className="font-medium text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-1.5 group/name"
              onClick={(e) => e.stopPropagation()}
            >
              <span>
                {job.userId?.firstName} {job.userId?.lastName}
              </span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover/name:opacity-100 transition-opacity" />
            </Link>
            {job.location?.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-purple-500/70" />
                {job.location.city}
                {job.location.country && `, ${job.location.country}`}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(job.createdAt))} ago
            </span>
          </div>

          <Link href={`/dashboard/jobs/${job._id}`}>
            <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-4 md:pr-8 cursor-pointer hover:text-gray-300 transition-colors">
              {job.description
                ? job.description.replace(/[#*]/g, "")
                : "No description available."}
            </p>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {job.skillsRequired &&
            job.skillsRequired.slice(0, 5).map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-800 text-gray-400 border border-neutral-700/50 group-hover:bg-neutral-800/80 transition-colors"
              >
                {skill}
              </span>
            ))}
          {job.skillsRequired && job.skillsRequired.length > 5 && (
            <span className="px-2 py-1 rounded-lg text-xs font-medium text-gray-500">
              +{job.skillsRequired.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* Right: Meta & Actions */}
      <div className="flex flex-col md:items-end justify-between gap-4 md:w-64 flex-shrink-0 md:border-l md:border-neutral-800 md:pl-6">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between md:justify-end gap-2 text-xs text-gray-500">
            {job.status === "active" && (
              <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-900/10 text-green-400 border border-green-900/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="font-semibold text-[10px] uppercase tracking-wider">
                  Active
                </span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap md:justify-end gap-2 mt-2">
            {modes.map((mode, index) => (
              <span
                key={index}
                className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1"
              >
                <Layers className="w-3 h-3" /> {mode}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full mt-auto">
          {job.applicationDeadline && (
            <div className="md:text-right">
              <span className="text-xs text-gray-500 block mb-1">
                Apply Before
              </span>
              <span className="text-xs font-semibold text-red-400 flex items-center md:justify-end gap-1.5 bg-red-500/5 py-1.5 px-3 rounded-lg border border-red-500/10">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(job.applicationDeadline).toLocaleDateString(
                  undefined,
                  { month: "short", day: "numeric", year: "numeric" }
                )}
              </span>
            </div>
          )}

          <Link href={`/dashboard/jobs/${job._id}`}>
            <div className="hidden md:flex items-center justify-end gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors mt-2 cursor-pointer group/link">
              View Details{" "}
              <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </Link>
  );
};

const JobsSection = () => {
  const { getUserJobsSuggestions } = useJobs();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleJobs, setVisibleJobs] = useState(5);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const data = await getUserJobsSuggestions();
        if (data && data.data) {
          setJobs(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [getUserJobsSuggestions]);

  const handleShowMore = () => {
    setVisibleJobs((prev) => Math.min(prev + 5, jobs.length));
  };

  if (loading) {

    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="h-8 w-48 bg-neutral-800 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-72 bg-neutral-800/50 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 animate-pulse">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-neutral-800 flex-shrink-0"></div>
              <div className="flex-1 space-y-4">
                <div className="h-6 w-3/4 bg-neutral-800 rounded"></div>
                <div className="flex gap-4">
                  <div className="h-4 w-24 bg-neutral-800/50 rounded"></div>
                  <div className="h-4 w-32 bg-neutral-800/50 rounded"></div>
                </div>
                <div className="h-10 w-full bg-neutral-800/50 rounded"></div>
              </div>
              <div className="md:w-64 flex flex-col gap-4">
                <div className="h-6 w-20 bg-neutral-800 rounded ml-auto"></div>
                <div className="h-6 w-24 bg-neutral-800/50 rounded ml-auto mt-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl  mx-auto py-12 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
            Top Job Picks <Sparkles className="w-6 h-6 text-purple-500" />
          </h2>
          <p className="text-gray-400 max-w-xl">
            Curated opportunities based on your profile, skills, and activity.
          </p>
        </div>

        {jobs.length > 0 && (
          <div className="text-sm text-gray-500 font-mono bg-neutral-900/50 px-4 py-2 rounded-lg border border-neutral-800">
            Showing{" "}
            <span className="text-white font-bold">
              {Math.min(visibleJobs, jobs.length)}
            </span>{" "}
            of <span className="text-white font-bold">{jobs.length}</span> jobs
          </div>
        )}
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-neutral-900/30 rounded-3xl border border-neutral-800 border-dashed">
          <Briefcase className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            No job suggestions yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Try updating your profile or engaging with more content to get
            better recommendations.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.slice(0, visibleJobs).map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}

      {visibleJobs < jobs.length && (
        <div className="mt-12 text-center">
          <button
            onClick={handleShowMore}
            className="group px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto border border-neutral-700"
          >
            Show More Jobs
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

export default JobsSection;
