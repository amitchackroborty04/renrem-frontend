// "use client";
// import { useQuery } from "@tanstack/react-query";
// import Image from "next/image";
// import Link from "next/link";
// import React, { useState } from "react";

// interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   image: string[];
// }

// const VISIBLE = 3;

// const HomeCarusal = () => {
//   const [startIndex, setStartIndex] = useState(0);

//   const { data: productData } = useQuery({
//     queryKey: ["product"],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/product`,
//       );
//       const json = await res.json();
//       if (!res.ok || !json.success)
//         throw new Error(json.message || "Failed to fetch products");
//       return json.data; // 🔹 data is in json.data
//     },
//   });

//   const items = productData || []; // use fetched data or empty array

//   const canPrev = startIndex > 0;
//   const canNext = startIndex + VISIBLE < items.length;

//   const prev = () => {
//     if (canPrev) setStartIndex((i) => i - 1);
//   };

//   const next = () => {
//     if (canNext) setStartIndex((i) => i + 1);
//   };

//   const visible = items.slice(startIndex, startIndex + VISIBLE);

//   return (
//     <section className="py-[80px] container mx-auto">
//       {/* Cards Row */}
//       <div className="grid grid-cols-3 gap-6 mb-6">
//         {visible.map((item: Product) => (
//           <Link href={`/product/${item?._id}`} key={item._id}>
//             <div
//               className="flex flex-col gap-3 cursor-pointer group"
//             >
//               {/* Image Box */}
//               <div className="relative w-full aspect-square rounded-sm overflow-hidden">
//                 <Image
//                   src={item.image[0]} // use first image from API array
//                   alt={item.name}
//                   fill
//                   className="object-cover transition-transform duration-500 group-hover:scale-105"
//                 />
//               </div>

//               {/* Text */}
//               <div>
//                 <h3
//                   className="text-[40px] font-medium text-[#131313] tracking-tight"
                  
//                 >
//                   {item.name}
//                 </h3>
//                 <p className="text-base text-[#AAA8A8] mt-0.5 font-light tracking-wide">
//                   {item.description} {/* or item.subtitle if needed */}
//                 </p>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>

//       {/* Navigation Arrows — bottom right */}
//       <div className="flex justify-end gap-3 mt-2">
//         <button
//           onClick={prev}
//           disabled={!canPrev}
//           className={[
//             "w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200",
//             canPrev
//               ? "border-[#aaa] text-[#333] hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a]"
//               : "border-[#ccc] text-[#ccc] cursor-not-allowed",
//           ].join(" ")}
//         >
//           <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//             <path
//               d="M10 3L5 8L10 13"
//               stroke="currentColor"
//               strokeWidth="1.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </button>

//         <button
//           onClick={next}
//           disabled={!canNext}
//           className={[
//             "w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200",
//             canNext
//               ? "border-[#aaa] text-[#333] hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a]"
//               : "border-[#ccc] text-[#ccc] cursor-not-allowed",
//           ].join(" ")}
//         >
//           <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//             <path
//               d="M6 3L11 8L6 13"
//               stroke="currentColor"
//               strokeWidth="1.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </button>
//       </div>
//     </section>
//   );
// };

// export default HomeCarusal;



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

  // responsive visible items
  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1); // mobile
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2); // tablet
      } else {
        setVisibleCount(3); // desktop
      }
    };

    updateVisible();
    window.addEventListener("resize", updateVisible);

    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const { data: productData } = useQuery({
    queryKey: ["product"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/product`
      );
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

  return (
    <section id="product" className="py-[80px] container mx-auto px-4">
      
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {visible.map((item: Product) => (
          <Link href={`/product/${item._id}`} key={item._id}>
            <div className="flex flex-col gap-3 cursor-pointer group">
              
              {/* Image */}
              <div className="relative w-full aspect-square rounded-sm overflow-hidden">
                <Image
                  src={item.image[0]}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Text */}
              <div>
                <h3 className="text-xl sm:text-2xl lg:text-[40px] font-medium text-[#131313] tracking-tight">
                  {item.name}
                </h3>

                <p className="text-sm sm:text-base text-[#AAA8A8] mt-1 font-light tracking-wide line-clamp-2">
                  {item.description}
                </p>
              </div>

            </div>
          </Link>
        ))}
      </div>

      {/* Arrows */}
      <div className="flex justify-end gap-3 mt-2">
        <button
          onClick={prev}
          disabled={!canPrev}
          className={[
            "w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200",
            canPrev
              ? "border-[#aaa] text-[#333] hover:bg-[#1a1a1a] hover:text-white"
              : "border-[#ccc] text-[#ccc] cursor-not-allowed",
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
          disabled={!canNext}
          className={[
            "w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200",
            canNext
              ? "border-[#aaa] text-[#333] hover:bg-[#1a1a1a] hover:text-white"
              : "border-[#ccc] text-[#ccc] cursor-not-allowed",
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