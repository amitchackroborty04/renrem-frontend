"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// ─────── Types────────────────────

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string[];
}

interface CartItemFromApi {
  _id: string;
  product: Product;
  quantity: number;
}

interface CartResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    items: CartItemFromApi[];
    totalItems: number;
  };
}

type CartItem = {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
};

// ──────────Fetch function using native fetch───────────────────

const fetchCart = async (token?: string): Promise<CartItem[]> => {
  if (!token) {
    return [];
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/addtocart`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",                 
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch cart";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // fallback if not JSON
    }
    throw new Error(`${errorMessage} (${response.status})`);
  }

  const data: CartResponse = await response.json();

  if (!data.success || !data.data?.items) {
    throw new Error(data.message || "Invalid cart response");
  }

  // Transform API shape → component shape
  return data.data.items.map((item) => ({
    id: item?._id,
    productId: item?.product?._id,
    name: item?.product?.name,
    description: item?.product?.description,
    price: item?.product?.price,
    quantity: item?.quantity,
    image: item?.product?.image[0] || "/images/placeholder.jpg",
  }));
};

// ──────Skeleton (same as before)─────────────────────

function CartItemSkeleton() {
  return (
    <div className="rounded-[14px] bg-[#EAEEFF] p-3 sm:p-4 animate-pulse">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="h-[180px] w-full rounded-[10px] bg-gray-200 sm:h-[122px] sm:w-[126px] md:w-[140px]" />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="h-7 w-3/5 rounded bg-gray-200" />
          <div className="mt-2 h-10 w-full max-w-[520px] rounded bg-gray-200" />
          <div className="mt-3 h-8 w-24 rounded bg-gray-200" />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-10 w-32 rounded bg-gray-200" />
            <div className="h-11 w-11 rounded-[8px] bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────Main Component──────────────────────────────

export default function CartSection() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const {
    data: cartItems = [],
    isLoading,
    error,
  } = useQuery<CartItem[]>({
    queryKey: ["cart"],
    queryFn: () => fetchCart(token),
    enabled: Boolean(token),
    staleTime: 2 * 60 * 1000, 
    gcTime: 5 * 60 * 1000,
  });

  const [localItems, setLocalItems] = useState<CartItem[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<CartItem | null>(null);

  useEffect(() => {
    setLocalItems(Array.isArray(cartItems) ? cartItems : []);
  }, [cartItems]);

  const handleIncrease = (id: string) => {
    setLocalItems((items) =>
      Array.isArray(items)
        ? items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : []
    );
  };

  const handleDecrease = (id: string) => {
    setLocalItems((items) =>
      Array.isArray(items)
        ? items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(1, item.quantity - 1) }
              : item
          )
        : []
    );
  };

  const deleteMutation = useMutation({
    mutationFn: async (item: CartItem) => {
      if (!token) {
        throw new Error("You must be signed in to remove items.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/addtocart/${item.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to delete item";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // fallback if not JSON
        }
        throw new Error(`${errorMessage} (${response.status})`);
      }

      return response.json().catch(() => ({}));
    },
    onSuccess: (_data, item) => {
      setLocalItems((items) =>
        Array.isArray(items)
          ? items.filter((cartItem) => cartItem.id !== item.id)
          : []
      );
      setDeleteTarget(null);
      toast.success("Item removed from cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to remove item", {
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget);
  };

  const safeItems = Array.isArray(localItems) ? localItems : [];

  const subtotal = useMemo(() => {
    return safeItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [safeItems]);

  const total = subtotal;

  const totalItems = useMemo(() => {
    return safeItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [safeItems]);

  const handleCheckout = () => {
    if (typeof window === "undefined") return;
    const payload = {
      items: safeItems,
      subtotal,
      total,
      totalItems,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem("checkoutCart", JSON.stringify(payload));
  };

  if (error) {
    return (
      <div className="rounded-[14px] bg-red-50 p-8 text-center text-red-700">
        {error instanceof Error ? error.message : "Failed to load cart"}
      </div>
    );
  }

  return (
    <section className="w-full bg-[#f5f5f5] py-10 sm:py-14 lg:py-16">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr] lg:items-start lg:gap-6 xl:gap-8">
          {/* Left – Cart Items */}
          <div>
            <h2 className="text-[28px] font-semibold text-[#212121] sm:text-[32px]">
              Cart Items
            </h2>

            <div className="mt-6 space-y-4 sm:space-y-5">
              {isLoading ? (
                <>
                  <CartItemSkeleton />
                  <CartItemSkeleton />
                </>
              ) : safeItems.length > 0 ? (
                safeItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[14px] bg-[#EAEEFF] p-3 sm:p-4"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="relative h-[180px] w-full overflow-hidden rounded-[10px] sm:h-[122px] sm:w-[126px] md:w-[140px]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 140px"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <h3 className="text-[22px] font-semibold text-[#1f1f1f] sm:text-[24px] lg:text-[20px]">
                          {item.name}
                        </h3>

                        <p className="mt-2 max-w-[520px] text-sm leading-6 text-[#6a6a6a] sm:text-[15px]">
                          {item.description}
                        </p>

                        <p className="mt-3 text-[28px] font-medium text-[#1f1f1f] sm:text-[32px] lg:text-[24px]">
                          ${item?.price?.toFixed(2)}
                        </p>

                        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="inline-flex w-fit items-center rounded-[6px] bg-white p-1 shadow-sm">
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#cfcfcf] text-[#1f1f1f] transition hover:bg-[#f8f8f8]"
                              aria-label="Decrease quantity"
                              onClick={() => handleDecrease(item.id)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>

                            <div className="mx-2 flex h-8 min-w-[42px] items-center justify-center rounded-[4px] bg-[#1f1f1f] px-3 text-sm font-medium text-white">
                              {item.quantity}
                            </div>

                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#cfcfcf] text-[#1f1f1f] transition hover:bg-[#f8f8f8]"
                              aria-label="Increase quantity"
                              onClick={() => handleIncrease(item.id)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            type="button"
                            className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-white text-[#1f1f1f] transition hover:bg-[#f8f8f8]"
                            aria-label="Remove item"
                            onClick={() => setDeleteTarget(item)}
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

          {/* Right – Summary */}
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

              <Link href="/checkout">
                <button
                  type="button"
                  className="mt-6 inline-flex h-[48px] w-full items-center justify-center rounded-[8px] bg-[#0024DA] px-6 text-base font-medium text-white transition hover:bg-[#0f31c9]"
                  disabled={safeItems.length === 0 || isLoading}
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {deleteTarget && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_18px_48px_rgba(0,0,0,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-lg font-semibold text-[#131313]">
                Remove item?
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Are you sure you want to remove{" "}
                <span className="font-medium text-gray-700">
                  {deleteTarget.name}
                </span>{" "}
                from your cart?
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[#131313] hover:bg-gray-50 sm:w-auto"
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full rounded-xl bg-red-600 px-4 py-3 text-white hover:bg-red-700 sm:w-auto"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
