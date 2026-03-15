"use client";

import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 200);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-10 text-center">
        
        {/* Animated Icon */}
        <div
          className={`flex justify-center transition-all duration-700 ${
            animate ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          <CheckCircle className="text-green-500" size={80} />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Payment Successful
        </h1>

        <p className="mt-3 text-sm text-gray-600">
          Your payment has been completed successfully.
        </p>

        <button
          className="mt-8 px-6 py-3 bg-[#0024DA] text-white rounded-lg text-sm hover:opacity-90 transition"
          onClick={() => (window.location.href = "/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}