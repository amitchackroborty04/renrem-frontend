"use client";

import { useEffect, useState } from "react";

export default function NotFoundPage() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 200);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div
        className={`text-center transition-all duration-700 ${
          animate ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <h1 className="text-7xl font-bold text-gray-900">404</h1>

        <p className="mt-4 text-lg text-gray-600">
          Oops! Page not found.
        </p>

        <button
          onClick={() => (window.location.href = "/")}
          className="mt-6 px-6 py-3 bg-[#0024DA] text-white rounded-lg text-sm hover:opacity-90 transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}