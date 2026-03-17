"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  image: string[];
}

const HomeCarusal = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  // Responsive visible items
  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const { data: productData, isLoading } = useQuery({
    queryKey: ["product"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/product`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to fetch products");
      }

      return json.data;
    },
  });

  const items = productData || [];

  const canPrev = startIndex > 0;
  const canNext = startIndex + visibleCount < items.length;

  const prev = () => {
    if (canPrev) setStartIndex((i) => i - 1);
  };

  const next = () => {
    if (canNext) setStartIndex((i) => i + 1);
  };

  const visible = items.slice(startIndex, startIndex + visibleCount);

  // Skeleton card component
  const SkeletonCard = () => (
    <div className="flex flex-col gap-3">
      {/* Image skeleton */}
      <div className="relative w-full aspect-square rounded-sm overflow-hidden bg-gray-200 animate-pulse" />

      {/* Text skeleton */}
      <div className="space-y-2">
        <div className="h-8 sm:h-10 lg:h-11 w-4/5 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 sm:h-5 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-4 sm:h-5 w-5/6 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );

  return (
    <section id="product" className="py-[80px] container mx-auto px-4">
      {/* Cards / Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {isLoading
          ? // Show as many skeletons as visible items
            Array.from({ length: visibleCount }).map((_, i) => (
              <div key={`skeleton-${i}`}>
                <SkeletonCard />
              </div>
            ))
          : visible.map((item: Product) => (
              <Link href={`/product/${item._id}`} key={item._id}>
                <div className="flex flex-col gap-3 cursor-pointer group">
                  {/* Real image */}
                  <div className="relative w-full aspect-square rounded-sm overflow-hidden">
                    <Image
                      src={item.image[0]}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={startIndex <= 3} // optional: load first few eagerly
                    />
                  </div>

                  {/* Real text */}
                  <div>
                    <h3 className="text-xl sm:text-2xl lg:text-[40px] font-medium text-[#131313] tracking-tight">
                      {item.name}
                    </h3>
                    <p className="text-sm sm:text-base text-[#AAA8A8]  font-light tracking-wide line-clamp-1 mt-5">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-end gap-3 mt-2">
        <button
          onClick={prev}
          disabled={!canPrev || isLoading}
          className={[
            "w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200",
            canPrev && !isLoading
              ? "border-[#aaa] text-[#333] hover:bg-[#1a1a1a] hover:text-white"
              : "border-[#ccc] text-[#ccc] cursor-not-allowed opacity-50",
          ].join(" ")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path
              d="M10 3L5 8L10 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          onClick={next}
          disabled={!canNext || isLoading}
          className={[
            "w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200",
            canNext && !isLoading
              ? "border-[#aaa] text-[#333] hover:bg-[#1a1a1a] hover:text-white"
              : "border-[#ccc] text-[#ccc] cursor-not-allowed opacity-50",
          ].join(" ")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path
              d="M6 3L11 8L6 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default HomeCarusal;