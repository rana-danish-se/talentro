"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import UserProfile from "./sections/UserProfile";
import UserAbout from "./sections/UserAbout";
import UserEducation from "./sections/UserEducation";
import UserProjects from "./sections/UserProjects";
import UserSkills from "./sections/UserSkills";
import UserServices from "./sections/UserServices";
import UserExperience from "./sections/UserExperience";

const UserProfilePage = () => {
  const params = useParams();
  const slug = params.id;

  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/api/users/${slug}`);
        const data = await res.json();

        if (data.success) {
          setUser(data.data.user);
          setProfile(data.data.user.profile);
        } else {
          setError(data.message || "User not found");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchUserProfile();
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
          <p className="text-neutral-400">{error}</p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-neutral-400">
            This user hasn&apos;t set up their profile yet.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full p-4">
      <UserProfile profile={profile} user={user} />
      <UserAbout profile={profile} />
      <UserEducation educations={user?.educations || []} />
      <UserExperience experiences={user?.experiences || []} />
      <UserProjects projects={user?.projects || []} />
      <UserSkills skills={user?.skills || []} />
      <UserServices services={user?.services || []} />
    </main>
  );
};

export default UserProfilePage;
