"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface TreatmentQuestion {
  _id: string;
  question: string;
  options: string[];
  answare: string;
}

interface TreatmentBenefit {
  _id: string;
  title: string;
  category: string;
  description: string;
  treatmentQuestions?: TreatmentQuestion[];
}

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

interface TreatmentResponseData {
  treatmentBenefit: string;
  user: string;
  answers: TreatmentResponseAnswer[];
  totalQuestions: number;
  totalScore: number;
  averageScore: number;
  matchPercentage: number;
  isCompleted: boolean;
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
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface IvTherapyBenefitsSectionProps {
  benefits?: {
    statusCode: number;
    success: boolean;
    message: string;
    data: TreatmentBenefit[];
  };
}

export default function IvTherapyBenefitsSection({
  benefits,
}: IvTherapyBenefitsSectionProps) {
  const benefitItems = benefits?.data || [];
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const router = useRouter();

  // ── Quiz state ──────────────────────────────────────────────────────
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [resultData, setResultData] = useState<TreatmentResponseData | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
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
    if (!showQuiz) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showQuiz]);

  const allQuestions: (TreatmentQuestion & { benefitTitle: string })[] =
    benefitItems.flatMap((item) =>
      (item.treatmentQuestions || []).map((q) => ({
        ...q,
        benefitTitle: item.title,
      })),
    );

  const currentQuestion = allQuestions[currentQuestionIndex];
  const totalQuestions = allQuestions.length;
  const progress =
    totalQuestions > 0
      ? Math.round((currentQuestionIndex / totalQuestions) * 100)
      : 0;

  const handleOptionSelect = (questionId: string, option: string) => {
    setSelectedAnswers((prev) => {
      const current = prev[questionId] || [];
      const alreadySelected = current[0] === option;
      return {
        ...prev,
        [questionId]: alreadySelected ? [] : [option],
      };
    });
  };

  const submitMutation = useMutation({
    mutationFn: async (payload: {
      treatmentBenefit: string;
      answers: { question: string; selectedAnswer: string }[];
    }) => {
      if (!token) {
        throw new Error("Please sign in to submit your answers.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/treatment-response`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to submit treatment response";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // fallback if not JSON
        }
        throw new Error(`${errorMessage} (${response.status})`);
      }

      const json = await response.json();
      if (!json?.success) {
        throw new Error(json?.message || "Failed to submit treatment response");
      }

      return json.data as TreatmentResponseData;
    },
    onSuccess: (data) => {
      setResultData(data);
      setIsCompleted(true);
      setSubmitError(null);
      setStartIndex(0);
      setShowFullSummary(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("treatmentBenefitResult", JSON.stringify(data));
      }
      setShowQuiz(false);
      router.push("/treatment-result?source=benefit");
    },
    onError: (error: Error) => {
      setSubmitError(error.message || "Something went wrong. Please try again.");
      toast.error("Failed to submit answers", {
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const activeBenefitId = benefitItems[0]?._id;
      if (!activeBenefitId) {
        toast.error("No treatment benefit found.");
        return;
      }
      if (!token) {
        toast.error("Please sign in to submit your answers.");
        return;
      }
      setSubmitError(null);
      const answersPayload =
        allQuestions
          .map((q) => ({
            question: q.question,
            selectedAnswer: (selectedAnswers[q._id] || [])[0] || "",
          }))
          .filter((item) => item.selectedAnswer.length > 0) || [];

      submitMutation.mutate({
        treatmentBenefit: activeBenefitId,
        answers: answersPayload,
      });
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    setShowQuiz(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsCompleted(false);
    setResultData(null);
    setSubmitError(null);
    setStartIndex(0);
    setShowFullSummary(false);
  };

  // ✅ কমপক্ষে ১টা selected থাকলেই Next চালু
  const isCurrentAnswered = currentQuestion
    ? (selectedAnswers[currentQuestion._id] || []).length > 0
    : false;

  const recommendedItems =
    (Array.isArray(resultData?.recommendedProducts) &&
      resultData?.recommendedProducts?.length
      ? resultData?.recommendedProducts
      : resultData?.recommendedProduct
      ? [resultData.recommendedProduct]
      : []) || [];
  const canPrev = startIndex > 0;
  const canNext = startIndex + visibleCount < recommendedItems.length;
  const visibleRecommended = recommendedItems.slice(
    startIndex,
    startIndex + visibleCount
  );

  return (
    <>
      <section className="w-full py-12 sm:py-16 lg:py-20">
        <div className="mx-auto container px-4 sm:px-6 lg:px-8">
          <div className="mt-10 space-y-8 sm:mt-12 sm:space-y-10">
            {benefitItems.length > 0 ? (
              benefitItems.map((item) => (
                <div key={item._id}>
                  <h3
                    className="text-[28px] font-semibold leading-tight text-[#131313] sm:text-[38px] lg:text-[40px]"
                    dangerouslySetInnerHTML={{ __html: item.title || "" }}
                  />
                  <p
                    className="mt-4 text-sm leading-7 text-[#222] sm:text-[18px]"
                    dangerouslySetInnerHTML={{ __html: item.description || "" }}
                  />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No benefits available for this category.
              </p>
            )}
          </div>

          <div className="mt-10 flex justify-center sm:mt-14">
            <button
              type="button"
              onClick={() => setShowQuiz(true)}
              className="inline-flex h-[48px] min-w-[220px] items-center justify-center rounded-full bg-[#1239e6] px-8 text-sm font-medium text-white transition hover:bg-[#0f31c9] sm:h-[54px] sm:min-w-[260px]"
            >
              Customize Your Treatment
            </button>
          </div>
        </div>
      </section>

      {/* ── Quiz Modal ─────────────────────────────────────────────────── */}
      {showQuiz && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          {/* ── Completed State ── */}
          {isCompleted && resultData ? (
            <div
              className="relative w-full max-w-[980px] rounded-2xl bg-[#f0f2f5] shadow-2xl overflow-hidden"
              style={{ maxHeight: "80vh", overflowY: "auto" }}
            >
              <button
                onClick={handleClose}
                className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md text-red-600 hover:text-red-800 transition-all text-2xl font-bold"
              >
                ×
              </button>

              <div className="px-8 py-10 sm:px-10 sm:py-12">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex w-fit items-center rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#1239e6] shadow-sm">
                      {resultData.resultSummary?.statusBadge || "Treatment Result"}
                    </span>
                    {resultData.treatmentTitle && (
                      <span className="inline-flex w-fit items-center rounded-full bg-[#131313] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
                        {resultData.treatmentTitle}
                      </span>
                    )}
                  </div>
                  <h2 className="text-[24px] font-bold leading-tight text-[#131313] sm:text-[30px] lg:text-[34px]">
                    {resultData.resultSummary?.title || "Your Treatment Match"}
                  </h2>
                  <p className="text-[15px] leading-7 text-[#222] sm:text-[17px]">
                    {resultData.resultSummary?.text ||
                      "We analyzed your answers to find the best match for you."}
                  </p>
                  {resultData.assessmentSummary?.overview && (
                    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
                      <p className="text-[12px] uppercase tracking-wide text-[#7a7a7a]">
                        Assessment Overview
                      </p>
                      <p className="mt-2 text-[15px] leading-7 text-[#222]">
                        {resultData.assessmentSummary.overview}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-[11px] uppercase tracking-wide text-[#7a7a7a]">
                      Match
                    </p>
                    <p className="mt-1 text-[18px] font-bold text-[#131313]">
                      {resultData.matchPercentage ?? 0}%
                    </p>
                  </div>
                  <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-[11px] uppercase tracking-wide text-[#7a7a7a]">
                      Avg Score
                    </p>
                    <p className="mt-1 text-[18px] font-bold text-[#131313]">
                      {resultData.averageScore ?? 0}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-[11px] uppercase tracking-wide text-[#7a7a7a]">
                      Total Score
                    </p>
                    <p className="mt-1 text-[18px] font-bold text-[#131313]">
                      {resultData.totalScore ?? 0}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-[11px] uppercase tracking-wide text-[#7a7a7a]">
                      Questions
                    </p>
                    <p className="mt-1 text-[18px] font-bold text-[#131313]">
                      {resultData.totalQuestions ?? 0}
                    </p>
                  </div>
                </div>

                {(resultData.bestMatch || resultData.assessmentSummary?.whyItMatches) && (
                  <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {resultData.bestMatch && (
                      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
                        <p className="text-[12px] uppercase tracking-wide text-[#7a7a7a]">
                          Best Match
                        </p>
                        <p className="mt-2 text-[18px] font-semibold text-[#131313]">
                          {resultData.bestMatch.title || "Recommended Treatment"}
                        </p>
                        <p className="mt-1 text-sm text-[#555]">
                          {resultData.bestMatch.category || "Category"} ·{" "}
                          {resultData.bestMatch.matchPercentage ?? resultData.matchPercentage ?? 0}%
                        </p>
                      </div>
                    )}
                    {resultData.assessmentSummary?.whyItMatches && (
                      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
                        <p className="text-[12px] uppercase tracking-wide text-[#7a7a7a]">
                          Why It Matches
                        </p>
                        <p className="mt-2 text-[15px] leading-7 text-[#222]">
                          {resultData.assessmentSummary.whyItMatches}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {resultData.assessmentSummary?.keyBenefits?.length ? (
                  <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
                    <p className="text-[12px] uppercase tracking-wide text-[#7a7a7a]">
                      Key Benefits
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {resultData.assessmentSummary.keyBenefits.map((benefit, index) => (
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

                {resultData.assessmentSummary?.generatedText && (
                  <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
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
                      {resultData.assessmentSummary.generatedText}
                    </p>
                  </div>
                )}

                {recommendedItems.length > 0 && (
                  <div className="mt-10">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-[20px] font-semibold text-[#131313] sm:text-[22px]">
                        Recommended Products
                      </h3>
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
            </div>
          ) : (
            /* ── Quiz Questions ── */
            <div
              className="relative w-full max-w-[600px] rounded-2xl bg-[#f0f2f5] px-8 py-10 shadow-2xl"
              style={{ maxHeight: "80vh", overflowY: "auto" }}
            >
              <button
                onClick={handleClose}
                className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600 hover:bg-gray-200 hover:text-gray-700 transition-all text-2xl font-semibold shadow-md"
              >
                ×
              </button>

              {/* Progress bar */}
              <div className="my-10">
                <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
                  <span>
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-[#1239e6] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <h2 className="mb-2 text-center text-[20px] font-bold leading-snug text-[#131313] sm:text-[22px]">
                {currentQuestion?.question}
              </h2>
              <p className="mb-8 text-center text-sm text-gray-500">
                Let&apos;s get you back to feeling your best.
              </p>

              <div className="space-y-3">
                {currentQuestion?.options.map((option, i) => {
                  const isSelected = (
                    selectedAnswers[currentQuestion._id] || []
                  ).includes(option);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        handleOptionSelect(currentQuestion._id, option)
                      }
                      disabled={submitMutation.isPending}
                      className="flex w-full items-center gap-4 rounded-xl bg-white px-5 py-4 text-left transition-all"
                      style={{
                        border: isSelected
                          ? "2px solid #1239e6"
                          : "1.5px solid #d1d5db",
                      }}
                    >
                      <div
                        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all"
                        style={{
                          borderColor: isSelected ? "#1239e6" : "#9ca3af",
                          background: "transparent",
                        }}
                      >
                        {isSelected && (
                          <div className="h-3 w-3 rounded-full bg-[#1239e6]" />
                        )}
                      </div>
                      <span className="text-[15px] text-[#222]">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="mt-8 flex gap-3">
                {currentQuestionIndex > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={submitMutation.isPending}
                    className="flex-1 h-[48px] rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isCurrentAnswered || submitMutation.isPending}
                  className="flex-1 h-[48px] rounded-full bg-[#1239e6] text-sm font-medium text-white transition hover:bg-[#0f31c9] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitMutation.isPending
                    ? "Submitting..."
                    : currentQuestionIndex === totalQuestions - 1
                    ? "Submit"
                    : "Next"}
                </button>
              </div>

              {submitError && (
                <p className="mt-4 text-center text-sm text-red-600">
                  {submitError}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
