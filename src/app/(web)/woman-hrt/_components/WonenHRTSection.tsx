const womenHrtPlans = [
  {
    title: "Progesterone Support",
    description:
      "Helps balance estrogen levels while supporting sleep, mood, and menstrual regularity.",
    features: [
      "Improves sleep quality",
      "Supports emotional stability",
      "Helps regulate cycles",
      "Reduces hormonal anxiety",
    ],
  },
  {
    title: "Estrogen Therapy",
    description:
      "A foundational treatment designed to relieve common symptoms of hormonal imbalance and menopause.",
    features: [
      "Reduces hot flashes & night sweats",
      "Improves mood & emotional balance",
      "Supports bone health",
      "Enhances overall well-being",
    ],
  },
  {
    title: "Comprehensive Women’s HRT",
    description:
      "A personalized combination of hormones tailored to your symptoms, lifestyle, and health goals.",
    features: [
      "Full hormone balance approach",
      "Supports energy & metabolism",
      "Improves focus & mental clarity",
      "Long-term wellness support",
    ],
  },
];

export default function WomenHRTSection() {
  return (
    <section className="w-full py-12 sm:py-16 lg:py-20">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-[28px] font-bold uppercase tracking-tight text-[#131313] sm:text-[38px] lg:text-[40px]">
            Woman Hormone Therapy
          </h2>

          <p className="mt-3 text-[12px] font-medium uppercase tracking-wide text-[#0024DA] sm:text-[20px]">
            Sharper focus, drive restored, real momentum
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {womenHrtPlans.map((plan, index) => (
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