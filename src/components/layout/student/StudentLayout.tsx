"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Topbar from "@/components/layout/Topbar";
import {
  Activity,
  BookOpen,
  Trophy,
  Compass,
  Rss,
  User
} from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const mobileLinks = [
    { name: "Tableau", href: "/dashboard", icon: <Compass className="h-4.5 w-4.5" /> },
    { name: "Leçons", href: "/lessons", icon: <BookOpen className="h-4.5 w-4.5" /> },
    { name: "MedQuest", href: "/medquest", icon: <Trophy className="h-4.5 w-4.5" /> },
    { name: "Articles", href: "/articles", icon: <Rss className="h-4.5 w-4.5" /> },
  ];

  const isLessonReader = pathname.includes("/lessons/") && pathname.split("/").filter(Boolean).length === 4;
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className={`min-h-screen flex flex-col bg-white-custom font-sans antialiased text-text lg:pb-0 ${isLessonReader ? "" : "pb-16"}`}>
      {/* Centered Floating Topbar */}
      <Topbar />

      {/* Main workspace content wrapper with padding-top to avoid fixed header overlap */}
      <div className="flex-grow flex flex-col pt-14">{children}</div>

      {/* Mobile bottom nav matching the brand colors */}
      {!isLessonReader && (
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
      )}
    </div>
  );
}

