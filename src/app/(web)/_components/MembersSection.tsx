"use client";
import Image from "next/image";
import React from "react";
import groupImage from "@/../../public/groupImage.png";

const MembersSection = () => {
  return (
    <div className="bg-[#ede9e3] ">
      <section className="w-full flex flex-col md:flex-row items-stretch min-h-[500px] container mx-auto">
        {/* Left — Single Image, half width */}
        <div className="relative w-full md:w-1/2 min-h-[400px] md:min-h-full">
          <Image
            src={groupImage}
            alt="member"
            fill
            className="object-cover"
          />
        </div>

        {/* Right — Content, half width */}
        <div className="w-full md:w-1/2 flex flex-col justify-center gap-8 px-12 py-14">
          {/* Members Count */}
          <div>
            <h2
              className="text-5xl font-light text-[#1a1a1a] tracking-tight leading-tight"
              style={{ fontFamily: "Georgia, serif" }}
            >
              3,000,000+
            </h2>
            <p
              className="text-3xl font-light text-[#1a1a1a] mt-1"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Members
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[#ccc5bb]" />

          {/* Testimonial */}
          <div className="flex flex-col gap-3">
            <p className="text-xs tracking-widest text-[#888] uppercase font-light">
              Hear From Clients
            </p>
            <blockquote
              className="text-2xl font-light text-[#1a1a1a] leading-snug"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Losing 55 Pound, My Day By Day Life Has Changed Dramatically
            </blockquote>
            <p className="text-sm text-[#999] font-light mt-1">David Harry</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MembersSection;
