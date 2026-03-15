"use client";

import { XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function PaymentFailedPage() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 200);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <div
        className={`w-full max-w-md bg-white shadow-xl rounded-2xl p-10 text-center transition-all duration-500 ${
          animate ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
        }`}
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <XCircle size={70} className="text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Payment Failed
        </h1>

        {/* Message */}
        <p className="mt-3 text-sm text-gray-600">
          We couldn&apos;`t process your payment. Please check your details
          and try again.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => (window.location.href = "/checkout")}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition"
          >
            Try Again
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}