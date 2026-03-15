"use client";

import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

type HeroSectionProps = {
  bgImage: string;
  title: string;
  description: string;
  minHeightClass?: string;
  overlayClassName?: string;
};

export default function DynamicHeroSection({
  bgImage,
  title,
  description,
  minHeightClass = "h-[35vh] md:h-[70vh]",
  overlayClassName = "bg-[#10101063]",
}: HeroSectionProps) {
  return (
    <section
      className={`relative w-full ${minHeightClass} flex items-center overflow-hidden`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${bgImage}')`,
        }}
      />

      <div className={`absolute inset-0 ${overlayClassName}`} />

      <div className="relative z-10 mx-auto w-full container px-6 sm:px-12 lg:px-0">
        <div className="max-w-3xl">
          <h1
            className={`${manrope.className} mb-6 text-[38px] font-bold uppercase leading-[115%] tracking-tight text-white sm:text-[52px] lg:text-[72px]`}
          >
            {title}
          </h1>

          <p
            className={`${manrope.className} max-w-xl text-sm font-normal leading-[150%] text-white/85 sm:text-base lg:text-lg`}
          >
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}