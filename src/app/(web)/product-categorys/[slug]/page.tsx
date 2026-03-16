"use client";

import React from "react";
import { Faq } from "@/components/Faq";
import DynamicHeroSection from "@/components/MenhrtHero";
import IvTherapySection from "../_components/IvTherapySection";
import IvTherapyBenefitsSection from "../_components/IvTherapyBenefitsSection";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

// ─── Hero Data Mapping ────────────────────────────────────────────────────────

const categoryHeroData: Record<
  string,
  { bgImage: string; title: string; description: string }
> = {
  "Men HRT": {
    bgImage: "/menhtrt-hero.png",
    title: "FEEL LIKE YOU AGAIN",
    description:
      "TRT isn't just about gym gains. It's about having more energy & presence for the people who matter most.",
  },
  "Women HRT": {
    bgImage: "/women.png",
    title: "FEEL BALANCED. FEEL LIKE YOURSELF AGAIN.",
    description:
      "TRT isn't just about gym gains. It's about having more energy & presence for the people who matter most.",
  },
  "Weight Loss": {
    bgImage: "/weight.png",
    title: "LOSE WEIGHT, FEEL GREAT!",
    description:
      "TRT isn't just about gym gains. It's about having more energy & presence for the people who matter most.",
  },
  "IV Therapy": {
    bgImage: "/iv.png",
    title: "FEEL REFRESHED. RECOVER FASTER.",
    description:
      "IV Therapy delivers essential vitamins and nutrients directly into your bloodstream for fast, effective results.",
  },
  Peptides: {
    bgImage: "/ppp.png",
    title: "FEEL STRONGER. HEAL FASTER.",
    description:
      "Peptide therapy helps your body recover, regenerate, and perform at its best—naturally and effectively.",
  },
};

// ─── Skeleton Components ──────────────────────────────────────────────────────

const HeroSkeleton = () => (
  <div className="relative w-full h-[500px] bg-gray-200 animate-pulse overflow-hidden">
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
      <div className="h-10 w-2/3 bg-gray-300 rounded-md" />
      <div className="h-5 w-1/2 bg-gray-300 rounded-md" />
      <div className="h-5 w-2/5 bg-gray-300 rounded-md" />
      <div className="mt-4 h-12 w-40 bg-gray-300 rounded-full" />
    </div>
  </div>
);

const IvTherapySkeleton = () => (
  <div className="w-full max-w-7xl mx-auto px-4 py-12 animate-pulse">
    <div className="h-8 w-48 bg-gray-200 rounded mb-8 mx-auto" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl bg-gray-100 p-6 flex flex-col gap-4"
        >
          <div className="h-40 bg-gray-200 rounded-lg" />
          <div className="h-5 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
          <div className="h-10 w-32 bg-gray-300 rounded-full mt-auto" />
        </div>
      ))}
    </div>
  </div>
);

const BenefitsSkeleton = () => (
  <div className="w-full bg-gray-50 py-12 animate-pulse">
    <div className="max-w-7xl mx-auto px-4">
      <div className="h-8 w-56 bg-gray-200 rounded mb-8 mx-auto" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-3 p-6">
            <div className="h-14 w-14 rounded-full bg-gray-200" />
            <div className="h-5 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Page Component ───────────────────────────────────────────────────────────

const Page = () => {
  const params = useParams();

  // Handle string | string[] for slug
  let slug: string | null = null;
  if (params?.slug) {
    if (typeof params.slug === "string") {
      slug = decodeURIComponent(params.slug);
    } else if (Array.isArray(params.slug) && params.slug.length > 0) {
      slug = decodeURIComponent(params.slug[0]);
    }
  }

  // Fetch category data
  const {
    data: categoryData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categoryData", slug],
    queryFn: async () => {
      if (!slug) return null;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/treatment?category=${slug}`
      );
      if (!res.ok) throw new Error("Failed to fetch category data");
      return res.json();
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch treatment benefits
  const {
    data: benefitData,
    isLoading: isBenefitLoading,
    isError: isBenefitError,
  } = useQuery({
    queryKey: ["treatmentBenefit", slug],
    queryFn: async () => {
      if (!slug) return null;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/treatment-benefit?category=${slug}`
      );
      if (!res.ok) throw new Error("Failed to fetch treatment benefits");
      return res.json();
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

  // Error state
  if (isError || isBenefitError)
    return (
      <div className="text-center py-20 text-red-500">
        Something went wrong while fetching category data.
      </div>
    );

  const heroData =
    (slug && categoryHeroData[slug]) || categoryHeroData["IV Therapy"];

  return (
    <div className="w-full">
      {/* Hero Section */}
      {isLoading ? (
        <HeroSkeleton />
      ) : (
        <DynamicHeroSection
          bgImage={heroData.bgImage}
          title={heroData.title}
          description={heroData.description}
        />
      )}

      {/* Category / IV Therapy Section */}
      {isLoading ? (
        <IvTherapySkeleton />
      ) : (
        <IvTherapySection category={categoryData} />
      )}

      {/* Benefits Section */}
      {isBenefitLoading ? (
        <BenefitsSkeleton />
      ) : (
        <IvTherapyBenefitsSection benefits={benefitData} />
      )}

      {/* FAQ Section */}
      <Faq />
    </div>
  );
};

export default Page;