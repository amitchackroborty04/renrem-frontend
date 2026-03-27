"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface TreatmentResponseAnswer {
  question: string;
  selectedAnswer: string;
  score?: number;
  matchLevel?: string;
  _id?: string;
}

interface RecommendedProduct {
  _id: string;
  name: string;
  description: string;
  price?: number;
  category?: string;
  image: string[];
}

interface TreatmentResultData {
  treatment?: string;
  treatmentBenefit?: string;
  user?: string;
  answers?: TreatmentResponseAnswer[];
  totalQuestions?: number;
  totalScore?: number;
  averageScore?: number;
  matchPercentage?: number;
  isCompleted?: boolean;
  treatmentTitle?: string;
  resultSummary?: {
    level?: string;
    statusBadge?: string;
    title?: string;
    text?: string;
    _id?: string;
  };
  assessmentSummary?: {
    overview?: string;
    whyItMatches?: string;
    keyBenefits?: string[];
    generatedText?: string;
  };
  bestMatch?: {
    sourceType?: string;
    title?: string;
    category?: string;
    matchPercentage?: number;
  };
  recommendedProducts?: RecommendedProduct[];
  recommendedProduct?: RecommendedProduct | null;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

const STORAGE_KEYS = {
  treatment: "treatmentResult",
  benefit: "treatmentBenefitResult",
} as const;

export default function TreatmentResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams.get("source") === "benefit" ? "benefit" : "treatment";
  const storageKey = source === "benefit" ? STORAGE_KEYS.benefit : STORAGE_KEYS.treatment;

  const [result, setResult] = useState<TreatmentResultData | null>(null);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  useEffect(() => {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) {
      setResult(null);
      return;
    }
    try {
      const parsed = JSON.parse(raw) as TreatmentResultData;
      setResult(parsed);
    } catch {
      setResult(null);
    }
  }, [storageKey]);

  const recommendedItems = useMemo(() => {
    if (Array.isArray(result?.recommendedProducts) && result?.recommendedProducts?.length) {
      return result.recommendedProducts;
    }
    if (result?.recommendedProduct) {
      return [result.recommendedProduct];
    }
    return [];
  }, [result]);

  const canPrev = startIndex > 0;
  const canNext = startIndex + visibleCount < recommendedItems.length;
  const visibleRecommended = recommendedItems.slice(
    startIndex,
    startIndex + visibleCount
  );

  if (!result) {
    return (
      <section className="min-h-screen bg-[#f5f7fb]">
        <div className="container mx-auto px-4 py-16">
          <div className="rounded-3xl border border-[#E6E8F0] bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-wide text-[#7a7a7a]">
              No Result Found
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-[#131313]">
              We couldn&apos;t load your assessment.
            </h1>
            <p className="mt-2 text-sm text-[#5f6368]">
              Please go back and complete the quiz again.
            </p>
            <button
              type="button"
              onClick={() => router.back()}
              className="mt-6 inline-flex items-center justify-center rounded-full border border-[#1a1a1a] px-6 py-3 text-sm font-semibold text-[#1a1a1a] transition hover:bg-[#1a1a1a] hover:text-white"
            >
              Go Back
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f5f7fb]">
      <div className="container mx-auto px-4 py-10 sm:py-14 lg:py-16">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1a1a1a] transition hover:text-[#1239e6]"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E5F0] bg-white">
            <svg width="14" height="14" viewBox="0 0 16 16">
              <path
                d="M10 3L5 8L10 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          Back to previous page
        </button>

        <div className="relative overflow-hidden rounded-[32px] border border-[#E6E8F0] bg-white/90 p-8 shadow-[0_18px_60px_rgba(16,24,40,0.12)] backdrop-blur sm:p-10">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#dbe4ff] blur-3xl opacity-70" />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#eef1ff] blur-3xl opacity-80" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-[#ffffff] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#1239e6] shadow-sm">
                  {result.resultSummary?.statusBadge || "Assessment Result"}
                </span>
                {result.treatmentTitle && (
                  <span className="inline-flex items-center rounded-full bg-[#131313] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
                    {result.treatmentTitle}
                  </span>
                )}
              </div>

              <h1 className="text-[28px] font-bold leading-tight text-[#131313] sm:text-[34px]">
                {result.resultSummary?.title || "Your Treatment Match"}
              </h1>
              <p className="text-[15px] leading-7 text-[#222] sm:text-[17px]">
                {result.resultSummary?.text ||
                  "We analyzed your answers to find the best match for you."}
              </p>

              {result.assessmentSummary?.overview && (
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
                  <p className="text-[12px] uppercase tracking-wide text-[#7a7a7a]">
                    Assessment Overview
                  </p>
                  <p className="mt-2 text-[15px] leading-7 text-[#222]">
                    {result.assessmentSummary.overview}
                  </p>
                </div>
              )}
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-[#1239e6] via-[#0f31c9] to-[#0a1f7a] p-6 text-white shadow-lg">
                <p className="text-xs uppercase tracking-wide text-white/70">
                  Match Score
                </p>
                <p className="mt-2 text-5xl font-bold">
                  {result.matchPercentage ?? 0}%
                </p>
                <p className="mt-3 text-sm text-white/80">
                  {result.bestMatch?.title || "Recommended Treatment"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white px-4 py-4 shadow-sm">
                  <p className="text-[11px] uppercase tracking-wide text-[#7a7a7a]">
                    Avg Score
                  </p>
                  <p className="mt-1 text-[18px] font-bold text-[#131313]">
                    {result.averageScore ?? 0}
                  </p>
                </div>
                <div className="rounded-xl bg-white px-4 py-4 shadow-sm">
                  <p className="text-[11px] uppercase tracking-wide text-[#7a7a7a]">
                    Total Score
                  </p>
                  <p className="mt-1 text-[18px] font-bold text-[#131313]">
                    {result.totalScore ?? 0}
                  </p>
                </div>
                <div className="rounded-xl bg-white px-4 py-4 shadow-sm">
                  <p className="text-[11px] uppercase tracking-wide text-[#7a7a7a]">
                    Questions
                  </p>
                  <p className="mt-1 text-[18px] font-bold text-[#131313]">
                    {result.totalQuestions ?? 0}
                  </p>
                </div>
                <div className="rounded-xl bg-white px-4 py-4 shadow-sm">
                  <p className="text-[11px] uppercase tracking-wide text-[#7a7a7a]">
                    Status
                  </p>
                  <p className="mt-1 text-[18px] font-bold text-[#131313]">
                    {result.isCompleted ? "Completed" : "Pending"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {(result.bestMatch || result.assessmentSummary?.whyItMatches) && (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {result.bestMatch && (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <p className="text-[12px] uppercase tracking-wide text-[#7a7a7a]">
                  Best Match
                </p>
                <p className="mt-2 text-[18px] font-semibold text-[#131313]">
                  {result.bestMatch.title || "Recommended Treatment"}
                </p>
                <p className="mt-1 text-sm text-[#555]">
                  {result.bestMatch.category || "Category"} ·{" "}
                  {result.bestMatch.matchPercentage ?? result.matchPercentage ?? 0}%
                </p>
              </div>
            )}
            {result.assessmentSummary?.whyItMatches && (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <p className="text-[12px] uppercase tracking-wide text-[#7a7a7a]">
                  Why It Matches
                </p>
                <p className="mt-2 text-[15px] leading-7 text-[#222]">
                  {result.assessmentSummary.whyItMatches}
                </p>
              </div>
            )}
          </div>
        )}

        {result.assessmentSummary?.keyBenefits?.length ? (
          <div className="mt-10 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <p className="text-[12px] uppercase tracking-wide text-[#7a7a7a]">
              Key Benefits
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.assessmentSummary.keyBenefits.map((benefit, index) => (
                <span
                  key={`${benefit}-${index}`}
                  className="inline-flex items-center rounded-full border border-[#D9DDE5] bg-[#F7F8FB] px-3 py-1 text-xs font-medium text-[#1F2937]"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {result.assessmentSummary?.generatedText && (
          <div className="mt-10 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[12px] uppercase tracking-wide text-[#7a7a7a]">
                Detailed Summary
              </p>
              <button
                type="button"
                onClick={() => setShowFullSummary((prev) => !prev)}
                className="text-xs font-semibold text-[#1239e6] hover:text-[#0f31c9]"
              >
                {showFullSummary ? "Show Less" : "Read More"}
              </button>
            </div>
            <p
              className={[
                "mt-2 text-[15px] leading-7 text-[#222]",
                showFullSummary ? "" : "line-clamp-4",
              ].join(" ")}
            >
              {result.assessmentSummary.generatedText}
            </p>
          </div>
        )}

        {Array.isArray(result.answers) && result.answers.length > 0 && (
          <div className="mt-10 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <p className="text-[12px] uppercase tracking-wide text-[#7a7a7a]">
              Your Answers
            </p>
            <div className="mt-4 space-y-3">
              {result.answers.map((item, index) => (
                <div
                  key={`${item.question}-${index}`}
                  className="rounded-xl border border-[#EEF0F6] bg-[#F9FAFC] p-4"
                >
                  <p className="text-sm text-[#6b7280]">{item.question}</p>
                  <p className="mt-1 text-[15px] font-semibold text-[#131313]">
                    {item.selectedAnswer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendedItems.length > 0 && (
          <div className="mt-12 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-[20px] font-semibold text-[#131313] sm:text-[22px]">
                Recommended Products
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => canPrev && setStartIndex((i) => i - 1)}
                  disabled={!canPrev}
                  className={[
                    "w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200",
                    canPrev
                      ? "border-[#aaa] text-[#333] hover:bg-[#1a1a1a] hover:text-white"
                      : "border-[#ccc] text-[#ccc] cursor-not-allowed opacity-50",
                  ].join(" ")}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path
                      d="M10 3L5 8L10 13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => canNext && setStartIndex((i) => i + 1)}
                  disabled={!canNext}
                  className={[
                    "w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200",
                    canNext
                      ? "border-[#aaa] text-[#333] hover:bg-[#1a1a1a] hover:text-white"
                      : "border-[#ccc] text-[#ccc] cursor-not-allowed opacity-50",
                  ].join(" ")}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path
                      d="M6 3L11 8L6 13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleRecommended.map((item) => (
                <Link href={`/product/${item._id}`} key={item._id}>
                  <div className="flex flex-col gap-3 cursor-pointer group">
                    <div className="relative w-full aspect-square rounded-sm overflow-hidden">
                      <Image
                        src={item.image?.[0] || "/images/placeholder.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl lg:text-[26px] font-medium text-[#131313] tracking-tight">
                        {item.name}
                      </h3>
                      <p className="text-sm sm:text-base text-[#AAA8A8] font-light tracking-wide line-clamp-1 mt-3">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
