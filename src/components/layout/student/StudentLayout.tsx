"use client";

import React, { useState } from "react";
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
  Compass,
  Users,
  Rss,
  LogOut,
  Bell,
  User,
  Settings,
  HelpCircle,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAgoraStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const studentLinks = [
    { name: "Tableau de Bord", href: "/dashboard", icon: <Compass className="h-4 w-4" /> },
    { name: "Leçons", href: "/lessons", icon: <BookOpen className="h-4 w-4" /> },
    { name: "MedQuest", href: "/medquest", icon: <Trophy className="h-4 w-4" /> },
    { name: "Statistiques", href: "/statistics", icon: <Activity className="h-4 w-4" /> },
    { name: "Articles", href: "/articles", icon: <Rss className="h-4 w-4" /> },
  ];

  const mobileLinks = [
    { name: "Tableau", href: "/dashboard", icon: <Compass className="h-4.5 w-4.5" /> },
    { name: "Leçons", href: "/lessons", icon: <BookOpen className="h-4.5 w-4.5" /> },
    { name: "MedQuest", href: "/medquest", icon: <Trophy className="h-4.5 w-4.5" /> },
    { name: "Stats", href: "/statistics", icon: <Activity className="h-4.5 w-4.5" /> },
    { name: "Articles", href: "/articles", icon: <Rss className="h-4.5 w-4.5" /> },
    { name: "Profil", href: "/profile", icon: <User className="h-4.5 w-4.5" /> },
  ];

  const notifications = [
    { id: 1, text: "Sarah B. vous a défié dans l'arène Blitz !", time: "Il y a 5 min" },
    { id: 2, text: "Votre série quotidienne a été prolongée. 12 jours !", time: "Il y a 2h" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="min-h-screen flex flex-col bg-white-custom font-sans antialiased text-text pb-16 lg:pb-0">
      {/* Floating Header */}
      <header className="sticky top-0 z-40 bg-white-custom/80 backdrop-blur-md border-b border-border py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-dark text-white-custom">
                <Activity className="h-4.5 w-4.5 stroke-[2.5] text-accent animate-pulse" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-teal-dark">
                Agora
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {studentLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive(link.href)
                      ? "bg-teal/10 text-teal-dark"
                      : "text-text-light hover:text-teal hover:bg-surface/30"
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Stats, Search & Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <CommandPalette />
            </div>

            {/* Streak & XP */}
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface/50 border border-teal/10" title="Série active">
                <Flame className="h-3.5 w-3.5 text-accent fill-accent" />
                <span className="font-mono text-xs font-bold text-text-dark">{user?.streak || 0}j</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal/10 border border-teal/10" title="Points cumulés">
                <Award className="h-3.5 w-3.5 text-teal" />
                <span className="font-mono text-xs font-bold text-teal-dark">{user?.points || 0} XP</span>
              </div>
            </div>

            {/* Notifications */}
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
                    className="absolute right-0 mt-2 w-80 rounded-xl border border-teal/10 bg-white-custom p-4 shadow-xl z-50 text-left"
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

            {/* Profile Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2"
              >
                <div className="h-8 w-8 rounded-full bg-teal text-white-custom flex items-center justify-center font-bold text-xs shadow-sm border border-teal-light/20">
                  {user?.name?.charAt(0) || "U"}
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-52 rounded-xl border border-teal/10 bg-white-custom p-2 shadow-xl z-50 text-left"
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

      </header>

      {/* Main workspace content wrapper */}
      <div className="flex-grow flex flex-col">{children}</div>

      {/* Mobile bottom nav matching the brand colors */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-teal-dark border-t border-white/5 py-2 px-2 flex justify-around items-center shadow-lg pb-safe">
        {mobileLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
              isActive(link.href) ? "text-accent font-bold scale-105" : "text-white/60 hover:text-white"
            }`}
          >
            {link.icon}
            <span className="text-[10px] tracking-wide font-medium">
              {link.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
