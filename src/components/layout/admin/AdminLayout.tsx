"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAgoraStore } from "@/store/useAgoraStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  BarChart2,
  Users,
  BookOpen,
  HelpCircle,
  Trophy,
  AlertTriangle,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  ShieldCheck,
  Search,
  ExternalLink,
  Menu,
  X
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAgoraStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const adminLinks = [
    { name: "Vue d'ensemble", href: "/admin", icon: <Activity className="h-4 w-4" /> },
    { name: "Analyses", href: "/admin/analytics", icon: <BarChart2 className="h-4 w-4" /> },
    { name: "Étudiants", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
    { name: "Matières", href: "/admin/subjects", icon: <BookOpen className="h-4 w-4" /> },
    { name: "Leçons", href: "/admin/lessons", icon: <FileText className="h-4 w-4" /> },
    { name: "Questions QCM", href: "/admin/questions", icon: <HelpCircle className="h-4 w-4" /> },
    { name: "Salons Blitz", href: "/admin/rooms", icon: <Activity className="h-4 w-4" /> },
    { name: "Classements", href: "/admin/leaderboard", icon: <Trophy className="h-4 w-4" /> },
    { name: "Signalements", href: "/admin/reports", icon: <AlertTriangle className="h-4 w-4" /> },
    { name: "Articles CMS", href: "/admin/blog", icon: <FileText className="h-4 w-4" /> },
    { name: "Configuration", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-[#f8fbfb] text-text-dark">
      
      {/* Desktop Left Sidebar (Hidden on mobile) */}
      <aside
        className={`hidden lg:flex bg-surface/40 border-r border-border-custom flex-col justify-between transition-all duration-300 shrink-0 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div>
          {/* Header logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border-custom">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-teal text-white-custom shrink-0 shadow-sm">
                <Activity className="h-4.5 w-4.5 stroke-[2.5]" />
              </div>
              {!isCollapsed && (
                <span className="font-display font-bold text-sm tracking-widest text-teal-dark uppercase">
                  AGORA ADMIN
                </span>
              )}
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-text-light hover:text-teal rounded p-1 hover:bg-surface cursor-pointer"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Nav links */}
          <nav className="mt-4 px-2 space-y-1">
            {adminLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold transition-all ${
                    active
                      ? "bg-teal/10 text-teal border-l-2 border-accent"
                      : "text-text-light hover:text-teal hover:bg-surface/50"
                  }`}
                >
                  {link.icon}
                  {!isCollapsed && <span>{link.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-2 border-t border-border-custom space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold text-text-light hover:text-teal hover:bg-surface/50 transition-all"
          >
            <ExternalLink className="h-4 w-4" />
            {!isCollapsed && <span>Retour au site</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold text-error hover:bg-error/10 transition-all text-left cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span>Se déconnecter</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white-custom border-r border-border-custom flex flex-col justify-between shadow-2xl lg:hidden"
            >
              <div>
                <div className="h-16 flex items-center justify-between px-4 border-b border-border-custom">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-teal text-white-custom">
                      <Activity className="h-4.5 w-4.5 stroke-[2.5]" />
                    </div>
                    <span className="font-display font-bold text-sm tracking-widest text-teal-dark uppercase">
                      AGORA ADMIN
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-full hover:bg-surface text-text-light"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="mt-4 px-2 space-y-1">
                  {adminLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold transition-all ${
                          active
                            ? "bg-teal/10 text-teal border-l-2 border-accent"
                            : "text-text-light hover:text-teal hover:bg-surface/50"
                        }`}
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="p-4 border-t border-border-custom space-y-1">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold text-text-light hover:text-teal hover:bg-surface/50 transition-all"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Retour au site</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold text-error hover:bg-error/10 transition-all text-left cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Se déconnecter</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Right Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Top toolbar */}
        <header className="h-16 border-b border-border-custom bg-white-custom flex items-center justify-between px-4 sm:px-6">
          
          {/* Mobile menu trigger + search bar container */}
          <div className="flex items-center gap-2 flex-grow max-w-sm sm:max-w-md">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-text-light hover:text-teal rounded hover:bg-surface shrink-0 cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative w-full">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-8 pr-3 py-1.5 rounded bg-surface/30 border border-border-custom text-xs outline-none focus:border-teal text-text-dark placeholder-text-light/40"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-text-light/50" />
            </div>
          </div>

          {/* Admin User Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pl-3 border-l border-border-custom">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-surface text-text-dark shrink-0">
                <ShieldCheck className="h-4.5 w-4.5 text-teal" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold leading-none text-text-dark">{user?.name || "Dr. Belkacem"}</p>
                <p className="text-[9px] uppercase font-mono tracking-wider text-accent leading-none mt-1">
                  Administrateur
                </p>
              </div>
            </div>
          </div>

        </header>

        {/* Content body */}
        <main className="flex-grow p-4 sm:p-6 overflow-y-auto bg-white-custom">
          {children}
        </main>
      </div>
    </div>
  );
}
