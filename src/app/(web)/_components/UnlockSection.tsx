"use client";

import { useState } from "react";
import Image from "next/image";

export default function UnlockSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle email submission
  };

  return (
    <section className="relative px-8 py-14 sm:px-16 mt-[80px] mb-10 overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/unlockImage.png"
        alt="background"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Dark overlay — optional, image এর উপর content readable রাখতে */}
      {/* <div className="absolute inset-0 bg-black/10" /> */}

      {/* Content — left side */}
      <div className="flex justify-center mr-[34%]">
        <div className="relative z-10 max-w-xl ">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-snug mb-3">
            Unlock the free guide to protein for weight loss
          </h2>
          <p className="text-sm text-white/90 mb-6">
            Written By Board-Certified Doctors To Support Your Journey.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full bg-white rounded-xl px-5 h-[52px] text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-white/50 transition"
            />
            <button
              type="submit"
              className="w-full bg-[#111111] hover:bg-black text-white text-base font-medium h-[52px] rounded-full transition"
            >
              Get the guide
            </button>
          </form>

          <p className="mt-4 text-xs text-white/70 leading-relaxed max-w-xs">
            by creating an account using email, I agree to the Terms &
            condition, and acknowledge the Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
}
