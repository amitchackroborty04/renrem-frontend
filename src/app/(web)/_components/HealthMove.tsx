import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const treatmentCards = [
  {
    title: "Erectile\nDisfunction",
    badge: "New",
    image: "/images/health1.jpg",
    hrf : "/product-categorys/Peptides"
  },
  {
    title: "Weight Control",
    badge: null,
    image: "/images/health2.jpg",
    hrf : "/product-categorys/Weight Loss"
  },
];

const quickLinks = [
  { label: "Check your\ninsutance - free", href: "/contact-us" },
  { label: "See how much\nyou could lose", href: "/product-categorys/Weight%20Loss" },
  { label: "Explore all\nmedications", href: "#product" },
];

const steps = [
  {
    num: "1.",
    title: "Select treatment",
    desc: "Choose the treatment that's right for you.",
  },
  {
    num: "2.",
    title: "Review blood work",
    desc: "Submit your lab or order labs with us.",
  },
  {
    num: "3.",
    title: "Meet license provider",
    desc: "1 on 1 personalized care. Discuss your therapy goals.",
  },
  {
    num: "4.",
    title: "Begin treatment",
    desc: "Your medication is delivered discreetly to your door.",
  },
];

export default function HealthMove() {
  return (
    <section className="w-full py-10 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-2">
        {/* Heading */}
        <h1 className="mb-6 text-[28px] font-bold leading-tight tracking-tight text-[#0024DA] sm:mb-8 sm:text-[36px] md:text-[42px] lg:text-[48px]">
          YOUR HEALTH. YOUR MOVE.
        </h1>

        {/* Treatment Cards */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {treatmentCards.map((card) => (
            <div
              key={card.title}
              className="relative h-[280px] overflow-hidden sm:h-[320px] lg:h-[350px]"
            >
              <Image
                width={800}
                height={800}
                src={card.image}
                alt={card.title}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/20" />

              <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-5 lg:p-6">
                <div>
                  <h2 className="whitespace-pre-line text-[22px] font-bold leading-tight text-white drop-shadow sm:text-[24px] lg:text-[28px]">
                    {card.title}
                  </h2>

                  {card.badge && (
                    <span className="mt-3 inline-block rounded-full bg-[#e8f56a] px-4 py-1.5 text-xs font-semibold text-black">
                      {card.badge}
                    </span>
                  )}
                </div>

                <div className="flex justify-end">
                  <a href={card.hrf}>
                    <button className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 sm:px-5 sm:py-2.5 sm:text-base">
                      Start Now
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((link) => (
            <div
              key={link.label}
              className="flex min-h-[140px] items-center justify-between gap-4 bg-[#EEE9E4] px-4 py-5 shadow-sm sm:min-h-[160px] sm:px-5 lg:h-[184px]"
            >
              <span className="whitespace-pre-line text-lg font-medium leading-snug text-[#131313] sm:text-xl lg:text-2xl">
                {link.label}
              </span>
              <Link href={link.href}>
              <button className="flex h-10 w-10 px-8 flex-shrink-0 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-neutral-800">
                <span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
              </Link>
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 mt-[50px]">
          {steps.map((step) => (
            <div
              key={step.num}
              className="flex min-h-[170px] flex-col justify-center bg-[#E3E3E6] px-4 py-5 sm:px-5 lg:h-[194px]"
            >
              <p className="mb-2 text-lg font-semibold text-[#131313] sm:text-xl">
                {step.num} {step.title}
              </p>
              <p className="text-base leading-relaxed text-[#131313] sm:text-lg lg:text-xl">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
