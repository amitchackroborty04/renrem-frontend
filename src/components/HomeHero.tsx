import Link from "next/link";
import React from "react";

function HomeHero() {
  return (
    <section className="relative w-full h-[50vh] sm:h-[82vh] lg:h-[82vh]">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/home-hero.png')" }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-0 flex flex-col pt-[130px] h-full max-w-5xl">

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[120%]">
          MODERN APPROACH
        </h1>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white pt-5 leading-[120%]">
          To Wellness
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-[#E5E5E5] my-4 sm:my-5 max-w-md">
          A cost-effective, medically supervised solution for lasting weight
          loss.
        </p>

        {/* Button */}
        <Link href="/product-categorys/Weight%20Loss">
        <button className="px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base lg:text-[20px] font-medium rounded-full bg-[#7DBAED] border-white/40 text-black backdrop-blur-sm hover:bg-[#7DBAED]/90 transition-all duration-200 w-fit">
          Start now
        </button>
        </Link>

      </div>
    </section>
  );
}

export default HomeHero;