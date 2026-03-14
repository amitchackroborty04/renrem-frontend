import Image from "next/image";

export default function ChedkoutHeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[180px] w-full sm:h-[220px] md:h-[260px] lg:h-[500px] ">
        <Image
          src="/checkout.jpg"
          alt="My cart banner"
          fill
          priority
          className="object-center object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#1b2f57]/35" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <h1 className="text-center text-[32px] font-semibold text-white sm:text-[42px] md:text-[52px] lg:text-[58px]">
            Checkout
          </h1>
        </div>
      </div>
    </section>
  );
}