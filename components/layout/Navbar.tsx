"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
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

  // Scroll listener for header background and active section detection
  useEffect(() => {
    const handleScroll = () => {
      // Header background toggle
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Active section detection on home page
      if (pathname === "/") {
        const sectionIds = ["home", "about", "portfolio", "reviews", "contact"];
        const scrollPosition = window.scrollY + 150; // Header height offset

        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const el = document.getElementById(sectionIds[i]);
          if (el) {
            const top = el.offsetTop;
            if (scrollPosition >= top) {
              setActiveSection(sectionIds[i]);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const navLinks = [
    { name: "HOME", targetId: "home", path: "/#home" },
    { name: "ABOUT", targetId: "about", path: "/#about" },
    { name: "PORTFOLIO", targetId: "portfolio", path: "/#portfolio" },
    { name: "REVIEWS", targetId: "reviews", path: "/#reviews" },
    { name: "CONTACT", targetId: "contact", path: "/#contact" },
  ];

  const isHomeHero = pathname === "/" && !scrolled;

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ) => {
    if (pathname === "/") {
      e.preventDefault();
      setIsOpen(false);
      const el = document.getElementById(targetId);
      if (el) {
        const offsetTop = el.offsetTop - 70;
        window.scrollTo({
          top: offsetTop < 0 ? 0 : offsetTop,
          behavior: "smooth",
        });
        setActiveSection(targetId);
      }
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isHomeHero
            ? "bg-transparent py-5"
            : "bg-[#0b0c10]/85 backdrop-blur-md border-b border-white/10 py-3 shadow-lg"
        }`}
      >
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-16 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, "home")}
            className="flex items-center gap-3 group z-50"
          >
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={800}
              height={523}
              priority
              className="w-[130px] h-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => {
              const isActive =
                pathname === "/"
                  ? activeSection === link.targetId
                  : pathname === link.path;

              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link.targetId)}
                  className={`text-[13px] font-medium tracking-[0.2em] transition-colors duration-300 select-none ${
                    isActive
                      ? "text-[#BF9F72] font-semibold"
                      : "text-white/80 hover:text-[#BF9F72]"
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
            const isActive =
              pathname === "/"
                ? activeSection === link.targetId
                : pathname === link.path;

            return (
              <Link
                key={link.name}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.targetId)}
                className={`text-[18px] font-medium tracking-[0.25em] transition-all duration-300 ${
                  isActive
                    ? "text-[#BF9F72] font-semibold scale-110"
                    : "text-white/70 hover:text-[#BF9F72]"
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
