"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Poetsen_One } from "next/font/google";
import { useState, useEffect, useCallback } from "react";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import { WEBSITE_NAME } from "@/lib/types";
import { mainNavLinks } from "@/app/data/navigation";

// Define types for navigation links
interface NavLink {
  href: string;
  label: string;
}

// Define props for NavLink component
interface NavLinkItemProps {
  href: string;
  label: string;
  isActive: boolean;
  isMobile?: boolean;
}

// Load Poetsen One (Google Font) at build‑time
const poetsen = Poetsen_One({
  weight: "400",
  subsets: ["latin"],
});

// Extract navigation links to a constant
const NAV_LINKS: NavLink[] = mainNavLinks.map((link) => ({
  href: link.url,
  label: link.name,
}));

// NavLink component for better reusability
const NavLinkItem = ({
  href,
  label,
  isActive,
  isMobile = false,
}: NavLinkItemProps) => {
  const baseClasses = "transition-colors duration-200 rounded-md font-medium";

  const desktopClasses = `relative px-3 py-2 text-sm ${baseClasses} ${
    isActive
      ? "text-teal-500 dark:text-teal-400 bg-teal-400/5 dark:bg-teal-400/10"
      : "text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 hover:bg-teal-400/5 dark:hover:bg-teal-400/10"
  }`;

  const mobileClasses = `block py-3 mx-4 text-lg ${baseClasses} ${
    isActive
      ? "text-teal-500 dark:text-teal-400 bg-teal-400/5 dark:bg-teal-400/10"
      : "text-gray-800 dark:text-white hover:text-teal-500 dark:hover:text-teal-400 hover:bg-teal-400/5 dark:hover:bg-teal-400/10"
  }`;

  return (
    <Link href={href} className={isMobile ? mobileClasses : desktopClasses}>
      {label}
      {isActive && !isMobile && (
        <span className="absolute left-0 -bottom-0.5 h-0.5 w-full rounded bg-teal-500 dark:bg-teal-400" />
      )}
    </Link>
  );
};

// MobileMenu component
const MobileMenu = ({
  isOpen,
  navLinks,
  pathname,
}: {
  isOpen: boolean;
  navLinks: NavLink[];
  pathname: string;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md dark:shadow-gray-700"
      aria-hidden={!isOpen}
    >
      <nav>
        <ul className="flex flex-col items-center py-4 space-y-4">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href} className="w-full text-center">
                <NavLinkItem
                  href={href}
                  label={label}
                  isActive={isActive}
                  isMobile={true}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

// Hamburger button component
const HamburgerButton = ({
  isOpen,
  toggleMenu,
}: {
  isOpen: boolean;
  toggleMenu: () => void;
}) => (
  <button
    onClick={toggleMenu}
    className="flex flex-col justify-center items-center space-y-1.5 z-50"
    aria-label={isOpen ? "Close Menu" : "Open Menu"}
    aria-expanded={isOpen}
    aria-controls="mobile-menu"
  >
    <span
      className={`w-6 h-0.5 bg-gray-800 dark:bg-white block transition-all duration-300 ${
        isOpen ? "transform rotate-45 translate-y-1.5" : ""
      }`}
    />
    <span
      className={`w-6 h-0.5 bg-gray-800 dark:bg-white block transition-all duration-300 ${
        isOpen ? "opacity-0" : "opacity-100"
      }`}
    />
    <span
      className={`w-6 h-0.5 bg-gray-800 dark:bg-white block transition-all duration-300 ${
        isOpen ? "transform -rotate-45 -translate-y-1.5" : ""
      }`}
    />
  </button>
);

export default function Navbar(): React.JSX.Element {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Memoize handlers for better performance
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  const checkScreenSize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Check screen size with debounced resize handler
  useEffect(() => {
    // Initial check
    checkScreenSize();

    // Debounced resize handler for better performance
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScreenSize, 100);
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [checkScreenSize]);

  // Add scroll detection with passive listener for better performance
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Dynamic header classes for better readability
  const headerClasses = `
    ${poetsen.className}
    sticky top-0 z-50 
    backdrop-blur-lg 
    transition-all duration-300
    ${isScrolled ? "py-2" : "py-3"}
    bg-white/70 dark:bg-gray-900/70 
    text-gray-800 dark:text-white
    ${
      isScrolled
        ? "shadow-md dark:shadow-gray-700"
        : "shadow-sm dark:shadow-gray-800"
    }
  `;

  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex items-center px-4 relative">
        {/* Logo */}
        <div className="flex-1 flex justify-start">
          <Link
            href="/"
            className="flex items-center text-xl md:text-2xl font-semibold tracking-wide"
            aria-label={`${WEBSITE_NAME} homepage`}
          >
            <Image
              src="/icon.png"
              alt="Website Icon"
              width={32}
              height={32}
              className="w-7 h-7 rounded-full"
              priority
            />
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
              <span className="ml-2 sm:inline text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                {WEBSITE_NAME}
              </span>
            </div>
          </Link>
        </div>
        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="flex items-center justify-between w-full">
            <nav aria-label="Main Navigation">
              <ul className="flex gap-6">
                {NAV_LINKS.map(({ href, label }) => {
                  const isActive = pathname === href;
                  return (
                    <li key={href}>
                      <NavLinkItem
                        href={href}
                        label={label}
                        isActive={isActive}
                      />
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Theme Toggle */}
            <ThemeToggle className="ml-auto" />
          </div>
        )}

        {/* Mobile Content (Theme Toggle + Menu Button) */}
        {isMobile && (
          <div className="flex items-center gap-4 ml-auto">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <HamburgerButton isOpen={isOpen} toggleMenu={toggleMenu} />
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isOpen && isMobile}
        navLinks={NAV_LINKS}
        pathname={pathname}
      />
    </header>
  );
}
