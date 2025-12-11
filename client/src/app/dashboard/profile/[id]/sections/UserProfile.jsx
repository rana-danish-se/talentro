"use client";

import React from "react";
import UserProfileBanner from "../components/UserProfileBanner";
import UserProfileInfo from "../components/UserProfileInfo";

const UserProfile = ({ profile, user }) => {
  return (
    <section className="max-w-4xl bg-neutral-950 shadow-2xl my-10 border-neutral-700 border pb-10 mx-auto rounded-xl overflow-hidden mt-10">
      <UserProfileBanner profile={profile} />
      <UserProfileInfo profile={profile} user={user} />
    </section>
  );
};

export default UserProfile;
