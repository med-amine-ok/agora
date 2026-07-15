"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAgoraStore } from "@/store/useAgoraStore";
import CommandPalette from "./CommandPalette";
import { Activity, Flame, ShieldAlert, Award, LogOut, Menu, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAgoraStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Leçons", href: "/lessons" },
    { name: "MedQuest", href: "/medquest" },
    { name: "Statistiques", href: "/statistics" },
    { name: "Articles", href: "/articles" },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white-custom/80 backdrop-blur-lg border-b border-border shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/agoraLogo.png" alt="Agora Logo" className="h-20 w-20 object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-teal-dark font-semibold"
                    : "text-text-light hover:text-teal"
                }`}
              >
                {link.name}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Search, Action & Profile */}
          <div className="hidden md:flex items-center gap-6">
            <CommandPalette />

            {user ? (
              <div className="flex items-center gap-4">
                {/* Streak Badge */}
                {/* <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/50 border border-teal/10">
                  <Flame className="h-4 w-4 text-accent fill-accent animate-bounce" />
                  <span className="font-mono text-xs font-bold text-text-dark">
                    {user.streak}j
                  </span>
                </div> */}

                {/* Score/XP Badge */}
                {/* <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal/10 border border-teal/10">
                  <Award className="h-4 w-4 text-teal" />
                  <span className="font-mono text-xs font-bold text-teal-dark">
                    {user.points} XP
                  </span>
                </div> */}

                {/* User menu / Role visual indicator */}
                <div className="flex items-center gap-3 pl-2 border-l border-teal/15">
                  <Link
                    href={user.role === "admin" ? "/admin" : "/dashboard"}
                    className="flex items-center gap-2"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-dark text-white-custom font-semibold text-xs border border-white-custom shadow-sm">
                      {user.role === "admin" ? <ShieldCheck className="h-4 w-4" /> : user.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-text-dark leading-none">
                        {user.name}
                      </p>
                      <p className="text-[9px] uppercase font-mono tracking-wider text-text-light leading-none mt-1">
                        {user.role === "admin" ? "Administrateur" : "Étudiant"}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={logout}
                    className="p-1 rounded-lg text-text-light hover:text-error hover:bg-error/5 transition-all"
                    title="Se déconnecter"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-1.5 rounded-full bg-teal hover:bg-teal-dark text-white-custom text-xs font-medium transition-all"
              >
                Se connecter
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-4">
            {user && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface/50">
                <Flame className="h-3.5 w-3.5 text-accent fill-accent" />
                <span className="font-mono text-xs font-bold text-text-dark">
                  {user.streak}j
                </span>
              </div>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-teal-dark hover:bg-surface/30 transition-all"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border bg-white-custom"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive(link.href)
                      ? "bg-surface/50 text-teal-dark"
                      : "text-text hover:bg-surface/20"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-teal/10 space-y-4">
                {user ? (
                  <>
                    <div className="flex items-center justify-between px-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-teal-dark text-white-custom flex items-center justify-center font-bold text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-text-dark">{user.name}</p>
                          <p className="text-[10px] text-text-light uppercase">{user.role === "admin" ? "Administrateur" : "Étudiant"}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold font-mono text-teal">{user.points} XP</span>
                    </div>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-lg bg-teal-dark text-white-custom text-xs font-medium text-center"
                      >
                        Panneau d'administration
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-center gap-2 px-3 py-2 rounded-lg border border-error/20 text-error hover:bg-error/5 text-sm font-semibold"
                    >
                      <LogOut className="h-4 w-4" />
                      Se déconnecter
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full py-2.5 text-center rounded-lg bg-teal text-white-custom font-semibold text-sm"
                  >
                    Se connecter
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
