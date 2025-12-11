"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const UserAbout = ({ profile }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef(null);

  // Derive aboutContent directly from profile
  const aboutContent = profile?.about || "No about info added yet.";

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setShowButton(contentHeight > 100);
    }
  }, [aboutContent]);

  const hasAbout = profile?.about && profile.about.trim() !== "";

  return (
    <section
      id="about"
      className="max-w-4xl bg-neutral-950 shadow-2xl my-10 border-neutral-700 border p-10 mx-auto rounded-xl overflow-hidden mt-10"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-semibold text-purple-500">
          About
        </h2>
      </div>

      <article
        className={`mt-10 ${
          isExpanded ? "max-h-auto" : "max-h-50"
        } overflow-hidden relative`}
      >
        {hasAbout ? (
          <>
            <div
              ref={contentRef}
              style={{
                maxHeight: isExpanded || !showButton ? "none" : "100px",
                overflow: "hidden",
                transition: "max-height 0.3s ease",
              }}
              className="prose prose-invert reset-tw prose-purple max-w-none"
            >
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="mb-4 text-gray-300">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-purple-400 font-semibold">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="text-purple-300">{children}</em>
                  ),
                }}
              >
                {aboutContent}
              </ReactMarkdown>
            </div>

            {showButton && !isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent pt-12">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-purple-500 hover:text-purple-400 cursor-pointer font-medium text-sm transition-colors"
                >
                  See More
                </button>
              </div>
            )}

            {showButton && isExpanded && (
              <div className="mt-2 flex justify-start">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-purple-500 hover:text-purple-400 cursor-pointer font-medium text-sm transition-colors"
                >
                  <a href="#about">See Less</a>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-400 italic">
            No about information available
          </div>
        )}
      </article>
    </section>
  );
};

export default UserAbout;
