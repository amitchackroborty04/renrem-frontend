'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';

type FaqItem = {
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    question: 'How was the magnesium dosage determined?',
    answer:
      'The dosage is based on published research and commonly used clinical ranges, balancing effectiveness with tolerability for most adults.',
  },
  {
    question: 'Why were the ingredients in this supplement carefully selected?',
    answer:
      'Each ingredient is chosen for evidence-backed benefits and how well it complements the rest of the formula to support your goals.',
  },
  {
    question: 'Why is copper included in this formula?',
    answer:
      'Copper supports key enzymatic processes and helps maintain mineral balance, which can matter when certain nutrients are supplemented.',
  },
  {
    question: 'When should I take it for best results?',
    answer:
      'Many people prefer taking it with a meal to reduce stomach sensitivity. Consistency matters most—take it at the same time daily.',
  },
  {
    question: 'How does this supplement compare to other testosterone support products?',
    answer:
      'This formula focuses on targeted, quality-sourced ingredients and avoids unnecessary fillers—aiming for a cleaner, more intentional blend.',
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      {/* Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content width */}
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              FAQ
            </h2>
          </div>

          {/* FAQ List */}
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-gray-50 sm:px-6 sm:py-5"
                  >
                    <span className="text-sm font-semibold text-gray-900 sm:text-base">
                      {faq.question}
                    </span>

                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-gray-600 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6 sm:py-5">
                      <p className="text-sm leading-6 text-gray-700 sm:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}