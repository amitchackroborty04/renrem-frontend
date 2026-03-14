"use client";

import React from "react";
import { Faq } from "@/components/Faq";
import DynamicHeroSection from "@/components/MenhrtHero";
import IvTherapySection from "../_components/IvTherapySection";
import IvTherapyBenefitsSection from "../_components/IvTherapyBenefitsSection";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

// Mapping for each category: image, title, description
const categoryHeroData: Record<
  string,
  { bgImage: string; title: string; description: string }
> = {
  "Men HRT": {
    bgImage: "/menhtrt-hero.png",
    title: "FEEL LIKE YOU AGAIN",
    description:
      "TRT isn’t just about gym gains. It’s about having more energy & presence for the people who matter most.",
  },
  "Women HRT": {
    bgImage: "/women.png",
    title: "FEEL BALANCED. FEEL LIKE YOURSELF AGAIN.",
    description:
      "TRT isn’t just about gym gains. It’s about having more energy & presence for the people who matter most.",
  },
  "Weight Loss": {
    bgImage: "/weight.png",
    title: "LOSE WEIGHT, FEEL GREAT!",
    description:
      "TRT isn’t just about gym gains. It’s about having more energy & presence for the people who matter most.",
  },
  "IV Therapy": {
    bgImage: "/iv.png",
    title: "FEEL REFRESHED. RECOVER FASTER.",
    description: 
      "IV Therapy delivers essential vitamins and nutrients directly into your bloodstream for fast, effective results.",
  },
  "Peptides": {
    bgImage: "/ppp.png",
    title: "FEEL STRONGER. HEAL FASTER.",
    description: 
      "Peptide therapy helps your body recover, regenerate, and perform at its best—naturally and effectively.",
  },
};

const Page = () => {
  const params = useParams();

  // ✅ Properly handle string | string[] for slug
  let slug: string | null = null;
  if (params?.slug) {
    if (typeof params.slug === "string") {
      slug = decodeURIComponent(params.slug);
    } else if (Array.isArray(params.slug) && params.slug.length > 0) {
      slug = decodeURIComponent(params.slug[0]); // use first element if array
    }
  }

  // Fetch category data based on slug
  const { data: categoryData, isLoading, isError } = useQuery({
    queryKey: ["categoryData", slug],
    queryFn: async () => {
      if (!slug) return null;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/treatment?category=${slug}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch category data");
      }

      return res.json();
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Fetch treatment benefits separately
  const { data: benefitData, isLoading: isBenefitLoading, isError: isBenefitError } = useQuery({
    queryKey: ["treatmentBenefit", slug],
    queryFn: async () => {
      if (!slug) return null;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/treatment-benefit?category=${slug}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch treatment benefits");
      }

      return res.json();
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

  // Loading state
  if (isLoading || isBenefitLoading)
    return <div className="text-center py-20 text-gray-500">Loading...</div>;

  // Error state
  if (isError || isBenefitError)
    return (
      <div className="text-center py-20 text-red-500">
        Something went wrong while fetching category data.
      </div>
    );

  // Use mapping data for hero section
  const heroData =
    (slug && categoryHeroData[slug]) || categoryHeroData["IV Therapy"];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <DynamicHeroSection
        bgImage={heroData.bgImage}
        title={heroData.title}
        description={heroData.description}
      />

      {/* Category Section */}
      <IvTherapySection category={categoryData} />

      {/* Benefits Section */}
      <IvTherapyBenefitsSection benefits={benefitData} />

      {/* FAQ Section */}
      <Faq />
    </div>
  );
};

export default Page;