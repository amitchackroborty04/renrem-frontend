"use client";
import Image from "next/image";
import React, { useState } from "react";

const items = [
  {
    id: 1,
    name: "NAD+",
    subtitle: "works in 15 minutes",
    image: "/images/backImage.jpg",
  },
  {
    id: 2,
    name: "MIC-B12",
    subtitle: "works in 15 minutes",
    image: "/images/backImage.jpg",
  },
  {
    id: 3,
    name: "Glutathione",
    subtitle: "works in 15 minutes",
    image: "/images/backImage.jpg",
  },
  {
    id: 4,
    name: "Vitamin C",
    subtitle: "works in 15 minutes",
    image: "/images/backImage.jpg",
  },
  {
    id: 5,
    name: "B-Complex",
    subtitle: "works in 15 minutes",
    image: "/images/backImage.jpg",
  },
];

const VISIBLE = 3;

const HomeCarusal = () => {
  const [startIndex, setStartIndex] = useState(0);

  const canPrev = startIndex > 0;
  const canNext = startIndex + VISIBLE < items.length;

  const prev = () => { if (canPrev) setStartIndex((i) => i - 1); };
  const next = () => { if (canNext) setStartIndex((i) => i + 1); };

  const visible = items.slice(startIndex, startIndex + VISIBLE);

  return (
    <section className="py-[80px] container mx-auto">
      {/* Cards Row */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {visible.map((item) => (
          <div key={item.id} className="flex flex-col gap-3 cursor-pointer group">
            {/* Image Box */}
            <div className="relative w-full aspect-square rounded-sm overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Text */}
            <div>
              <h3
                className="text-[22px] font-light text-[#1a1a1a] tracking-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {item.name}
              </h3>
              <p className="text-xs text-[#888] mt-0.5 font-light tracking-wide">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows — bottom right */}
      <div className="flex justify-end gap-3 mt-2">
        <button
          onClick={prev}
          disabled={!canPrev}
          className={[
            "w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200",
            canPrev
              ? "border-[#aaa] text-[#333] hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a]"
              : "border-[#ccc] text-[#ccc] cursor-not-allowed",
          ].join(" ")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          onClick={next}
          disabled={!canNext}
          className={[
            "w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200",
            canNext
              ? "border-[#aaa] text-[#333] hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a]"
              : "border-[#ccc] text-[#ccc] cursor-not-allowed",
          ].join(" ")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default HomeCarusal;