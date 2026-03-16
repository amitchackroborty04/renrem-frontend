

"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function UnlockGuideSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Very basic email check
    if (!email || !email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Thank you! Your guide is on the way 🚀");
        setEmail(""); // clear input after success
      } else {
        // Try to show backend message if available
        toast.error(data?.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      toast.error("Network error. Please check your connection.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full px-4 py-8 sm:px-6 sm:py-0 lg:px-0 lg:py-12">
      <div className="relative mx-auto overflow-hidden rounded-[0px] bg-[#90693D] min-h-[420px] sm:min-h-[500px] lg:min-h-[550px]">
        {/* Background image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/bgimage.jpg')",
          }}
        />
        <div className="absolute inset-0 z-10 bg-[#90693D]/80"></div>

        <div className="relative z-20 container mx-auto grid min-h-[420px] grid-cols-1 items-center lg:min-h-[550px] lg:grid-cols-2">
          {/* Left Content */}
          <div className="flex h-full items-center px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            <div className="w-full max-w-[430px]">
              <h2 className="text-[34px] font-semibold leading-[120%] tracking-[-0.05em] text-white sm:text-[44px] lg:text-[56px]">
                Unlock the free guide to protein for weight loss
              </h2>

              <p className="mt-4 max-w-[320px] text-sm leading-6 text-white/95 sm:text-base">
                Written By Board-Certified Doctors To Support Your Journey.
              </p>

              <form className="mt-6 sm:mt-8" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="h-[54px] w-full rounded-[8px] border-0 bg-white px-5 text-base text-black outline-none placeholder:text-[#8b8b8b] disabled:opacity-70"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`
                    mt-4 h-[58px] w-full rounded-full 
                    bg-[#07090f] text-[18px] font-medium text-white 
                    transition hover:opacity-90
                    disabled:opacity-60 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                  `}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      Sending...
                    </>
                  ) : (
                    "Get the guide"
                  )}
                </button>
              </form>

              <p className="mt-5 max-w-[360px] text-[11px] leading-4 text-white/90 sm:text-xs">
                by creating an account using email, I agree to the Terms &
                condition, and acknowledge the Privacy Policy.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative flex h-full items-end justify-center lg:justify-end">
            <div className="relative h-[260px] w-[240px] sm:h-[340px] sm:w-[300px] md:h-[400px] md:w-[350px] lg:absolute lg:bottom-0 lg:right-[8%] lg:h-[550px] lg:w-[550px]">
              <Image
                src="/images/man.png"
                alt="Guide model"
                width={1000}
                height={1000}
                className="object-contain object-bottom h-full w-full"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}