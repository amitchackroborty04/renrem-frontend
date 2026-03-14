

'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

// ── Schema ────────────────────────────────────────────────
const formSchema = z.object({
  name: z.string().min(2, 'Name is too short').max(100),
  email: z.string().email('Please enter a valid email'),
  phoneNumber: z.string().min(8, 'Phone number is too short').max(20),
  message: z.string().min(10, 'Message is too short').max(2000),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the privacy policy',
  }),
});

type FormValues = z.infer<typeof formSchema>;

// ── API function ─────────────────────────────────────────
const submitContactForm = async (data: Omit<FormValues, 'consent'>) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      message: data.message,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to send message');
  }

  return response.json();
};

export default function GetInTouchSection() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      message: '',
      consent: false,
    },
  });

  const mutation = useMutation({
    mutationFn: submitContactForm,
    onSuccess: () => {
      toast.success('Message sent successfully!', {
        description: "We'll get back to you within 24 hours.",
      });
      reset();
    },
    onError: (error: Error) => {
      toast.error('Failed to send message', {
        description: error.message || 'Something went wrong. Please try again.',
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { consent, ...formData } = data;
    mutation.mutate(formData);
  };

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <h2 className="text-[32px] font-semibold leading-tight text-[#2d4778] sm:text-[40px]">
            Get in <span className="text-[#1c46ff]">Touch</span>
          </h2>
          <p className="mt-3 text-sm text-[#8f8f8f] sm:text-[15px]">
            Fill out the form below and we&apos;ll respond within 24 hours
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          {/* Left - Form */}
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5 sm:mt-10">
              {/* Name */}
              <div>
                <label htmlFor="name" className="mb-2 block text-base font-medium text-[#2F2F2F]">
                  Name
                </label>
                <input
                  id="name"
                  {...register('name')}
                  placeholder="Name Here"
                  className={`h-[52px] w-full rounded-md border bg-transparent px-4 text-[15px] text-[#333] outline-none transition placeholder:text-[#9d9d9d] focus:border-[#1c46ff] ${
                    errors.name ? 'border-red-500' : 'border-[#C0C3C1]'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 block text-base font-medium text-[#2F2F2F]">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="hello@example.com"
                  className={`h-[52px] w-full rounded-md border bg-transparent px-4 text-[15px] text-[#333] outline-none transition placeholder:text-[#9d9d9d] focus:border-[#1c46ff] ${
                    errors.email ? 'border-red-500' : 'border-[#C0C3C1]'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="mb-2 block text-base font-medium text-[#2F2F2F]">
                  Phone Number
                </label>
                <input
                  id="phone"
                  {...register('phoneNumber')}
                  placeholder="+1234567890"
                  className={`h-[52px] w-full rounded-md border bg-transparent px-4 text-[15px] text-[#333] outline-none transition placeholder:text-[#9d9d9d] focus:border-[#1c46ff] ${
                    errors.phoneNumber ? 'border-red-500' : 'border-[#C0C3C1]'
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="mb-2 block text-base font-medium text-[#2F2F2F]">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={7}
                  {...register('message')}
                  placeholder="Write your message here..."
                  className={`min-h-[170px] w-full rounded-md border bg-transparent px-4 py-3 text-[15px] text-[#333] outline-none transition placeholder:text-[#9d9d9d] focus:border-[#1c46ff] sm:min-h-[190px] ${
                    errors.message ? 'border-red-500' : 'border-[#C0C3C1]'
                  }`}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              {/* Consent */}
              <div className="flex items-start gap-3">
                <input
                  id="consent"
                  type="checkbox"
                  {...register('consent')}
                  className={`mt-1 h-4 w-4 rounded border ${
                    errors.consent ? 'border-red-500' : 'border-[#bdbdbd]'
                  }`}
                />
                <label
                  htmlFor="consent"
                  className={`text-xs leading-5 sm:text-[14px] ${
                    errors.consent ? 'text-red-600' : 'text-[#8E938F]'
                  }`}
                >
                  I consent to having this website store my submitted information so they can
                  respond to my inquiry. See our{' '}
                  <span className="text-[#1c46ff]">privacy policy</span> to learn more about how
                  we use data.
                </label>
              </div>
              {errors.consent && (
                <p className="text-sm text-red-600">{errors.consent.message}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={mutation.isPending}
                className={`flex h-[52px] w-full items-center justify-center rounded-md bg-[#0024DA] px-6 text-[15px] font-medium text-white transition ${
                  mutation.isPending
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:bg-[#0b2fd4]'
                }`}
              >
                {mutation.isPending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Right - Image */}
          <div className="mx-auto w-full max-w-[420px] lg:mt-[54px] lg:max-w-none">
            <div className="relative w-full overflow-hidden rounded-tr-[12px] rounded-br-[12px] h-[300px] lg:h-[520px] lg:aspect-auto">
              <Image
                src="/contact.png"
                alt="Doctor with digital healthcare interface"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}