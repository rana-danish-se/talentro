"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import apiClient from "../api/apiClient";
import { useAuth } from "./Authentication"; // Assuming AuthContext exposes useAuth
import { toast } from "react-toastify";

const ProfileContext = createContext();

export const useProfile = () => {
  return useContext(ProfileContext);
};

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [educations, setEducations] = useState([]);
  const { user } = useAuth();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get("/api/profile/me");
      console.log(response.data.data);
      setProfile(response.data.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.response?.data?.message || "Failed to fetch profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const [experiences, setExperiences] = useState([]);

  const fetchEducation = useCallback(async () => {
    try {
      const response = await apiClient.get("/api/education");
      setEducations(response.data.data);
    } catch (err) {
      console.error("Error fetching education:", err);
    }
  }, []);

  const fetchExperience = useCallback(async () => {
    try {
      const response = await apiClient.get("/api/experience");
      setExperiences(response.data.data);
    } catch (err) {
      console.error("Error fetching experience:", err);
    }
  }, []);

  const [projects, setProjects] = useState([]);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await apiClient.get("/api/projects");
      setProjects(response.data.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  }, []);

  const [skills, setSkills] = useState([]);

  const fetchSkills = useCallback(async () => {
    try {
      const response = await apiClient.get("/api/skills");
      setSkills(response.data.data);
    } catch (err) {
      console.error("Error fetching skills:", err);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchEducation();
      fetchExperience();
      fetchProjects();
      fetchSkills();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [
    user,
    fetchProfile,
    fetchEducation,
    fetchExperience,
    fetchProjects,
    fetchSkills,
  ]);

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.put("/api/profile/update", profileData);
      setProfile(response.data.data);
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update profile";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateProfileImage = async (file) => {
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append("image", file);

      const response = await apiClient.put("/api/profile/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update local profile state with new image URL
      setProfile((prev) => ({
        ...prev,
        profileImage: response.data.data.profileImage,
      }));
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error("Error updating profile image:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update profile image";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updatePosterImage = async (file) => {
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append("image", file);

      const response = await apiClient.put("/api/profile/poster", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setProfile((prev) => ({
        ...prev,
        posterImage: response.data.data.posterImage,
      }));
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error("Error updating poster image:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update poster image";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateContactInfo = async (contactData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.put("/api/profile/contact", contactData);
      setProfile((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          ...contactData,
        },
      }));
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error("Error updating contact info:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update contact info";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateAbout = async (aboutData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.put("/api/profile/about", aboutData);
      setProfile((prev) => ({
        ...prev,
        ...aboutData,
      }));
      return { success: true, data: response.data.data };
    } catch (err) {
      toast.error("Error updating about info:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update about info";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const addEducation = async (educationData) => {
    try {
      setLoading(true);
      const response = await apiClient.post("/api/education", educationData);
      setEducations((prev) => [response.data.data, ...prev]);
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error("Error adding education:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to add education";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateEducation = async (id, educationData) => {
    try {
      setLoading(true);
      const response = await apiClient.put(
        `/api/education/${id}`,
        educationData
      );
      setEducations((prev) =>
        prev.map((edu) => (edu._id === id ? response.data.data : edu))
      );
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error("Error updating education:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update education";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteEducation = async (id) => {
    try {
      setLoading(true);
      await apiClient.delete(`/api/education/${id}`);
      setEducations((prev) => prev.filter((edu) => edu._id !== id));
      return { success: true };
    } catch (err) {
      console.error("Error deleting education:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to delete education";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const addExperience = async (experienceData) => {
    try {
      setLoading(true);
      const response = await apiClient.post("/api/experience", experienceData);
      setExperiences((prev) => [response.data.data, ...prev]);
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error("Error adding experience:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to add experience";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateExperience = async (id, experienceData) => {
    try {
      setLoading(true);
      const response = await apiClient.put(
        `/api/experience/${id}`,
        experienceData
      );
      setExperiences((prev) =>
        prev.map((exp) => (exp._id === id ? response.data.data : exp))
      );
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error("Error updating experience:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update experience";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteExperience = async (id) => {
    try {
      setLoading(true);
      await apiClient.delete(`/api/experience/${id}`);
      setExperiences((prev) => prev.filter((exp) => exp._id !== id));
      return { success: true };
    } catch (err) {
      console.error("Error deleting experience:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to delete experience";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (projectData) => {
    try {
      setLoading(true);
      const config =
        projectData instanceof FormData
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : {};
      const response = await apiClient.post(
        "/api/projects",
        projectData,
        config
      );
      setProjects((prev) => [response.data.data, ...prev]);
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error("Error adding project:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to add project";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async (skillData) => {
    try {
      setLoading(true);
      const response = await apiClient.post("/api/skills", skillData);
      setSkills((prev) => [response.data.data, ...prev]);
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error("Error adding skill:", err);
      const errorMessage = err.response?.data?.message || "Failed to add skill";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateSkill = async (id, skillData) => {
    try {
      setLoading(true);
      const response = await apiClient.put(`/api/skills/${id}`, skillData);
      setSkills((prev) =>
        prev.map((skill) => (skill._id === id ? response.data.data : skill))
      );
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error("Error updating skill:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update skill";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteSkill = async (id) => {
    try {
      setLoading(true);
      await apiClient.delete(`/api/skills/${id}`);
      setSkills((prev) => prev.filter((skill) => skill._id !== id));
      return { success: true };
    } catch (err) {
      console.error("Error deleting skill:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to delete skill";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      setLoading(true);
      const config =
        projectData instanceof FormData
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : {};
      const response = await apiClient.put(
        `/api/projects/${id}`,
        projectData,
        config
      );
      setProjects((prev) =>
        prev.map((proj) => (proj._id === id ? response.data.data : proj))
      );
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error("Error updating project:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update project";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    try {
      setLoading(true);
      await apiClient.delete(`/api/projects/${id}`);
      setProjects((prev) => prev.filter((proj) => proj._id !== id));
      return { success: true };
    } catch (err) {
      console.error("Error deleting project:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to delete project";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateProfileImage,
    updatePosterImage,
    updateContactInfo,
    updateAbout,
    educations,
    fetchEducation,
    addEducation,
    updateEducation,
    deleteEducation,
    experiences,
    fetchExperience,
    addExperience,
    updateExperience,
    deleteExperience,
    projects,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
    skills,
    fetchSkills,
    addSkill,
    updateSkill,
    deleteSkill,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
