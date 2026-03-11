const peptidePlans = [
  {
    title: "Recovery & Repair Peptides",
    description:
      "Our advanced peptide therapy is designed to accelerate healing, reduce inflammation, and support tissue regeneration for faster recovery and long-term wellness.",
    features: [
      "Supports muscle & joint recovery",
      "Reduces inflammation",
      "Enhances tissue repair",
      "Improves physical resilience",
    ],
  },
  {
    title: "Immune Peptides",
    description:
      "A science-backed peptide solution that supports fat metabolism, appetite regulation, and energy balance—without extreme dieting.",
    features: [
      "Boosts metabolic function",
      "Supports healthy weight loss",
      "Helps regulate appetite",
      "Improves energy levels",
    ],
  },
  {
    title: "Performance & Longevity Peptides",
    description:
      "A comprehensive peptide protocol formulated to support peak performance, physical resilience, mental clarity, and long-term cellular health.",
    features: [
      "Supports strength, stamina, and muscle performance",
      "Aids recovery and physical endurance",
      "Enhances focus, cognition, and mental clarity",
      "Promotes healthy aging and longevity",
    ],
  },
];

export default function PeptideTherapySection() {
  return (
    <section className="w-full  py-12 sm:py-16 lg:py-20">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-[28px] font-bold uppercase tracking-tight text-[#131313] sm:text-[38px] lg:text-[40px]">
            Peptide Therapy
          </h2>

          <p className="mt-3 text-[12px] font-medium uppercase tracking-wide text-[#0024DA] sm:text-[20px]">
            Targeted healing. Smarter recovery. Real results.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {peptidePlans.map((plan, index) => (
            <div
              key={index}
              className="flex h-full flex-col rounded-[18px] border border-[#C3C3C3] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] sm:p-7"
            >
              <div className="flex-1">
                <h3 className="text-[24px] font-semibold leading-snug text-[#131313] sm:text-[28px] lg:text-[20px] xl:text-[22px]">
                  {plan.title}
                </h3>

                <p className="mt-5 text-sm leading-6 text-[#131313] sm:text-[15px]">
                  {plan.description}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-2 text-sm leading-6 text-[#2f2f2f] sm:text-[15px]"
                    >
                      <span className="mt-[2px] text-[#131313]">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className="mt-8 inline-flex h-[50px] w-full items-center justify-center rounded-full bg-[#0024DA] px-6 text-base font-medium text-white transition hover:bg-[#0c2fcb] sm:h-[54px]"
              >
                Customize Your Treatment
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}