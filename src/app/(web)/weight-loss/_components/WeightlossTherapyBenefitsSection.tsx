export default function WeightlossTherapyBenefitsSection() {
  return (
    <section className="w-full py-12 sm:py-16 lg:py-20">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-[28px] font-semibold leading-tight text-[#131313] sm:text-[38px] lg:text-[40px]">
            How to Tell If You May Benefit From Weight Loss Treatment
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
              <li>Difficulty losing weight despite diet & exercise</li>
              <li>Constant cravings or overeating</li>
              <li>Low energy or slow metabolism</li>
              <li>Weight gain related to hormones or age</li>
              <li>Frustration with repeated failed attempts</li>
            </ol>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="text-base font-medium text-[#1447ff] sm:text-[20px]">
              Why Medical Weight Loss Works
            </h3>

            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-7 text-[#222] sm:text-[18px]">
              <li>Weight gain is often influenced by hormones and metabolism</li>
              <li>Diet alone doesn’t address underlying biological factors</li>
              <li>Medical guidance increases safety and success rates</li>
            </ul>

            <p className="mt-5 text-sm leading-7 text-[#222] sm:text-[18px]">
              A simple lab test can help determine whether treatment may be right for you.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="text-base font-medium text-[#1447ff] sm:text-[20px]">
              How Weight Loss Treatment Helps
            </h3>

            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-7 text-[#222] sm:text-[18px]">
              <li>Controls appetite and cravings</li>
              <li>Improves metabolic efficiency</li>
              <li>Supports long-term fat loss—not just water weight</li>
            </ul>

            <p className="mt-5 text-sm leading-7 text-[#222] sm:text-[18px]">
              With licensed medical providers, weight loss becomes safer, smarter, and sustainable.
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