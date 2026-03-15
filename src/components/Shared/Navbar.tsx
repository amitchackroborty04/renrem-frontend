'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ShoppingCart, User, LogOut } from 'lucide-react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const pathname = usePathname();

  // Decode encoded URI (e.g. %20 → space) so dynamic links match correctly
  const decodedPathname = decodeURIComponent(pathname);

  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const session = useSession();
  const isLoggedIn = session.status === 'authenticated';


  const toggleMenu = () => {
    setIsOpen((v) => {
      const next = !v;
      if (!next) setIsMoreOpen(false);
      return next;
    });
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
    <nav className="bg-[#f8f9fa] border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <Link href="/" className="shrink-0" aria-label="Go to homepage" onClick={closeAll}>
            <Image
              src="/newlogo.png"
              alt="Renrem Logo"
              width={1000}
              height={1000}
              className="object-cover w-[100px] h-[80px]"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 text-base text-[#131313] font-medium">
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
                className="flex items-center gap-1 font-medium text-[16px] text-[#131313] hover:text-blue-600 transition-colors duration-200"
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
                      className={`block px-6 py-3 transition-colors text-base text-[#131313] ${
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
            {isLoggedIn ? (
              <>
                <Link href="/my-cart">
                  <button className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                  </button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors"
                      aria-label="Account menu"
                    >
                      <User className="w-5 h-5 text-blue-600" />
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
                <button className="px-5 h-10 bg-[#0024DA] hover:bg-blue-700 text-white rounded-full font-medium transition-colors">
                  Login
                </button>
              </Link>
            )}
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
                className={`w-5 h-5 text-gray-500 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`}
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
            {isLoggedIn ? (
              <>
                <Link href="/my-cart" className="flex-1">
                  <button className="w-full flex items-center justify-center gap-3 bg-blue-50 hover:bg-blue-100 text-blue-600 py-4 rounded-2xl font-medium transition-colors">
                    <ShoppingCart className="w-5 h-5" /> Cart
                  </button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex-1 w-full flex items-center justify-center gap-3 bg-blue-50 hover:bg-blue-100 text-blue-600 py-4 rounded-2xl font-medium transition-colors"
                      aria-label="Account menu"
                    >
                      <User className="w-5 h-5" /> Account
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/profile/edit-profile" onClick={() => setIsOpen(false)}>
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => {
                        setIsOpen(false);
                        handleRequestLogout();
                      }}
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
              <Link href="/signin" className="flex-1">
                <button className="w-full flex items-center justify-center bg-[#0024DA] hover:bg-blue-700 text-white py-4 rounded-2xl font-medium transition-colors">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
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
