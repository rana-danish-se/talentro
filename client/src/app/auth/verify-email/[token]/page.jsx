"use client";

import { use, useEffect, useState } from "react";

import { toast } from "react-toastify";
import Link from "next/link";
import apiClient from "@/api/apiClient";

export default function VerifyPage({ params }) {
  const { token } = use(params);
  const [status, setStatus] = useState("loading"); 
  const [message, setMessage] = useState("");
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await apiClient.get(`/api/auth/verify-email/${token}`);

        if (res.data.success) {
          setStatus("success");
          setMessage(res.data.message);
          toast.success(res.data.message);
        } else {
          setStatus("failed");
          setMessage(res.data.message);
          toast.error(res.data.message);
        }

      } catch (error) {
        setStatus("failed");
        toast.error(error.response?.data?.message || "Verification failed");
        setMessage(error.response?.data?.message || "Verification failed");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="bg-gray-900 p-10 rounded-xl shadow-xl w-full max-w-md text-center">

        {status === "loading" && (
          <>
            <h1 className="text-2xl font-bold mb-4">Verifying your email...</h1>
            <p className="text-gray-400">Please wait while we confirm your account.</p>
            <div className="loader mt-6 mx-auto border-4 border-gray-700 border-t-white rounded-full w-10 h-10 animate-spin"></div>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-green-400 mb-2">Email Verified 🎉</h1>
            <p className="text-gray-300 mb-5">{message}</p>

            <Link href="/login">
              <button className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg">
                Go to Login
              </button>
            </Link>
          </>
        )}

        {status === "failed" && (
          <>
            <h1 className="text-2xl font-bold text-red-400 mb-2">Verification Failed ❌</h1>
            <p className="text-gray-300 mb-5">{message}</p>

            <Link href="/">
              <button className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg">
                Go Home
              </button>
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
