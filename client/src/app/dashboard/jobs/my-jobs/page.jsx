"use client";
import React, { useEffect, useState } from "react";
import { useJobs } from "@/context/JobsContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Clock,
  Eye,
  Users,
  Edit2,
  Trash2,
  Plus,
  Search,
  MoreVertical,
} from "lucide-react";
import { toast } from "react-toastify";

const MyJobsPage = () => {
  const { fetchMyJobs, deleteJob, loading } = useJobs();
  const [myJobs, setMyJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const loadJobs = async () => {
      const result = await fetchMyJobs();
      if (result?.success) {
        setMyJobs(result.data);
      }
    };
    loadJobs();
  }, [fetchMyJobs]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this job?")) {
      setDeletingId(id);
      try {
        const result = await deleteJob(id);
        if (result?.success) {
          setMyJobs((prev) => prev.filter((job) => job._id !== id));
        }
      } catch (error) {
        console.error("Error deleting job:", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    router.push(`/dashboard/jobs/edit-job/${id}`);
  };

  const filteredJobs = myJobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && myJobs.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Jobs</h1>
            <p className="text-gray-400">
              Manage your posted jobs and view applications
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/dashboard/jobs/create-job")}
            className="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-purple-900/30 flex items-center gap-2 transition-all"
          >
            <Plus className="w-5 h-5" />
            Post New Job
          </motion.button>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-xl relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search your jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Jobs List */}
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                  onClick={() =>
                    router.push(`/dashboard/jobs/my-jobs/${job._id}`)
                  }
                  className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-900/10 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                    <Briefcase className="w-32 h-32 text-purple-500 -rotate-12 translate-x-8 -translate-y-8" />
                  </div>

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors mb-2 line-clamp-1">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-500" />
                            {job.location?.city || "Remote"}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gray-500" />
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          job.status === "active" || job.status === "open"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-gray-800 text-gray-400 border-gray-700"
                        }`}
                      >
                        {job.status === "active" || job.status === "open"
                          ? "Active"
                          : "Closed"}
                      </span>
                    </div>

                    {/* Modes & Category */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(Array.isArray(job.mode) ? job.mode : [job.mode]).map(
                        (m) => (
                          <span
                            key={m}
                            className="px-2.5 py-1 rounded-md bg-purple-900/20 text-purple-300 border border-purple-800/30 text-xs font-medium capitalize"
                          >
                            {m}
                          </span>
                        )
                      )}
                      {job.category && (
                        <span className="px-2.5 py-1 rounded-md bg-blue-900/20 text-blue-300 border border-blue-800/30 text-xs font-medium">
                          {job.category}
                        </span>
                      )}

                      {/* Show Application Deadline Warning if close */}
                      {job.applicationDeadline && (
                        <span className="px-2.5 py-1 rounded-md bg-gray-800 text-gray-400 border border-neutral-700 text-xs font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Apps Close:{" "}
                          {new Date(
                            job.applicationDeadline
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Footer: Stats & Actions */}
                    <div className="flex items-center justify-between pt-5 border-t border-white/5">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-neutral-800 text-gray-400 group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white leading-none mb-1">
                              {job.applicationCount || 0}
                            </p>
                            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                              Applicants
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-neutral-800 text-gray-400 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                            <Eye className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white leading-none mb-1">
                              {job.views || 0}
                            </p>
                            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                              Views
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => handleEdit(e, job._id)}
                          className="p-2.5 cursor-pointer text-gray-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-all border border-transparent hover:border-neutral-700 hover:shadow-lg active:scale-95"
                          title="Edit Job"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, job._id)}
                          disabled={deletingId === job._id}
                          className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20 hover:shadow-lg active:scale-95"
                          title="Delete Job"
                        >
                          {deletingId === job._id ? (
                            <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-neutral-800 border-dashed">
                <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "You haven't posted any jobs yet"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => router.push("/dashboard/jobs/create-job")}
                    className="text-purple-400 hover:text-purple-300 font-medium hover:underline"
                  >
                    Post your first job
                  </button>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MyJobsPage;
