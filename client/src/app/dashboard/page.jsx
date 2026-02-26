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
      "/assets/default-avatar.jpg",
    profileViewers: 42,
    postImpressions: 27,
  };
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="p-6 flex flex-row items-start justify-center w-full min-h-screen bg-white dark:bg-neutral-950 animate-pulse">
        {/* Profile Card Skeleton */}
        <div className="hidden lg:block w-72 h-[400px] bg-neutral-200 dark:bg-neutral-800 rounded-xl mr-6" />
        
        <section className="max-w-2xl w-full mx-auto space-y-4">
          {/* Post Creation Skeleton */}
          <div className="w-full h-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
          
          {/* Feed Skeletons */}
          <div className="w-full h-64 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
          <div className="w-full h-64 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
          <div className="w-full h-64 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
        </section>
      </main>
    );
  }

  return (
    <main className="p-6 flex  flex-row items-start justify-center w-full ">
      <ProfileCard />
      <section className="max-w-2xl  mx-auto">
        <PostCreation />
        <Feed />
      </section>
    </main>
  );
};

export default DashboardPage;
