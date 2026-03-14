/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

interface Treatment {
  _id: string;
  name: string;
  description: string;
  category: string;
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

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-[28px] font-bold uppercase tracking-tight text-[#131313] sm:text-[38px] lg:text-[40px]">
            {treatments[0]?.category}
          </h2>

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
                <h3 className="text-[24px] font-semibold leading-snug text-[#131313] sm:text-[28px] lg:text-[20px] xl:text-[22px]">
                  {plan.name}
                </h3>

                <p className="mt-5 text-sm leading-6 text-[#131313] sm:text-[15px]">
                  {plan.description}
                </p>
              </div>

              <button
                type="button"
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
  );
}