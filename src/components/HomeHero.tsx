"use client";

import { Button } from "@/components/ui/button";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

export default function HomeHero() {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen w-full flex items-center overflow-hidden">
      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/home-hero.png')",
        }}
      />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-16">
        <div className="max-w-2xl">

          {/* Title */}
          <h1
            className={`${manrope.className}
            text-[36px]
            sm:text-[48px]
            lg:text-[60px]
            font-bold
            leading-[120%]
            tracking-normal
            uppercase
            text-white
            mb-6`}
          >
            MODERN APPROACH
            <br />
            TO WELLNESS
          </h1>

          {/* Subtitle */}
          <p
            className={`${manrope.className}
            text-white/90
            text-sm
            sm:text-base
            lg:text-lg
            mb-8
            max-w-lg`}
          >
            A cost-effective, medically supervised solution for lasting weight loss.
          </p>

          {/* Button */}
          <Button
            size="lg"
            className={`${manrope.className}
            rounded-full
            px-10
            py-6
            text-base
            font-semibold
            text-slate-800
            bg-blue-300
            hover:bg-blue-400
            transition-all
            duration-300`}
          >
            Start now
          </Button>

        </div>
      </div>
    </section>
  );
}