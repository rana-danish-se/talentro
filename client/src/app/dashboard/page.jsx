"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/Authentication";
import PostCreation from "./sections/PostCreation";
import Feed from "./sections/Feed";
import ProfileCard from "./components/ProfileCard";

const DashboardPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const sampleUser = {
    fullName: "Rana Danish",
    headline:
      "Freelance MERN Stack Developer | Java + DSA + Python | Open to Remote & Freelance Work",
    location: "Lahore, Punjab",
    currentCompany: "Inventix Technologies (pvt.) Limited",
    profilePicture:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    profileViewers: 42,
    postImpressions: 27,
  };
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="p-6 flex flex-row items-start justify-center w-full ">
      <ProfileCard user={sampleUser} />
      <section className="max-w-2xl mx-auto   w-full">
        <PostCreation />
        <Feed />
      </section>
    </main>
  );
};

export default DashboardPage;
