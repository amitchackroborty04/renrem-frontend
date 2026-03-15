"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// ─── Cart Types ───────────────────────────────────────────────────────────────
interface CartItem {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
  totalItems: number;
  savedAt: string;
}

// ─── Helper: Save to localStorage ────────────────────────────────────────────
function saveToCheckoutCart(newItem: CartItem) {
  const subtotal = newItem.price * newItem.quantity;
  const cart: Cart = {
    items: [newItem],
    subtotal: parseFloat(subtotal.toFixed(2)),
    total: parseFloat(subtotal.toFixed(2)),
    totalItems: newItem.quantity,
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem("checkoutCart", JSON.stringify(cart));
}

function ProductsDetails() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const queryClient = useQueryClient();

  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? (singleProductData?.image?.length || 1) - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev === (singleProductData?.image?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  // ─── Fetch Single Product ─────────────────────────────────────────────
  const { data: singleProductData } = useQuery({
    queryKey: ["singleProduct", productId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/product/${productId}`
      );
      if (!res.ok) throw new Error("Failed to fetch product details");
      const result = await res.json();
      return result?.data;
    },
  });

  // Set default selected size when data loads
  React.useEffect(() => {
    if (singleProductData?.size?.length && !selectedSize) {
      setSelectedSize(singleProductData.size[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleProductData]);

  // ─── Buy Now Handler ──────────────────────────────────────────────────
  const handleBuyNow = () => {
    if (!singleProductData) return;
    if (singleProductData?.size?.length && !selectedSize) {
      toast.error("Please select a size first.");
      return;
    }

    const cartItem: CartItem = {
      id: crypto.randomUUID(),           // unique cart entry id
      productId: singleProductData._id,
      name: singleProductData.name,
      description: singleProductData.description || "",
      price: singleProductData.price,
      image: singleProductData.image?.[0] || "",
      size: selectedSize,
      quantity: 1,
    };

    saveToCheckoutCart(cartItem);
    router.push("/checkout");
  };

  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken; 


 const addToCartMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/addtocart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({
          productId: singleProductData?._id,
          quantity: 1,
        }),
      });
      if (!res.ok) throw new Error("Failed to add to cart");
      return res.json();
    },
    onSuccess : () => {
      toast.success('Add to cart Successfully!');
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });
    },

    onError : (err) => {
      toast.error(err?.message);
    } 
  });

  return (
    <div className="w-[80%] mx-auto">
      {/* Main Content */}
      <div className="px-5 py-5">
        {/* Product Top Section */}
        <div className="p-4 mb-5">
          <div className="flex gap-4">
            {/* Thumbnail Column */}
            <div className="flex flex-col gap-2">
              {singleProductData?.image?.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-[120px] h-[58px] rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeIndex === i
                      ? "border-blue-500"
                      : "border-gray-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    width={500}
                    height={300}
                    src={img}
                    alt={`thumb-${i}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image with arrows */}
            <div
              className="relative flex-shrink-0 rounded-xl overflow-hidden"
              style={{ width: "450px", height: "450px" }}
            >
              <Image
                width={300}
                height={300}
                src={
                  singleProductData?.image?.[activeIndex] ||
                  "/images/carusal1.png"
                }
                alt="product"
                className="w-full h-full object-cover"
              />
              <button
                onClick={handlePrev}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft size={14} className="text-gray-700" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight size={14} className="text-gray-700" />
              </button>
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h2 className="lg:text-[40px] md:text-[35px] text-[30px] font-bold text-[#212121] mb-2">
                {singleProductData?.name}
              </h2>
              <p className="text-[20px] text-[#4E4E4E] leading-[150%] mb-3">
                {singleProductData?.description}
              </p>
              <p className="text-[20px] text-black mb-[20px] font-normal">
                {singleProductData?.category || "Men HRT"}
              </p>

              {/* ── Size Selector ── */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[20px] text-black font-normal">Size:</span>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-[140px] text-[16px] text-gray-700 border-gray-300">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {singleProductData?.size?.map((s: string, i: number) => (
                      <SelectItem key={i} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <p className="lg:text-[40px] md:text-[35px] text-[30px] font-bold text-gray-900 mb-6">
                ${singleProductData?.price}
              </p>

              {/* ── Buy now & Add to Cart Buttons ── */}
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[18px] font-semibold rounded-lg transition-colors"
                >
                  Buy now
                </button>
                <button   onClick={() => addToCartMutation.mutate()} className="flex-1 py-2 bg-white hover:bg-gray-50 text-gray-800 text-[18px] font-semibold rounded-lg border border-gray-300 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* What will you get */}
        <div className="" style={{ borderColor: "#93c5fd" }}>
          <h3 className="lg:text-[40px] md:text-[35px] text-[30px] font-bold text-[#212121] mb-2">
            What will you get?
          </h3>
          <p className="text-[20px] text-[#4E4E4E] leading-[150%] mb-3">
            {singleProductData?.whatWillYouGet}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductsDetails;
