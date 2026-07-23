"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle body scroll locking when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "ABOUT", path: "/about" },
    { name: "PORTFOLIO", path: "/portfolio" },
    { name: "REVIEWS", path: "/reviews" },
    { name: "CONTACT", path: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0b0c10]/85 backdrop-blur-md border-b border-white/10 py-3 shadow-lg"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-16 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group z-50">
            <Image src="/images/logo.png" alt="Logo" width={100} height={100} className="w-[100px] h-[100px] object-cover"/>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`text-[13px] font-medium tracking-[0.2em] transition-colors duration-300 select-none ${
                    isActive
                      ? "text-[#BF9F72] font-semibold"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white/90 hover:text-white p-2 focus:outline-none transition-colors z-50"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-0 w-full h-screen bg-[#0b0c10]/95 backdrop-blur-xl z-40 md:hidden flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full"
        }`}
      >
        <nav className="flex flex-col items-center gap-8 text-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-[18px] font-medium tracking-[0.25em] transition-all duration-300 ${
                  isActive
                    ? "text-[#BF9F72] font-semibold scale-110"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
