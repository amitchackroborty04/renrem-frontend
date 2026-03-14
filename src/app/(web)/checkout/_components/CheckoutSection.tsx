"use client";

import Image from "next/image";

const cartItems = [
  {
    id: 1,
    title: "Lorem ipsum dolor sit amet, consectetur efficitur.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tincidunt porta laoreet. Praesent a leo et leo ornare mollis quis erat. Integer aliquam dapibus justo at dapibus.",
    price: 54,
    image: "/checkout-product.png",
  },
  {
    id: 2,
    title: "Lorem ipsum dolor sit amet, consectetur efficitur.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tincidunt porta laoreet. Praesent a leo et leo ornare mollis quis erat. Integer aliquam dapibus justo at dapibus.",
    price: 54,
    image: "/checkout-product.png",
  },
];

export default function CheckoutSection() {
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
              <FormField label="Full Name" type="text" />
              <FormField label="Email address" type="email" />
              <FormField label="Phone Number" type="text" />
              <FormField label="Country" type="text" />
              <FormField label="Town/City/Region" type="text" />
              <FormField label="Address" type="text" />

              <label className="flex items-center gap-2 text-[12px] text-[#4b4b4b] sm:text-[13px]">
                <input
                  type="checkbox"
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
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[12px] bg-[#F4F6FF] p-3 sm:p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative h-[120px] w-full overflow-hidden rounded-[8px] sm:h-[102px] sm:w-[120px] shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-[18px] font-semibold leading-tight text-[#252525] sm:text-[20px]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[13px] leading-5 text-[#5a5a5a] sm:text-[14px]">
                        {item.description}
                      </p>
                      <p className="mt-3 text-[18px] font-semibold text-[#2a2a2a] sm:text-[20px]">
                        ${item.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 text-[18px] text-[#2a2a2a] sm:text-[20px]">
              <SummaryRow label="Subtotal" value="$108.00" />
              <SummaryRow label="Sales Tax" value="$20.00" />
              <SummaryRow label="Total Item" value="02" />
            </div>

            <div className="my-5 h-px w-full bg-[#c7cdf7]" />

            <div className="flex items-center justify-between text-[22px] font-medium text-[#2a2a2a]">
              <span>Total</span>
              <span>$128.00</span>
            </div>

            <div className="mt-4 rounded-[8px] border border-[#7f7f8f] bg-transparent px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="h-5 w-5 rounded-full border border-[#5b5b5b]" />
                  <span className="text-[16px] font-medium text-[#2a2a2a] sm:text-[18px]">
                    Pay With Stripe
                  </span>
                </div>
                <span className="text-[20px] font-bold text-[#635bff]">
                  stripe
                </span>
              </div>
            </div>

            <button
              type="button"
              className="mt-4 h-[52px] w-full rounded-[8px] bg-[#0024DA] text-[18px] font-semibold text-white transition hover:opacity-90"
            >
              Pay now
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
}: {
  label: string;
  type: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[15px] font-medium text-[#2a2a2a] sm:text-[16px]">
        {label}
      </label>
      <input
        type={type}
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