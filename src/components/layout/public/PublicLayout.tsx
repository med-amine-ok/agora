"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAgoraStore } from "@/store/useAgoraStore";
import { Activity, Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAgoraStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "Accueil", id: "hero" },
    { name: "Fonctionnalités", id: "features" },
    { name: "Arène Blitz", id: "medquest" },
    { name: "FAQ", id: "faq" },
    { name: "Articles", href: "/articles" },
  ];

  const isArticlesPage = pathname.startsWith("/articles");

  return (
    <div className="min-h-screen flex flex-col bg-white-custom font-sans antialiased text-text">
      {/* Public Navbar */}
      {!isArticlesPage && (
        <header
          className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
            isScrolled
              ? "bg-white-custom/85 backdrop-blur-md border-b border-border shadow-sm py-3"
              : "bg-transparent py-5"
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <img src="/agoraLogo.png" alt="Agora Logo" className="h-12 w-12 object-contain" />
                
              </Link>


            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) =>
                link.href ? (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-xs font-semibold text-text-light hover:text-teal cursor-pointer transition-colors"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <button
                    key={link.id}
                    onClick={() => handleScrollTo(link.id!)}
                    className="text-xs font-semibold text-text-light hover:text-teal cursor-pointer transition-colors"
                  >
                    {link.name}
                  </button>
                )
              )}
            </nav>

            {/* CTAs */}
            <div className="hidden md:flex items-center gap-4">
              
                <>
                  <Link
                    href="/auth/login"
                    className="text-xs font-semibold text-text hover:text-teal transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-accent bg-white-custom text-accent text-xs font-bold hover:bg-accent/5 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    S'inscrire <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </>
              
            </div>

            {/* Mobile menu trigger */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-teal-dark hover:bg-surface/30 transition-all"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-border bg-white-custom"
            >
              <div className="px-4 pt-2 pb-6 space-y-3">
                {navLinks.map((link) =>
                  link.href ? (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-text hover:bg-surface/20 cursor-pointer"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <button
                      key={link.id}
                      onClick={() => handleScrollTo(link.id!)}
                      className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-text hover:bg-surface/20 cursor-pointer"
                    >
                      {link.name}
                    </button>
                  )
                )}
                <div className="pt-4 border-t border-teal/10 space-y-3">
                
                    <>
                      <Link
                        href="/auth/login"
                        className="text-xs font-semibold text-text hover:text-teal transition-colors"
                      >
                        Connexion
                      </Link>
                      <Link
                        href="/auth/register"
                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-accent bg-white-custom text-accent text-xs font-bold hover:bg-accent/5 hover:scale-[1.01] active:scale-[0.99] transition-all"
                      >
                        S'inscrire <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </>
               
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </header>
      )}

      {/* Main content wrapper */}
      <div className="flex-grow flex flex-col">{children}</div>
    </div>
  );
}
