
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ShoppingCart, User, LogOut } from 'lucide-react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type CartCountResponse = {
  success: boolean;
  message?: string;
  data?: {
    totalItems?: number;
  };
};

const Navbar = () => {
  const pathname = usePathname();
  const decodedPathname = decodeURIComponent(pathname);

  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const session = useSession();
  const isLoggedIn = session.status === 'authenticated';
  const token = session.data?.user?.accessToken;

  const { data: cartCount = 0 } = useQuery<number>({
    queryKey: ['cart-count'],
    queryFn: async () => {
      if (!token) return 0;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/addtocart`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        }
      );

      if (!response.ok) return 0;

      const data: CartCountResponse = await response.json().catch(() => ({}));
      return data?.data?.totalItems ?? 0;
    },
    enabled: Boolean(token),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const handleSheetOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setIsMoreOpen(false);
      setIsLogoutConfirmOpen(false);
    }
  };

  const closeAll = () => {
    setIsOpen(false);
    setIsMoreOpen(false);
    setIsLogoutConfirmOpen(false);
  };

  const mainLinks = [
    { name: 'Home', href: '/' },
    { name: 'Men HRT', href: `/product-categorys/${'Men HRT'}` },
    { name: 'Woman HRT', href: `/product-categorys/${'Women HRT'}` },
    { name: 'Weight Loss', href: `/product-categorys/${'Weight Loss'}` },
    { name: 'IV Therapy', href: `/product-categorys/${'IV Therapy'}` },
    { name: 'Peptides', href: `/product-categorys/${'Peptides'}` },
  ];

  const moreLinks = [
    { name: 'About us', href: '/about-us' },
    { name: 'Contact us', href: '/contact-us' },
    { name: 'Order history', href: '/profile/order-history' },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/') return decodedPathname === '/';
    return decodedPathname === href || decodedPathname.startsWith(`${href}/`);
  };

  const handleRequestLogout = () => {
    setIsLogoutConfirmOpen(true);
  };

  const handleConfirmLogout = async () => {
    setIsLogoutConfirmOpen(false);
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-[#f8f9fa]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between py-2">
          {/* Logo */}
          <Link href="/" className="shrink-0" aria-label="Go to homepage" onClick={closeAll}>
            <Image
              src="/newlogo.png"
              alt="Renrem Logo"
              width={1000}
              height={1000}
              className="h-[72px] w-[95px] object-cover sm:h-[80px] sm:w-[100px]"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 text-base font-medium text-[#131313] lg:flex">
            {mainLinks.map((link) => {
              const active = isActiveLink(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`pb-1 transition-colors duration-200 ${
                    active
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Desktop More Dropdown */}
            <div
              className="group relative"
              onMouseEnter={() => setIsMoreOpen(true)}
              onMouseLeave={() => setIsMoreOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-[16px] font-medium text-[#131313] transition-colors duration-200 hover:text-blue-600"
                onClick={() => setIsMoreOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={isMoreOpen}
              >
                More
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <div
                className={`invisible absolute right-0 z-50 mt-3 w-52 rounded-2xl border border-gray-100 bg-white py-3 shadow-2xl opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100`}
                role="menu"
              >
                {moreLinks.map((link) => {
                  const active = isActiveLink(link.href);

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`block px-6 py-3 text-base transition-colors ${
                        active
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
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

          {/* Desktop Right Side */}
          <div className="hidden items-center gap-3 lg:flex">
            {isLoggedIn ? (
              <>
                <Link href="/my-cart">
                  <button
                    className="relative flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 transition-colors hover:bg-blue-200"
                    aria-label={`Cart (${cartCount})`}
                  >
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                    {cartCount > 0 && (
                      <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-red-600 px-1 text-center text-[11px] font-semibold leading-[18px] text-white">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 transition-colors hover:bg-blue-200"
                      aria-label="Account menu"
                    >
                      <User className="h-5 w-5 text-blue-600" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/profile/edit-profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={handleRequestLogout}
                      className="text-red-600 focus:text-red-600"
                    >
                      <span className="inline-flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        Logout
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/signin">
                <button className="h-10 rounded-full bg-[#0024DA] px-5 font-medium text-white transition-colors hover:bg-blue-700">
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Right Side Sheet */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
              <SheetTrigger asChild>
                <button
                  className="rounded-xl p-2 text-gray-700 transition hover:bg-gray-100"
                  aria-label="Toggle menu"
                  aria-expanded={isOpen}
                >
                  {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </SheetTrigger>

              <SheetContent
                side="right"
              >
                <SheetHeader className="border-b border-gray-100 px-6 py-5 text-left">
                  <SheetTitle className="text-left text-lg font-semibold text-[#131313]">
                    Menu
                  </SheetTitle>
                </SheetHeader>

                <div className="flex h-full flex-col overflow-y-auto px-4 pb-6 pt-4">
                  {/* Main Links */}
                  <div className="space-y-2">
                    {mainLinks.map((link) => {
                      const active = isActiveLink(link.href);

                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={closeAll}
                          className={`block rounded-2xl px-4 py-3 text-base font-medium transition-colors ${
                            active
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {link.name}
                        </Link>
                      );
                    })}
                  </div>

                  {/* More Accordion */}
                  <div className="mt-5 border-t border-gray-100 pt-5">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-2xl px-4 py-3 transition-colors hover:bg-gray-50"
                      onClick={() => setIsMoreOpen((prev) => !prev)}
                      aria-expanded={isMoreOpen}
                      aria-controls="mobile-more-menu"
                    >
                      <span className="text-sm font-semibold tracking-wide text-gray-500">
                        More
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-500 transition-transform ${
                          isMoreOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <div
                      id="mobile-more-menu"
                      className={`grid transition-all duration-300 ${
                        isMoreOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="mt-2 space-y-2">
                          {moreLinks.map((link) => {
                            const active = isActiveLink(link.href);

                            return (
                              <Link
                                key={link.name}
                                href={link.href}
                                onClick={closeAll}
                                className={`block rounded-2xl px-4 py-3 text-base font-medium transition-colors ${
                                  active
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {link.name}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Buttons */}
                  <div className="mt-auto pt-6">
                    {isLoggedIn ? (
                      <div className="space-y-3">
                        <Link href="/my-cart" onClick={closeAll} className="block">
                          <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-50 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-100">
                            <ShoppingCart className="h-5 w-5" />
                            <span>Cart</span>
                            {cartCount > 0 && (
                              <span className="min-w-[20px] rounded-full bg-red-600 px-1 text-center text-[11px] font-semibold leading-5 text-white">
                                {cartCount > 99 ? '99+' : cartCount}
                              </span>
                            )}
                          </button>
                        </Link>

                        <Link href="/profile/edit-profile" onClick={closeAll} className="block">
                          <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-50 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-100">
                            <User className="h-5 w-5" />
                            Profile
                          </button>
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            closeAll();
                            handleRequestLogout();
                          }}
                          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-600 py-3 font-medium text-white transition-colors hover:bg-red-700"
                        >
                          <LogOut className="h-5 w-5" />
                          Logout
                        </button>
                      </div>
                    ) : (
                      <Link href="/signin" onClick={closeAll} className="block">
                        <button className="w-full rounded-2xl bg-[#0024DA] py-3 font-medium text-white transition-colors hover:bg-blue-700">
                          Login
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Logout Confirm Modal */}
      {isLogoutConfirmOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsLogoutConfirmOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_18px_48px_rgba(0,0,0,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[#131313]">Confirm logout</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Are you sure you want to log out?
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                aria-label="Close logout confirmation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[#131313] hover:bg-gray-50 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmLogout}
                className="w-full rounded-xl bg-red-600 px-4 py-3 text-white hover:bg-red-700 sm:w-auto"
              >
                <span className="inline-flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;