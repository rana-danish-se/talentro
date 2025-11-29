
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "@/api/apiClient";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const res = await apiClient.get("/api/auth/me");
        if (res.data.success) {
          if (res.data.data && res.data.data.user) {
            setUser(res.data.data.user);
          } else {
            console.log("User data missing in response:", res.data);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log("User not logged in (checkUserLoggedIn error):", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUserLoggedIn();
  }, []);

  const register = async (userData) => {
    try {
      const res = await apiClient.post("/api/auth/register", userData);
      if (res.data.success) {
        toast.success(res.data.message || "Registration successful!");
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await apiClient.post("/api/auth/login", { email, password });
      if (res.data.success) {
        toast.success(res.data.message || "Login successful!");
        
        // Set user immediately from login response
        if (res.data.data && res.data.data.user) {
          setUser(res.data.data.user);
        } else if (res.data.user) {
          setUser(res.data.user);
        } else {
          const meRes = await apiClient.get("/api/auth/me");
          if (meRes.data.success && meRes.data.data && meRes.data.data.user) {
            setUser(meRes.data.data.user);
          }
        }
        
        // Wait a tiny bit to ensure state is updated before navigation
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push("/dashboard");
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const verifyEmail = async (token) => {
    try {
      const res = await apiClient.get(`/api/auth/verify-email/${token}`);
      if (res.data.success) {
        toast.success(res.data.message);
        if (res.data.data && res.data.data.user) {
          setUser(res.data.data.user);
        }
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      const message = error.response?.data?.message || "Verification failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/api/auth/logout");      
      setUser(null);
      router.push("/auth/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error", error);
      setUser(null);
      router.push("/auth/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, verifyEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};