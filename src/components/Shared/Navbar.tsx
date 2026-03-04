'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ShoppingCart, User } from 'lucide-react';
import Image from 'next/image';

const Navbar = () => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((v) => {
      const next = !v;
      // when closing the mobile menu, also close "More"
      if (!next) setIsMoreOpen(false);
      return next;
    });
  };

  const closeAll = () => {
    setIsOpen(false);
    setIsMoreOpen(false);
  };

  const mainLinks = [
    { name: 'Home', href: '/' },
    { name: 'Men HRT', href: '/men-hrt' },
    { name: 'Woman HRT', href: '/woman-hrt' },
    { name: 'Weight Loss', href: '/weight-loss' },
    { name: 'IV Therapy', href: '/iv-therapy' },
    { name: 'Peptides', href: '/peptides' },
  ];

  const moreLinks = [
    { name: 'Phase 1', href: '/phase-1' },
    { name: 'Page 2', href: '/page-2' },
    { name: 'Page 3', href: '/page-3' },
  ];

  const isActiveLink = (href: string) => {
    // Exact match for home, prefix match for other routes (so /men-hrt/x still highlights /men-hrt)
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="bg-[#f8f9fa] border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0" aria-label="Go to homepage" onClick={closeAll}>
            <Image
              src="/logo.png"
              alt="Renrem Logo"
              width={100}
              height={40}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {mainLinks.map((link) => {
              const active = isActiveLink(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`pb-1 transition-colors duration-200 ${
                    active
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* More Dropdown - Desktop */}
            <div
              className="relative group"
              onMouseEnter={() => setIsMoreOpen(true)}
              onMouseLeave={() => setIsMoreOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsMoreOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isMoreOpen}
              >
                More
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <div
                className={`absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3
                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-200 z-50`}
                role="menu"
              >
                {moreLinks.map((link) => {
                  const active = isActiveLink(link.href);

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`block px-6 py-3 transition-colors text-sm ${
                        active ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      }`}
                      onClick={() => setIsMoreOpen(false)}
                      role="menuitem"
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </button>
            <button className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors">
              <User className="w-5 h-5 text-blue-600" />
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-3 text-gray-700"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden bg-white border-t overflow-hidden transition-[max-height,opacity] duration-300 ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-8 space-y-1">
          {mainLinks.map((link) => {
            const active = isActiveLink(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-5 py-4 text-lg font-medium rounded-2xl transition-colors ${
                  active ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={closeAll}
              >
                {link.name}
              </Link>
            );
          })}

          {/* Mobile "More" Accordion */}
          <div className="pt-6 border-t mt-6">
            <button
              type="button"
              className="w-full flex items-center justify-between px-5 py-4 rounded-2xl hover:bg-gray-50 transition-colors"
              onClick={() => setIsMoreOpen((v) => !v)}
              aria-expanded={isMoreOpen}
              aria-controls="mobile-more"
            >
              <span className="text-xs font-semibold tracking-widest text-gray-500">MORE</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isMoreOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div
              id="mobile-more"
              className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                isMoreOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                {moreLinks.map((link) => {
                  const active = isActiveLink(link.href);

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`block px-5 py-4 text-lg font-medium rounded-2xl transition-colors ${
                        active ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={closeAll}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Icons */}
          <div className="flex gap-4 pt-8">
            <button className="flex-1 flex items-center justify-center gap-3 bg-blue-50 hover:bg-blue-100 text-blue-600 py-4 rounded-2xl font-medium transition-colors">
              <ShoppingCart className="w-5 h-5" /> Cart
            </button>
            <button className="flex-1 flex items-center justify-center gap-3 bg-blue-50 hover:bg-blue-100 text-blue-600 py-4 rounded-2xl font-medium transition-colors">
              <User className="w-5 h-5" /> Account
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;