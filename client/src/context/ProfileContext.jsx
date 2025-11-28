"use client"
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import apiClient from "../api/apiClient";
import { useAuth } from "./Authentication"; // Assuming AuthContext exposes useAuth

const ProfileContext = createContext();

export const useProfile = () => {
  return useContext(ProfileContext);
};

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user, fetchProfile]);

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.put("/profile/update", profileData);
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

  const value = {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateProfileImage,
    updatePosterImage,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
