"use client";
import { useAuth } from "@/context/Authentication";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

export default function VerifyPage({ params }) {
  const { verifyEmail } = useAuth();
  const router = useRouter();
  const { token } = use(params);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  useEffect(() => {
    const verify = async () => {
      try {
        const res = await verifyEmail(token);

        if (res.success) {
          setStatus("success");
          setMessage(res.message);
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        } else {
          setStatus("failed");
          setMessage(res.message);
        }
      } catch (error) {
        setStatus("failed");
        setMessage("Verification failed");
      }
    };

    verify();
  }, [token, verifyEmail, router]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="bg-gray-900 p-10 rounded-xl shadow-xl w-full max-w-md text-center">
        {status === "loading" && (
          <>
            <h1 className="text-2xl font-bold mb-4">Verifying your email...</h1>
            <p className="text-gray-400">
              Please wait while we confirm your account.
            </p>
            <div className="loader mt-6 mx-auto border-4 border-gray-700 border-t-white rounded-full w-10 h-10 animate-spin"></div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle className="text-green-500 w-16 h-16" />
            </div>
            <h1 className="text-2xl font-bold text-green-400 mb-2">
              Email Verified
            </h1>
            <p className="text-gray-300 mb-5">{message}</p>

            <Link href="/dashboard">
              <button className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg cursor-pointer transition-colors duration-200">
                Go to Dashboard
              </button>
            </Link>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="flex justify-center mb-4">
              <XCircle className="text-red-500 w-16 h-16" />
            </div>
            <h1 className="text-2xl font-bold text-red-400 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-300 mb-5">{message}</p>

            <Link href="/">
              <button className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg cursor-pointer transition-colors duration-200">
                Go Home
              </button>
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
