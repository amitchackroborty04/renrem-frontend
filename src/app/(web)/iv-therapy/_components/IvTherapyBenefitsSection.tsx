export default function IvTherapyBenefitsSection() {
  return (
    <section className="w-full py-12 sm:py-16 lg:py-20">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-[28px] font-semibold leading-tight text-[#131313] sm:text-[38px] lg:text-[40px]">
            How to Tell If You May Benefit From IV Therapy
          </h2>
        </div>

        {/* Content */}
        <div className="mt-10 space-y-8 sm:mt-12 sm:space-y-10">
          
          {/* Section 1 */}
          <div>
            <h3 className="text-base font-medium text-[#1447ff] sm:text-[20px]">
              Common Signs of Low Testosterone
            </h3>

            <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm leading-7 text-[#222] sm:text-[18px]">
              <li>Eliminates fatigue</li>
              <li>Power your brain, to aid mental focus and performance</li>
              <li>Help accelerate recovery to sports-related injuries</li>
              <li>Reinforce your immune system and lessen flu symptoms</li>
              <li>Instant absorption rate, which means quick, effective results</li>
              <li>Anti-aging properties hydrate skin to create a beautiful glow</li>
            </ol>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="text-base font-medium text-[#1447ff] sm:text-[20px]">
              Why Testosterone Is Important
            </h3>

            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-7 text-[#222] sm:text-[18px]">
              <li>
                Testosterone levels naturally decline as men age, often beginning in their 30s.
              </li>
              <li>
                Many men don’t notice the change until symptoms start affecting everyday life.
              </li>
              <li>
                Low testosterone is common and nothing to feel uncomfortable about.
              </li>
            </ul>

            <p className="mt-5 text-sm leading-7 text-[#222] sm:text-[18px]">
              A simple lab test can help determine whether treatment may be right for you.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="text-base font-medium text-[#1447ff] sm:text-[20px]">
              Benefits of IV Therapy
            </h3>

            <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm leading-7 text-[#222] sm:text-[18px]">
              <li>Eliminates fatigue</li>
              <li>Power your brain, to aid mental focus and performance</li>
              <li>Help accelerate recovery to sports-related injuries</li>
              <li>Reinforce your immune system and lessen flu symptoms</li>
              <li>Instant absorption rate, which means quick, effective results</li>
              <li>Anti-aging properties hydrate skin to create a beautiful glow</li>
            </ol>
          </div>

          {/* Section 4 */}
          <div>
            <h3 className="text-base font-medium text-[#1447ff] sm:text-[20px]">
              How TRT Can Help
            </h3>

            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-7 text-[#222] sm:text-[18px]">
              <li>
                Testosterone Replacement Therapy helps bring hormone levels back into a healthy range.
              </li>
              <li>
                Many men experience improved energy, mood, and focus within weeks.
              </li>
              <li>
                Increased strength, easier fat management, and improved libido are common benefits.
              </li>
            </ul>
          </div>

          {/* Bottom Text */}
          <p className="text-sm leading-7 text-[#222] sm:text-[18px]">
            When prescribed and monitored by licensed professionals, TRT is a safe and effective way to support long-term health and performance.
          </p>
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