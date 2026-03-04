"use client";

import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export default function MernhrtHero() {
  return (
    <section className="relative w-full min-h-[85vh] md:min-h-screen flex items-center overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/menhtrt-hero.png')", // replace with your image
        }}
      />

      {/* Left Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 w-full">
        <div className="max-w-2xl">

          {/* Heading */}
          <h1
            className={`${manrope.className}
            text-white
            uppercase
            font-bold
            leading-[115%]
            tracking-tight
            text-[38px]
            sm:text-[52px]
            lg:text-[72px]
            mb-6`}
          >
            FEEL LIKE
            <br />
            YOU AGAIN
          </h1>

          {/* Subtitle */}
          <p
            className={`${manrope.className}
            text-white/85
            text-sm
            sm:text-base
            lg:text-lg
            font-normal
            max-w-xl
            leading-[150%]`}
          >
            TRT isn’t just about gym gains. It’s about having more
            energy & presence for the people who matter most.
          </p>

        </div>
      </div>
    </section>
  );
}