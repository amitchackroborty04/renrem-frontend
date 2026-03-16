"use client";

import { MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Men HRT", href: `/product-categorys/${"Men HRT"}` },
    { name: "Woman HRT", href: `/product-categorys/${"Women HRT"}` },
    { name: "Weight Loss", href: `/product-categorys/${"Weight Loss"}` },
    { name: "IV Therapy", href: `/product-categorys/${"IV Therapy"}` },
    { name: "Peptides", href: `/product-categorys/${"Peptides"}` },
  ];

  return (
    <footer
      className="bg-blue-900 text-white py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#1F5A7E" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Left Column - Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Image
                src="/logo.png"
                alt="Renrem Logo"
                width={100}
                height={40}
                className="object-contain"
              />
            </div>
            <h3 className="text-2xl font-bold mb-4">Modern Med Centers</h3>
            <p className="text-sm leading-relaxed text-blue-100">
              Your trusted partner in hormone therapy, weight loss, IV
              nutrition, and peptide treatments — helping you feel your best at
              every stage of life.
            </p>
          </div>

          {/* Center Column - Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6">Quick Links</h4>
            <nav className="flex flex-col space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Column - Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <p className="text-blue-100">
                  123 Finance Street Douala, Cameroon
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a
                  href="tel:+237123456789"
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  +237 123 456 789
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a
                  href="mailto:info@creditmatch.com"
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  info@creditmatch.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#D9D9D94D] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-blue-100">
            © 2025 Company name. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-sm text-blue-100 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-blue-100 hover:text-white transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
