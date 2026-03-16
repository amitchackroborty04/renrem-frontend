/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

type CheckoutItem = {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
};

type CheckoutCart = {
  items: CheckoutItem[];
  subtotal: number;
  total: number;
  totalItems: number;
  savedAt: string;
};

type CheckoutPayload = {
  items: Array<{
    productId: string;
    qty: number;
    size: string;
  }>;
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  city: string;
  address: string;
};

type CheckoutResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: {
    url?: string;
    sessionId?: string;
  };
};

const SHIPPING_STORAGE_KEY = "checkoutShipping";

export default function CheckoutSection() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const [checkoutCart, setCheckoutCart] = useState<CheckoutCart | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<"stripe" | null>(null);
  const [saveInfo, setSaveInfo] = useState(false);
  const [savedShipping, setSavedShipping] = useState<{
    fullName: string;
    email: string;
    phoneNumber: string;
    country: string;
    city: string;
    address: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    country: "",
    city: "",
    address: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("checkoutCart");
    if (!stored) return;
    try {
      const parsed: CheckoutCart = JSON.parse(stored);
      setCheckoutCart(parsed);
    } catch {
      // Ignore invalid storage data
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(SHIPPING_STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      setSavedShipping(parsed);
    } catch {
      // Ignore invalid storage data
    }
  }, []);

  const items = checkoutCart?.items ?? [];

  const computedSubtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const subtotal = checkoutCart?.subtotal ?? computedSubtotal;
  const totalItems =
    checkoutCart?.totalItems ??
    items.reduce((sum, item) => sum + item.quantity, 0);
  const total = checkoutCart?.total ?? subtotal;

  const paymentMutation = useMutation({
    mutationFn: async (payload: CheckoutPayload) => {
      if (!token) {
        throw new Error("Please sign in to continue.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to start payment";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // fallback if not JSON
        }
        throw new Error(`${errorMessage} (${response.status})`);
      }

      return (await response.json()) as CheckoutResponse;
    },
    onSuccess: (data) => {
      if (data?.success && data?.data?.url) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("checkoutCart");
          window.location.href = data.data.url;
        }
        return;
      }

      toast.error("Payment failed", {
        description: data?.message || "Missing checkout URL.",
      });
    },
    onError: (error: Error) => {
      toast.error("Payment failed", {
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  const handleInputChange =
    (field: keyof typeof formData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleSaveInfoToggle = (checked: boolean) => {
    setSaveInfo(checked);
    if (typeof window === "undefined") return;
    if (checked) {
      if (savedShipping) {
        setFormData(savedShipping);
        localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(savedShipping));
      } else {
        localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(formData));
      }
    }
  };

  useEffect(() => {
    if (!saveInfo) return;
    if (typeof window === "undefined") return;
    localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(formData));
  }, [saveInfo, formData]);

  const handlePayNow = () => {
    if (!selectedPayment) {
      toast.error("Please select a payment method.");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const requiredFields: Array<keyof typeof formData> = [
      "fullName",
      "email",
      "phoneNumber",
      "country",
      "city",
      "address",
    ];

    const hasMissing = requiredFields.some(
      (field) => !formData[field].trim()
    );
    if (hasMissing) {
      toast.error("Please fill in all shipping fields.");
      return;
    }

    const payload: CheckoutPayload = {
      items: items.map((item) => ({
        productId: item.productId,
        qty: item.quantity,
        size: item.size ?? "large",
      })),
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      country: formData.country.trim(),
      city: formData.city.trim(),
      address: formData.address.trim(),
    };

    paymentMutation.mutate(payload);
  };

  return (
    <section className="w-full py-10 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] xl:gap-10">
          {/* Left Side */}
          <div className="rounded-[12px] bg-[#F4F6FF] p-4 sm:p-6 lg:p-8">
            <h2 className="text-[28px] font-bold leading-tight text-[#1f1f1f] sm:text-[34px]">
              Shipping information
            </h2>

            <form className="mt-6 space-y-5">
              <FormField
                label="Full Name"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange("fullName")}
              />
              <FormField
                label="Email address"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
              />
              <FormField
                label="Phone Number"
                type="text"
                value={formData.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
              />
              <FormField
                label="Country"
                type="text"
                value={formData.country}
                onChange={handleInputChange("country")}
              />
              <FormField
                label="Town/City/Region"
                type="text"
                value={formData.city}
                onChange={handleInputChange("city")}
              />
              <FormField
                label="Address"
                type="text"
                value={formData.address}
                onChange={handleInputChange("address")}
              />

              <label className="flex items-center gap-2 text-[12px] text-[#4b4b4b] sm:text-[13px]">
                <input
                  type="checkbox"
                  checked={saveInfo}
                  onChange={(event) => handleSaveInfoToggle(event.target.checked)}
                  className="h-4 w-4 rounded border border-[#8f8f8f]"
                />
                Save this information for faster check-out next time
              </label>
            </form>
          </div>

          {/* Right Side */}
          <div className="rounded-[12px] bg-[#ececf4] p-4 sm:p-6">
            <h2 className="text-[28px] font-bold leading-tight text-[#1f1f1f] sm:text-[34px]">
              Review your cart
            </h2>

            <div className="mt-5 space-y-4">
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[12px] bg-[#F4F6FF] p-3 sm:p-4"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="relative h-[120px] w-full overflow-hidden rounded-[8px] sm:h-[102px] sm:w-[120px] shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-[18px] font-semibold leading-tight text-[#252525] sm:text-[20px]">
                          {item.name}
                        </h3>
                        <p className="mt-2 text-[13px] leading-5 text-[#5a5a5a] sm:text-[14px]">
                          {item.description}
                        </p>
                        <p className="mt-2 text-[13px] text-[#5a5a5a] sm:text-[14px]">
                          Qty: {item.quantity}
                        </p>
                        <p className="mt-3 text-[18px] font-semibold text-[#2a2a2a] sm:text-[20px]">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className="rounded-[12px] bg-[#F4F6FF] p-4 text-center text-[#5a5a5a]"
                >
                  Your cart is empty.
                </div>
              )}
            </div>

            <div className="mt-5 space-y-3 text-[18px] text-[#2a2a2a] sm:text-[20px]">
              <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <SummaryRow
                label="Total Item"
                value={String(totalItems).padStart(2, "0")}
              />
            </div>

            <div className="my-5 h-px w-full bg-[#c7cdf7]" />

            <div className="flex items-center justify-between text-[22px] font-medium text-[#2a2a2a]">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="mt-4 rounded-[8px] border border-[#7f7f8f] bg-transparent px-4 py-3">
              <label className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment-method"
                    value="stripe"
                    checked={selectedPayment === "stripe"}
                    onChange={() => setSelectedPayment("stripe")}
                    className="h-5 w-5 accent-[#635bff]"
                  />
                  <span className="text-[16px] font-medium text-[#2a2a2a] sm:text-[18px]">
                    Pay With Stripe
                  </span>
                </span>
                <span className="text-[20px] font-bold text-[#635bff]">
                  stripe
                </span>
              </label>
            </div>

            <button
              type="button"
              className="mt-4 h-[52px] w-full rounded-[8px] bg-[#0024DA] text-[18px] font-semibold text-white transition hover:opacity-90"
              onClick={handlePayNow}
              disabled={!selectedPayment || items.length === 0 || paymentMutation.isPending}
            >
              {paymentMutation.isPending ? "Processing..." : "Pay now"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({
  label,
  type,
  value,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[15px] font-medium text-[#2a2a2a] sm:text-[16px]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[52px] w-full rounded-[8px] border border-[#8a8a8a] bg-transparent px-4 text-[15px] outline-none"
      />
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
