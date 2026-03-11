"use client";
import Image from "next/image";
import React from "react";

const Menhormone = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Full Background Image */}
      <Image
        src="/images/backImage.jpg"
        alt="background"
        fill
        className="object-cover w-full h-full"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-5xl">
          {/* Men Card */}
          <div className="relative overflow-hidden w-full h-[646px]">
            <Image
              src="/images/leftImage.jpg"
              alt="Men Hormone Replacement"
              fill
              className="object-cover object-top"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50" />

            <h2
              className="absolute top-7 left-7 text-2xl font-normal leading-snug text-black"
              style={{ fontFamily: "Georgia, serif", whiteSpace: "pre-line" }}
            >
              {"Men Hormone\nReplacement"}
            </h2>

            <button className="absolute bottom-7 right-7 bg-black/80 backdrop-blur-sm text-white text-sm rounded-full px-6 py-3">
              Learn More
            </button>
          </div>

          {/* Women Card */}
          <div className="relative overflow-hidden w-full h-[646px]">
            <Image
              src="/images/rightImage.jpg"
              alt="Woman Hormone Replacement"
              fill
              className="object-cover object-top"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50" />

            <h2
              className="absolute top-7 left-7 text-2xl font-normal leading-snug text-black"
              style={{ fontFamily: "Georgia, serif", whiteSpace: "pre-line" }}
            >
              {"Woman Hormone\nReplacement"}
            </h2>

            <button className="absolute bottom-7 right-7 bg-black/80 backdrop-blur-sm text-white text-sm rounded-full px-6 py-3">
              Start Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menhormone;
