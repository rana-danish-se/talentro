"use client";
import React, { useState } from "react";
import { Mail, Phone, Globe, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ConnectionButtons from "./ConnectionButtons";

const UserProfileInfo = ({ profile, user }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const fullName = profile
    ? `${profile.firstName || ""} ${profile.lastName || ""}`
    : "User";
  const headline = profile?.headline || "No headline";
  const location = {
    city: profile?.location?.city || "City",
    country: profile?.location?.country || "Country",
  };

  const hasContactInfo =
    profile?.contactInfo &&
    (profile.contactInfo.primaryEmail ||
      profile.contactInfo.phoneNumber ||
      (profile.contactInfo.websites &&
        profile.contactInfo.websites.length > 0));

  return (
    <>
      <div className="px-10 flex items-start justify-between gap-6">
        <div className="max-w-2xl flex-1">
          <h1 className="text-2xl md:text-4xl text-purple-500 font-bold">
            {fullName}
          </h1>
          <p className="text-md mt-2">{headline}</p>

          {/* Connection Count */}
          {user?.connectionCount !== undefined && (
            <p className="text-sm text-neutral-400 mt-1">
              {user.connectionCount}{" "}
              {user.connectionCount === 1 ? "connection" : "connections"}
            </p>
          )}

          <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
            <p>
              {location.city}, {location.country}
            </p>
            {profile?.industry && (
              <>
                <span>•</span>
                <p>{profile.industry}</p>
              </>
            )}
            {hasContactInfo && (
              <>
                <span>•</span>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="text-purple-500 hover:underline cursor-pointer"
                >
                  Contact Info
                </button>
              </>
            )}
          </div>
        </div>

        {/* Connection Buttons */}
        <div className="flex-shrink-0">
          <ConnectionButtons user={user} />
        </div>
      </div>


      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsContactModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Contact Information
                </h3>
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* Profile Info */}
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    {profile?.profileImage && (
                      <Image
                        src={profile.profileImage}
                        alt={fullName}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {fullName}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {headline}
                    </p>
                  </div>
                </div>

                {/* Email */}
                {profile?.contactInfo?.primaryEmail && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${profile.contactInfo.primaryEmail}`}
                        className="text-sm text-purple-600 dark:text-purple-400 hover:underline break-all"
                      >
                        {profile.contactInfo.primaryEmail}
                      </a>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {profile?.contactInfo?.phoneNumber && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                        Phone{" "}
                        {profile.contactInfo.phoneType && (
                          <span className="text-gray-400">
                            ({profile.contactInfo.phoneType})
                          </span>
                        )}
                      </p>
                      <a
                        href={`tel:${profile.contactInfo.phoneNumber}`}
                        className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        {profile.contactInfo.phoneNumber}
                      </a>
                    </div>
                  </div>
                )}

                {/* Websites */}
                {profile?.contactInfo?.websites &&
                  profile.contactInfo.websites.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                        <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                          Websites
                        </p>
                        <div className="space-y-2">
                          {profile.contactInfo.websites.map(
                            (website, index) => (
                              <div key={index}>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                                  {website.type}
                                </p>
                                <a
                                  href={website.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline break-all"
                                >
                                  {website.url}
                                </a>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                {/* No Contact Info Message */}
                {!hasContactInfo && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No contact information available</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 rounded-b-2xl">
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="w-full px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserProfileInfo;
