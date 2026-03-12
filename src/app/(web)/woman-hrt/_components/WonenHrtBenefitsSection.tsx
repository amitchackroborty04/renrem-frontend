export default function WomenHrtBenefitsSection() {
  return (
    <section className="w-full py-12 sm:py-16 lg:py-20">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-[28px] font-semibold leading-tight text-[#131313] sm:text-[38px] lg:text-[40px]">
            How to Tell If You May Benefit From Women’s HRT
          </h2>
        </div>

        {/* Content */}
        <div className="mt-10 space-y-8 sm:mt-12 sm:space-y-10">

          {/* Section 1 */}
          <div>
            <h3 className="text-base font-medium text-[#1447ff] sm:text-[20px]">
              Common Symptoms
            </h3>

            <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm leading-7 text-[#222] sm:text-[18px]">
              <li>Hot flashes or night sweats</li>
              <li>Fatigue or low energy</li>
              <li>Mood swings or irritability</li>
              <li>Poor sleep or insomnia</li>
              <li>Weight gain or slowed metabolism</li>
            </ol>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="text-base font-medium text-[#1447ff] sm:text-[20px]">
              Why Hormone Balance Matters
            </h3>

            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-7 text-[#222] sm:text-[18px]">
              <li>Hormone levels naturally change with age and life stages</li>
              <li>Imbalances can affect mood, energy, and overall health</li>
              <li>Many symptoms are often dismissed or misunderstood</li>
            </ul>

            <p className="mt-5 text-sm leading-7 text-[#222] sm:text-[18px]">
              A simple lab test can help determine if HRT is right for you.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="text-base font-medium text-[#1447ff] sm:text-[20px]">
              How Women’s HRT Helps
            </h3>

            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-7 text-[#222] sm:text-[18px]">
              <li>Restores hormones to healthy levels</li>
              <li>Improves mood, sleep, and energy</li>
              <li>Supports long-term bone and heart health</li>
            </ul>

            <p className="mt-5 text-sm leading-7 text-[#222] sm:text-[18px]">
              When guided by licensed providers, HRT is a safe and effective way to feel balanced and confident again.
            </p>
          </div>

        </div>

        {/* Button */}
        <div className="mt-10 flex justify-center sm:mt-14">
          <button
            type="button"
            className="inline-flex h-[48px] min-w-[220px] items-center justify-center rounded-full bg-[#1239e6] px-8 text-sm font-medium text-white transition hover:bg-[#0f31c9] sm:h-[54px] sm:min-w-[260px]"
          >
            Customize Your Treatment
          </button>
        </div>

      </div>
    </section>
  );
}