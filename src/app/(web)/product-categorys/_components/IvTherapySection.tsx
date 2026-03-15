/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";

interface TreatmentQuestion {
  _id: string;
  question: string;
  options: string[];
  answare: string;
}

interface Treatment {
  _id: string;
  name: string;
  description: string;
  category: string;
  treatmentQuestions?: TreatmentQuestion[];
}

interface IvTherapySectionProps {
  category?: {
    statusCode: number;
    success: boolean;
    message: string;
    meta: any;
    data: Treatment[];
  } | null;
}

export default function IvTherapySection({ category }: IvTherapySectionProps) {
  const treatments = category?.data || [];

  // ── Quiz state ──────────────────────────────────────────────────────
  const [showQuiz, setShowQuiz] = useState(false);
  const [activeTreatment, setActiveTreatment] = useState<Treatment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const allQuestions: (TreatmentQuestion & { benefitTitle: string })[] =
    (activeTreatment?.treatmentQuestions || []).map((q) => ({
      ...q,
      benefitTitle: activeTreatment?.name || "",
    }));

  const currentQuestion = allQuestions[currentQuestionIndex];
  const totalQuestions = allQuestions.length;
  const progress =
    totalQuestions > 0
      ? Math.round((currentQuestionIndex / totalQuestions) * 100)
      : 0;

  const handleOptionSelect = (questionId: string, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    setShowQuiz(false);
    setActiveTreatment(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsCompleted(false);
  };

  const handleOpenQuiz = (treatment: Treatment) => {
    setActiveTreatment(treatment);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsCompleted(false);
    setShowQuiz(true);
  };

  const isCurrentAnswered = currentQuestion
    ? !!selectedAnswers[currentQuestion._id]
    : false;

  return (
    <>
      <section className="w-full py-12 sm:py-16 lg:py-20">
        <div className="mx-auto container px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center">
            <h2
              className="text-[28px] font-bold uppercase tracking-tight text-[#131313] sm:text-[38px] lg:text-[40px]"
              dangerouslySetInnerHTML={{
                __html: treatments[0]?.category || "",
              }}
            />
            <p className="mt-3 text-[12px] font-medium uppercase tracking-wide text-[#0024DA] sm:text-[20px]">
              Explore our treatments for {treatments[0]?.category || "IV Therapy"}.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {treatments.map((plan) => (
              <div
                key={plan._id}
                className="flex h-full flex-col rounded-[18px] border border-[#C3C3C3] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] sm:p-7"
              >
                <div className="flex-1">
                  <h3
                    className="text-[24px] font-semibold leading-snug text-[#131313] sm:text-[28px] lg:text-[20px] xl:text-[22px]"
                    dangerouslySetInnerHTML={{ __html: plan.name || "" }}
                  />
                  <p
                    className="mt-5 text-sm leading-6 text-[#131313] sm:text-[15px]"
                    dangerouslySetInnerHTML={{ __html: plan.description || "" }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenQuiz(plan)}
                  className="mt-8 inline-flex h-[50px] w-full items-center justify-center rounded-full bg-[#0024DA] px-6 text-base font-medium text-white transition hover:bg-[#0c2fcb] sm:h-[54px]"
                >
                  Customize Your Treatment
                </button>
              </div>
            ))}

            {treatments.length === 0 && (
              <p className="text-center text-gray-500 col-span-full">
                No treatments available for this category.
              </p>
            )}
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
          {isCompleted ? (
            <div className="relative w-full max-w-[820px] rounded-2xl bg-[#f0f2f5] shadow-2xl overflow-hidden">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md text-red-600 hover:text-red-800 transition-all text-2xl font-bold"
              >
                ×
              </button>

              <div className="flex flex-col md:flex-row items-stretch">
                {/* Left — Text */}
                <div className="flex-1 px-10 py-12 md:py-16">
                  <h2 className="mb-5 text-[26px] font-bold leading-tight text-[#131313] sm:text-[30px] lg:text-[34px]">
                    You have low testosterone
                  </h2>
                  <p className="mb-6 text-[17px] font-semibold leading-snug text-[#131313] sm:text-[20px]">
                    You&apos;re not alone. Over 10 million men face low
                    testosterone symptoms.
                  </p>
                  <ul className="space-y-2.5 text-[14px] text-[#444] sm:text-[15px]">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#1239e6] font-bold">•</span>
                      Relief starts with understanding your options.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#1239e6] font-bold">•</span>
                      Start feeling like yourself again in 4-6 weeks or less
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#1239e6] font-bold">•</span>
                      The clinic trusted by over +350,000 men
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#1239e6] font-bold">•</span>
                      Easy &amp; affordable online treatment
                    </li>
                  </ul>

                  <button
                    onClick={handleClose}
                    className="mt-10 inline-flex h-[48px] min-w-[160px] items-center justify-center rounded-full bg-[#1239e6] px-8 text-sm font-medium text-white transition hover:bg-[#0f31c9]"
                  >
                    Get Started
                  </button>
                </div>

                {/* Right — Image */}
                <div className="w-full md:w-[340px] lg:w-[360px] flex-shrink-0">
                  <div className="relative h-[260px] w-full md:h-full">
                    <Image
                      src="/images/teststoron.jpg"
                      alt="Healthcare dashboard"
                      fill
                      className="object-cover rounded-b-2xl md:rounded-b-none md:rounded-r-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ── Quiz Questions ── */
            <div
              className="relative w-full max-w-[600px] rounded-2xl bg-[#f0f2f5] px-8 py-10 shadow-2xl"
              style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
              {/* Close button */}
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

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion?.options.map((option, i) => {
                  const isSelected =
                    selectedAnswers[currentQuestion._id] === option;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        handleOptionSelect(currentQuestion._id, option)
                      }
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
                    className="flex-1 h-[48px] rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isCurrentAnswered}
                  className="flex-1 h-[48px] rounded-full bg-[#1239e6] text-sm font-medium text-white transition hover:bg-[#0f31c9] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {currentQuestionIndex === totalQuestions - 1 ? "Submit" : "Next"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}