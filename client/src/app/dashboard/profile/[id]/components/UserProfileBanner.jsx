"use client";
import React from "react";
import Image from "next/image";

const UserProfileBanner = ({ profile }) => {
  const defaultBanner =
    "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop";
  const defaultProfile = "/assets/default-avatar.jpg";

  const bannerImage = profile?.posterImage || defaultBanner;
  const profileImage = profile?.profileImage || defaultProfile;

  return (
    <div className="w-full rounded-lg shadow-md overflow-hidden">
      <div className="relative w-full h-[250px] bg-gradient-to-r from-purple-500 to-blue-500">
        <Image
          src={bannerImage}
          alt="Banner"
          className="w-full h-full object-cover"
          width={1200}
          height={300}
          priority
        />
      </div>

      {/* Profile Picture Section */}
      <div className="relative px-6 pb-6">
        <div className="relative -mt-20 w-[160px] h-[160px] rounded-full border-4 border-white dark:border-gray-800 shadow-xl">
          <Image
            src={profileImage}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
            width={160}
            height={160}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfileBanner;
