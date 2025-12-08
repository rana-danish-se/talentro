"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import apiClient from "@/api/apiClient";

const JobsContext = createContext();

export const useJobs = () => {
  return useContext(JobsContext);
};

export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Base URL for API calls
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Create a new job
  const createJob = useCallback(
    async (jobData) => {
      setLoading(true);
      try {
        const isFormData = jobData instanceof FormData;
        const config = {
          headers: {
            "Content-Type": isFormData
              ? "multipart/form-data"
              : "application/json",
          },
          withCredentials: true,
        };

        const response = await axios.post(
          `${API_URL}/api/jobs/create`,
          jobData,
          config
        );

        if (response.data.success) {
          setJobs((prevJobs) => [response.data.data, ...prevJobs]);
          toast.success("Job created successfully!");
          return response.data;
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error creating job";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  // Fetch all jobs with filters
  const fetchJobs = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await apiClient.get(`/api/jobs?${params}`);

      if (response.data.success) {
        setJobs(response.data.data);
        return response.data;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error fetching jobs";
      setError(errorMessage);
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single job by ID
  const fetchJobById = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/api/jobs/${id}`);

      if (response.data.success) {
        setCurrentJob(response.data.data);
        return response.data;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error fetching job";
      setError(errorMessage);
      console.error("Error fetching job:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a job
  const updateJob = useCallback(
    async (id, jobData) => {
      setLoading(true);
      try {
        const isFormData = jobData instanceof FormData;
        const config = {
          headers: {
            "Content-Type": isFormData
              ? "multipart/form-data"
              : "application/json",
          },
          withCredentials: true,
        };

        const response = await axios.put(
          `${API_URL}/api/jobs/${id}`,
          jobData,
          config
        );

        if (response.data.success) {
          setJobs((prevJobs) =>
            prevJobs.map((job) => (job._id === id ? response.data.data : job))
          );
          if (currentJob && currentJob._id === id) {
            setCurrentJob(response.data.data);
          }
          toast.success("Job updated successfully!");
          return response.data;
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error updating job";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [API_URL, currentJob]
  );

  // Delete a job
  const deleteJob = useCallback(
    async (id) => {
      setLoading(true);
      try {
        const response = await axios.delete(`${API_URL}/api/jobs/${id}`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
          if (currentJob && currentJob._id === id) {
            setCurrentJob(null);
          }
          toast.success("Job deleted successfully!");
          return response.data;
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error deleting job";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [API_URL, currentJob]
  );

  // Get user job suggestions
  const getUserJobsSuggestions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/jobs/suggestions");

      if (response.data.success) {
        return response.data;
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error fetching job suggestions";
      setError(errorMessage);
      console.error("Error fetching job suggestions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user's jobs
  const fetchMyJobs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/jobs/my-jobs");

      if (response.data.success) {
        return response.data;
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error fetching your jobs";
      setError(errorMessage);
      console.error("Error fetching your jobs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single job by ID for owner (includes applicants)
  const fetchMyJobById = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/api/jobs/my-jobs/${id}`);

      if (response.data.success) {
        return response.data;
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error fetching job details";
      setError(errorMessage);
      console.error("Error fetching job details:", err);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply for a job
  const applyForJob = useCallback(
    async (id, applicationData) => {
      setLoading(true);
      try {
        const isFormData = applicationData instanceof FormData;
        const config = {
          headers: {
            "Content-Type": isFormData
              ? "multipart/form-data"
              : "application/json",
          },
          withCredentials: true,
        };

        const response = await axios.post(
          `${API_URL}/api/applications/apply/${id}`,
          applicationData,
          config
        );

        if (response.data.success) {
          toast.success("Application submitted successfully!");
          return response.data;
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error submitting application";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  // Fetch single application by ID
  const fetchApplicationById = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/api/applications/${id}`);

      if (response.data.success) {
        return response.data;
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error fetching application details";
      setError(errorMessage);
      console.error("Error fetching application details:", err);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update application status
  const updateApplicationStatus = useCallback(async (id, status) => {
    try {
      const response = await apiClient.put(`/api/applications/status/${id}`, {
        status,
      });

      if (response.data.success) {
        toast.success(`Application ${status} successfully`);
        return response.data;
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error updating application status";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const value = {
    jobs,
    currentJob,
    loading,
    error,
    createJob,
    fetchJobs,
    fetchJobById,
    updateJob,
    deleteJob,
    getUserJobsSuggestions,
    fetchMyJobs,
    fetchMyJobById,
    applyForJob,
    fetchApplicationById,
    updateApplicationStatus,
  };

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
};

export default JobsContext;
