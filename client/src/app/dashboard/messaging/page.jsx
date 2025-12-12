"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../context/Authentication";
import apiClient from "@/api/apiClient";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import { Search, Send, Inbox, X, Loader2 } from "lucide-react";
import Image from "next/image";

const MessageSkeleton = () => (
  <div className="p-4 flex gap-4 animate-pulse border-b border-gray-100 dark:border-gray-700 last:border-0">
    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
    <div className="flex-1 space-y-2">
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);

const MessagingPage = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("received"); // 'received' | 'sent'
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Compose State
  const [messageContent, setMessageContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  const fetchMessages = useCallback(async () => {
    setIsLoadingMessages(true);
    try {
      const endpoint =
        activeTab === "received"
          ? "/api/messages/received"
          : "/api/messages/sent";
      const res = await apiClient.get(endpoint);
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoadingMessages(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user, fetchMessages]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const res = await apiClient.get(`/api/users/search?query=${query}`);
      if (res.data.success) {
        setSearchResults(res.data.data);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setSearchQuery("");
    setSearchResults([]);
    setShowCompose(true);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedUser || !messageContent.trim()) return;

    setIsSending(true);
    try {
      const res = await apiClient.post("/api/messages/send", {
        recipientId: selectedUser._id,
        content: messageContent,
      });

      if (res.data.success) {
        toast.success("Message sent successfully!");
        setMessageContent("");
        setShowCompose(false);
        setSelectedUser(null);
        if (activeTab === "sent") {
          fetchMessages();
        }
      }
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh] dark:text-gray-200">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-gray-800 dark:text-gray-100 transition-colors duration-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Messaging</h1>
        <button
          onClick={() => setShowCompose(!showCompose)}
          className="bg-blue-600 dark:bg-blue-500 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg font-medium"
        >
          <Send size={18} /> <span className="hidden sm:inline">Compose</span>
        </button>
      </div>

      {showCompose && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
            <h2 className="text-lg font-semibold dark:text-white">
              New Message
            </h2>
            <button
              onClick={() => setShowCompose(false)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Search Input */}
          <div className="relative mb-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              To:
            </label>
            {selectedUser ? (
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg border border-blue-100 dark:border-blue-800 inline-flex">
                <span className="font-medium text-blue-800 dark:text-blue-300">
                  {selectedUser.firstName} {selectedUser.lastName}
                </span>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-0.5 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full transition"
                >
                  <X size={14} className="text-blue-600 dark:text-blue-400" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or username..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white dark:placeholder-gray-500 transition"
                />
                <Search
                  className="absolute left-3 top-3 text-gray-400 dark:text-gray-500"
                  size={18}
                />

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute z-20 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mt-1 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {searchResults.map((result) => (
                      <div
                        key={result._id}
                        onClick={() => selectUser(result)}
                        className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                        <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600">
                          <Image
                            src={
                              result.profileImage ||
                              "/assets/default-avatar.jpg"
                            }
                            alt={result.username}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
                            {result.firstName} {result.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            @{result.username}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <form onSubmit={handleSend}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Message:
              </label>
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows="5"
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none dark:text-white dark:placeholder-gray-500 transition"
                placeholder="Type your message here..."
              ></textarea>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending || !selectedUser || !messageContent.trim()}
                className={`bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-all ${
                  isSending || !selectedUser || !messageContent.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700 dark:hover:bg-blue-600 shadow-sm hover:shadow"
                }`}
              >
                {isSending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    Send Message <Send size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`pb-3 px-6 font-medium text-sm transition-all relative ${
            activeTab === "received"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("received")}
        >
          Inbox (Received)
          {activeTab === "received" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"></div>
          )}
        </button>
        <button
          className={`pb-3 px-6 font-medium text-sm transition-all relative ${
            activeTab === "sent"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("sent")}
        >
          Sent
          {activeTab === "sent" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"></div>
          )}
        </button>
      </div>

      {/* Message List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[400px] flex flex-col">
        {isLoadingMessages ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {[...Array(5)].map((_, i) => (
              <MessageSkeleton key={i} />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-12 text-gray-400 dark:text-gray-500">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-full mb-4">
              <Inbox size={48} className="opacity-50" />
            </div>
            <p className="text-lg font-medium">No messages found</p>
            <p className="text-sm mt-1">Start a conversation to see it here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {messages.map((msg) => {
              // Determine display user based on tab
              const displayUser =
                activeTab === "received"
                  ? msg.sender
                  : // For sent messages, we really want to show the RECIPIENT.
                    msg.conversation?.participants?.find(
                      (p) => p._id !== user._id
                    ) || msg.conversation?.participants?.[0];

              return (
                <div
                  key={msg._id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-150 flex gap-4 cursor-pointer group"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100 dark:border-gray-600 shrink-0">
                    <Image
                      src={
                        displayUser?.profileImage ||
                        "/assets/default-avatar.jpg"
                      }
                      alt="User"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {displayUser
                          ? `${displayUser.firstName} ${displayUser.lastName}`
                          : "Unknown User"}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap pt-0.5">
                        {formatDistanceToNow(new Date(msg.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">
                      {msg.content?.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;
