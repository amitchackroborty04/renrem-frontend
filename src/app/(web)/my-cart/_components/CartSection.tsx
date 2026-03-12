"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
};

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: "NAD+",
    description:
      "NAD+ (Nicotinamide Adenine Dinucleotide) is a vital coenzyme naturally found in the body and involved in key cellular processes.",
    price: 54,
    quantity: 1,
    image: "/images/cart-item-1.jpg",
  },
  {
    id: 2,
    name: "NAD+",
    description:
      "NAD+ (Nicotinamide Adenine Dinucleotide) is a vital coenzyme naturally found in the body and involved in key cellular processes.",
    price: 54,
    quantity: 1,
    image: "/images/cart-item-1.jpg",
  },
];

export default function CartSection() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const updateQuantity = (id: number, type: "increment" | "decrement") => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (type === "increment") {
          return { ...item, quantity: item.quantity + 1 };
        }

        return { ...item, quantity: Math.max(1, item.quantity - 1) };
      })
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const salesTax = useMemo(() => {
    return 20;
  }, []);

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const total = subtotal + salesTax;

  return (
    <section className="w-full bg-[#f5f5f5] py-10 sm:py-14 lg:py-16">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr] lg:items-start lg:gap-6 xl:gap-8">
          {/* Left */}
          <div>
            <h2 className="text-[28px] font-semibold text-[#212121] sm:text-[32px]">
              Cart Items
            </h2>

            <div className="mt-6 space-y-4 sm:space-y-5">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[14px] bg-[#EAEEFF] p-3 sm:p-4"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      {/* Image */}
                      <div className="relative h-[180px] w-full overflow-hidden rounded-[10px] sm:h-[122px] sm:w-[126px] md:w-[140px]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <h3 className="text-[22px] font-semibold text-[#1f1f1f] sm:text-[24px] lg:text-[20px]">
                          {item.name}
                        </h3>

                        <p className="mt-2 max-w-[520px] text-sm leading-6 text-[#6a6a6a] sm:text-[15px]">
                          {item.description}
                        </p>

                        <p className="mt-3 text-[28px] font-medium text-[#1f1f1f] sm:text-[32px] lg:text-[24px]">
                          ${item.price}
                        </p>

                        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          {/* Quantity */}
                          <div className="inline-flex w-fit items-center rounded-[6px] bg-white p-1 shadow-sm">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, "decrement")}
                              className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#cfcfcf] text-[#1f1f1f] transition hover:bg-[#f8f8f8]"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4" />
                            </button>

                            <div className="mx-2 flex h-8 min-w-[42px] items-center justify-center rounded-[4px] bg-[#1f1f1f] px-3 text-sm font-medium text-white">
                              {item.quantity}
                            </div>

                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, "increment")}
                              className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#cfcfcf] text-[#1f1f1f] transition hover:bg-[#f8f8f8]"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-white text-[#1f1f1f] transition hover:bg-[#f8f8f8]"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[14px] bg-white p-8 text-center text-[#6a6a6a] shadow-sm">
                  Your cart is empty.
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div>
            <h2 className="text-[28px] font-semibold text-[#212121] sm:text-[32px]">
              Cart Total
            </h2>

            <div className="mt-6 rounded-[14px] bg-[#eef2ff] p-4 sm:p-5 lg:p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[20px] text-[#2b2b2b] sm:text-[22px]">
                    Subtotal
                  </span>
                  <span className="text-[20px] font-medium text-[#2b2b2b] sm:text-[22px]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[20px] text-[#2b2b2b] sm:text-[22px]">
                    Sales Tax
                  </span>
                  <span className="text-[20px] font-medium text-[#2b2b2b] sm:text-[22px]">
                    ${salesTax.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[20px] text-[#2b2b2b] sm:text-[22px]">
                    Total Item
                  </span>
                  <span className="text-[20px] font-medium text-[#2b2b2b] sm:text-[22px]">
                    {String(totalItems).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div className="my-8 h-px w-full bg-[#e0cfd7]" />

              <div className="flex items-center justify-between gap-4">
                <span className="text-[22px] font-medium text-[#2b2b2b] sm:text-[24px]">
                  Total
                </span>
                <span className="text-[22px] font-medium text-[#2b2b2b] sm:text-[24px]">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                className="mt-6 inline-flex h-[48px] w-full items-center justify-center rounded-[8px] bg-[#0024DA] px-6 text-base font-medium text-white transition hover:bg-[#0f31c9] "
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}