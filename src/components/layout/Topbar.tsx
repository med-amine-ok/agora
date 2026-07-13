"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAgoraStore } from "@/store/useAgoraStore";
import CommandPalette from "@/components/CommandPalette";
import {
  Activity,
  Flame,
  Award,
  BookOpen,
  Trophy,
  Users,
  Rss,
  LogOut,
  Bell,
  User,
  Settings,
  ChevronDown,
  Sparkles,
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, activeQuestScore } = useAgoraStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Monitor scroll for styling transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide Topbar if medquest blitz is active
  const isBlitzActive = pathname === "/medquest/blitz" && activeQuestScore > 0;
  if (isBlitzActive) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isActive = (href: string) => pathname.startsWith(href);

  const notifications = [
    { id: 1, text: "Sarah B. vous a défié dans l'arène Blitz !", time: "Il y a 5 min" },
    { id: 2, text: "Votre série quotidienne a été prolongée. 12 jours !", time: "Il y a 2h" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white-custom/88 backdrop-blur-md shadow-sm border-b border-teal/8"
          : "bg-transparent border-b border-transparent"
      }`}
      style={{ height: "56px" }}
    >
      <div className="max-w-[1200px] h-full mx-auto px-6 flex items-center justify-between">
        {/* Zone 1 — Logo (Left) */}
        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-dark text-white-custom transition-all group-hover:scale-105">
              <Activity className="h-4.5 w-4.5 stroke-[2.5] text-accent animate-pulse" />
            </div>
            <span className="font-display text-base font-bold tracking-tight text-teal-dark">
              Agora
            </span>
          </Link>
        </div>

        {/* Zone 2 — Floating Pill Navigation (Center) */}
        <div className="hidden md:flex items-center bg-white border border-teal/10 px-1.5 py-1 rounded-full shadow-sm hover:shadow-md transition-all">
          <nav className="flex items-center gap-0.5">
            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive("/dashboard")
                  ? "bg-teal text-white-custom"
                  : "text-text-light hover:text-teal hover:bg-surface/30"
              }`}
            >
              <span>Dashboard</span>
            </Link>

            {/* Lessons Link */}
            <Link
              href="/lessons"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive("/lessons")
                  ? "bg-teal text-white-custom"
                  : "text-text-light hover:text-teal hover:bg-surface/30"
              }`}
            >
              <span>Leçons</span>
            </Link>

            {/* MedQuest Link */}
            <Link
              href="/medquest"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive("/medquest") && !isActive("/medquest/flashcards")
                  ? "bg-teal text-white-custom"
                  : "text-text-light hover:text-teal hover:bg-surface/30"
              }`}
            >
              <span>MedQuest</span>
            </Link>

            {/* Articles Link */}
            <Link
              href="/articles"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive("/articles")
                  ? "bg-teal text-white-custom"
                  : "text-text-light hover:text-teal hover:bg-surface/30"
              }`}
            >
              <span>Articles</span>
            </Link>
          </nav>
        </div>

        {/* Zone 3 — Right Actions */}
        <div className="flex items-center gap-3">
          {/* Search Palette */}
          <CommandPalette />

          {/* Streak Badge */}
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-100 cursor-pointer"
            title="Série active"
          >
            <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
            <span className="font-mono text-xs font-bold text-orange-700">{user?.streak || 0}j</span>
          </motion.div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-1.5 rounded-full hover:bg-surface/50 text-text-light hover:text-teal transition-all relative"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-accent" />
            </button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 rounded-xl border border-teal/10 bg-white p-4 shadow-xl z-50 text-left"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-teal-dark">Notifications</h4>
                    <button onClick={() => setIsNotificationsOpen(false)} className="text-[10px] text-teal hover:underline">Marquer comme lues</button>
                  </div>
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="text-xs border-b border-teal/5 pb-2 last:border-0 last:pb-0">
                        <p className="text-text-dark font-medium leading-normal">{notif.text}</p>
                        <span className="text-[9px] text-text-light">{notif.time}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-teal text-white-custom flex items-center justify-center font-bold text-xs shadow-sm border border-teal-light/20 cursor-pointer">
                {user?.name?.charAt(0) || "U"}
              </div>
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-52 rounded-xl border border-teal/10 bg-white p-2 shadow-xl z-50 text-left"
                >
                  <div className="px-3 py-2 border-b border-teal/5 mb-1">
                    <p className="text-xs font-bold text-text-dark truncate">{user?.name}</p>
                    <p className="text-[9px] font-mono text-text-light uppercase tracking-wider mt-0.5">Étudiant</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-text hover:bg-surface/50 hover:text-teal transition-all"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>Mon profil</span>
                  </Link>
                  <Link
                    href="/friends"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-text hover:bg-surface/50 hover:text-teal transition-all"
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span>Amis</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-text hover:bg-surface/50 hover:text-teal transition-all"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span>Paramètres</span>
                  </Link>
                  <Link
                    href="/statistics"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-text hover:bg-surface/50 hover:text-teal transition-all"
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span>Statistiques</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-error hover:bg-error/5 transition-all text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Se déconnecter</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
