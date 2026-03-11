'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    id: 1,
    question: 'How Was The Magnesium Dosage Determined?',
    answer:
      'The magnesium dosage was carefully determined based on clinical research and recommended daily intake guidelines to ensure optimal absorption and effectiveness.',
  },
  {
    id: 2,
    question: 'Why Were The Ingredients In This Supplement Carefully Selected?',
    answer:
      'Each ingredient was chosen based on scientific evidence supporting its efficacy, safety profile, and synergy with other components in the formula.',
  },
  {
    id: 3,
    question: 'Why Is Copper Included In This Formula?',
    answer:
      'Copper plays a vital role in supporting testosterone production, energy metabolism, and maintaining a healthy immune system, making it a key addition to this formula.',
  },
  {
    id: 4,
    question: 'How Was The Magnesium Dosage Determined?',
    answer:
      'Our team of nutritionists and medical advisors reviewed extensive clinical data to arrive at a dosage that maximizes benefits while remaining safe for daily use.',
  },
  {
    id: 5,
    question: 'How Does This Supplement Compare To Other Testosterone Support Products?',
    answer:
      'Unlike many competitors, this supplement uses only clinically studied ingredients at effective dosages, with no proprietary blends, ensuring full transparency and maximum results.',
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-[#EFEFEF] py-14  container mx-auto mt-10">
      <h2 className="text-[40px] font-extrabold text-[#131313] mb-8">FAQ</h2>

      <div>
        {FAQS.map((faq) => (
          <div key={faq.id}>
            {/* Divider */}
            <div className="h-px bg-gray-300 w-20" />

            <button
              onClick={() => toggle(faq.id)}
              className="w-full flex items-center justify-between py-5 text-left group"
            >
              <span className="text-[20px] sm:text-base text-[#111111] font-normal pr-6">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-8 h-8 text-gray-700 flex-shrink-0 transition-transform duration-300 ${
                  openId === faq.id ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Answer */}
            {openId === faq.id && (
              <p className="pb-5 text-sm text-gray-600 leading-relaxed pr-10">
                {faq.answer}
              </p>
            )}
          </div>
        ))}

        {/* Bottom divider */}
        <div className="h-px bg-gray-300" />
      </div>
    </section>
  );
}