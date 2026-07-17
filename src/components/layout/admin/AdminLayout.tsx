"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAgoraStore } from "@/store/useAgoraStore";
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  Layers,
  FileText,
  Users,
  Shield,
  Trophy,
  BarChart2,
  Activity,
  Settings,
  Bell,
  ExternalLink,
  LogOut,
  Search,
  Monitor,
  User,
  Menu,
  ChevronDown
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAgoraStore();
  const [searchFocused, setSearchFocused] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navSections = [
    {
      title: "Tableau de Bord",
      items: [
        { name: "Vue d'ensemble", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> }
      ]
    },
    {
      title: "Contenu",
      items: [
        { name: "Sujets", href: "/admin/subjects", icon: <BookOpen className="h-4 w-4" /> },
        { name: "Leçons", href: "/admin/lessons", icon: <BookOpen className="h-4 w-4" /> },
        { name: "Questions", href: "/admin/questions", icon: <HelpCircle className="h-4 w-4" /> },
        { name: "Flashcards", href: "/admin/flashcards", icon: <Layers className="h-4 w-4" />, badge: 12 },
        { name: "Blog", href: "/admin/blog", icon: <FileText className="h-4 w-4" /> }
      ]
    },
    {
      title: "Utilisateurs",
      items: [
        { name: "Tous les utilisateurs", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
        { name: "Rôles & permissions", href: "/admin/roles", icon: <Shield className="h-4 w-4" /> }
      ]
    },
    {
      title: "Activité",
      items: [
        { name: "Salles en direct", href: "/admin/rooms", icon: <Trophy className="h-4 w-4" />, badge: 14 },
        { name: "Statistiques", href: "/admin/analytics", icon: <BarChart2 className="h-4 w-4" /> },
        { name: "Logs d'activité", href: "/admin/reports", icon: <Activity className="h-4 w-4" /> }
      ]
    },
    {
      title: "Configuration",
      items: [
        { name: "Paramètres", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
        { name: "Notifications", href: "/admin/notifications", icon: <Bell className="h-4 w-4" /> }
      ]
    }
  ];

  const getPageTitleAndBreadcrumb = () => {
    if (pathname === "/admin") return { title: "Vue d'ensemble", path: "Tableau de bord / Vue d'ensemble" };
    if (pathname.startsWith("/admin/lessons")) return { title: "Leçons", path: "Contenu / Leçons" };
    if (pathname.startsWith("/admin/questions")) return { title: "Questions", path: "Contenu / Questions" };
    if (pathname.startsWith("/admin/flashcards")) return { title: "Flashcards", path: "Contenu / Flashcards" };
    if (pathname.startsWith("/admin/blog")) return { title: "Blog", path: "Contenu / Blog" };
    if (pathname.startsWith("/admin/users")) return { title: "Utilisateurs", path: "Utilisateurs / Tous les utilisateurs" };
    if (pathname.startsWith("/admin/rooms")) return { title: "Salles en direct", path: "Activité / Salles en direct" };
    if (pathname.startsWith("/admin/analytics")) return { title: "Statistiques", path: "Activité / Statistiques" };
    if (pathname.startsWith("/admin/settings")) return { title: "Paramètres", path: "Configuration / Paramètres" };
    return { title: "Console Admin", path: "Agora / Admin" };
  };

  const { title, path } = getPageTitleAndBreadcrumb();

  return (
    <div className="min-h-screen bg-[#F5FAFA]">
      {/* Mobile Header / Topbar */}
      <header className="h-[52px] bg-white border-b border-[rgba(10,61,61,0.08)] fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileMenu(true)}
            className="p-1 rounded-lg hover:bg-[rgba(10,61,61,0.06)] text-[#0D2626]"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-1.5">
            <img src="/icon.png" alt="Agora Logo" className="h-6 w-6 object-contain" />
            <span className="font-display font-semibold tracking-wider text-xs text-[#0D2626]">
              Agora <span className="text-[#0E7C7B] font-sans text-[10px] font-bold">Admin</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <button className="p-1.5 hover:bg-[rgba(10,61,61,0.06)] rounded-lg text-[#3D5C5C] relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-[#FF6B35] rounded-full" />
          </button>

          {/* Mini User dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAvatarMenu(!showAvatarMenu)}
              className="h-7 w-7 rounded-full bg-[#E0F2F2] flex items-center justify-center font-bold text-[11px] text-[#0E7C7B]"
            >
              {user?.name?.slice(0, 2).toUpperCase() || "HB"}
            </button>
            {showAvatarMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowAvatarMenu(false)} />
                <div className="absolute right-0 mt-1.5 w-48 bg-white border border-[rgba(10,61,61,0.12)] rounded-lg shadow-lg py-1 z-50">
                  <div className="px-3 py-2 border-b border-[rgba(10,61,61,0.06)]">
                    <p className="text-xs font-bold text-[#0D2626]">{user?.name || "Hamza Belkadi"}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 bg-red-50 text-[9px] font-bold text-red-600 rounded">
                      ADMIN
                    </span>
                  </div>
                  <Link
                    href="/admin/settings"
                    onClick={() => setShowAvatarMenu(false)}
                    className="block w-full text-left px-3 py-1.5 text-xs text-[#0D2626] hover:bg-[#F5FAFA]"
                  >
                    Mon profil
                  </Link>
                  <button
                    onClick={() => {
                      setShowAvatarMenu(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    Déconnexion
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Backdrop */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Mobile Drawer Navigation Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-[240px] bg-[#071F1F] text-white z-50 flex flex-col justify-between overflow-y-auto transition-transform duration-300 lg:hidden ${
          showMobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo Area */}
          <div className="h-[52px] flex items-center justify-between px-5 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <img src="/icon.png" alt="Agora Logo" className="h-7 w-7 object-contain" />
              <span className="font-display font-semibold tracking-wider text-sm text-white">
                Agora <span className="text-[#5DC8C6] font-sans text-xs font-bold ml-1 uppercase">Admin</span>
              </span>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="mt-4 px-2 space-y-4">
            {navSections.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-[10px] font-bold text-[rgba(93,200,198,0.45)] uppercase tracking-[0.08em] px-3 mb-1.5">
                  {section.title}
                </h4>
                <nav className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setShowMobileMenu(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all ${
                          active
                            ? "bg-[rgba(14,124,123,0.18)] text-[rgba(245,250,250,0.95)]"
                            : "text-[rgba(245,250,250,0.60)] hover:bg-white/5 hover:text-[rgba(245,250,250,0.85)]"
                        }`}
                      >
                        <span className={active ? "text-[#5DC8C6]" : "text-current"}>
                          {item.icon}
                        </span>
                        <span>{item.name}</span>
                        {item.badge !== undefined && (
                          <span className="ml-auto bg-[#FF6B35] text-white rounded-full text-[11px] font-semibold px-1.5 py-0.5 min-w-[18px] text-center">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/5 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg border border-[rgba(93,200,198,0.15)] text-[12px] text-[rgba(245,250,250,0.50)]"
          >
            <span>Voir le site étudiant</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-red-400 hover:bg-red-500/10 transition-all text-left cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen">
        {/* Desktop Sidebar (hidden on mobile) */}
        <aside className="hidden lg:flex w-[240px] bg-[#071F1F] text-white fixed top-0 bottom-0 left-0 flex flex-col justify-between z-50 overflow-y-auto">
          <div>
            {/* Logo Area */}
            <div className="h-[52px] flex items-center gap-2.5 px-5 border-b border-white/5">
              <img src="/icon.png" alt="Agora Logo" className="h-7 w-7 object-contain" />
              <span className="font-display font-semibold tracking-wider text-sm text-white">
                Agora <span className="text-[#5DC8C6] font-sans text-xs font-bold ml-1 uppercase">Admin</span>
              </span>
            </div>

            {/* Navigation Sections */}
            <div className="mt-4 px-2 space-y-4">
              {navSections.map((section, idx) => (
                <div key={idx}>
                  <h4 className="text-[10px] font-bold text-[rgba(93,200,198,0.45)] uppercase tracking-[0.08em] px-3 mb-1.5">
                    {section.title}
                  </h4>
                  <nav className="space-y-0.5">
                    {section.items.map((item) => {
                      const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all font-sans ${
                            active
                              ? "bg-[rgba(14,124,123,0.18)] text-[rgba(245,250,250,0.95)]"
                              : "text-[rgba(245,250,250,0.60)] hover:bg-white/5 hover:text-[rgba(245,250,250,0.85)]"
                          }`}
                        >
                          <span className={active ? "text-[#5DC8C6]" : "text-current"}>
                            {item.icon}
                          </span>
                          <span>{item.name}</span>
                          {item.badge !== undefined && (
                            <span className="ml-auto bg-[#FF6B35] text-white rounded-full text-[11px] font-semibold px-1.5 py-0.5 min-w-[18px] text-center">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-white/5 space-y-1">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-lg border border-[rgba(93,200,198,0.15)] text-[12px] text-[rgba(245,250,250,0.50)] hover:border-[rgba(93,200,198,0.35)] hover:text-[rgba(245,250,250,0.80)] transition-all font-sans"
            >
              <span>Voir le site étudiant</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-red-400 hover:bg-red-500/10 transition-all text-left cursor-pointer font-sans"
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-grow w-full lg:pl-[240px]">
          {/* Topbar (hidden on mobile, uses Mobile Header instead) */}
          <header className="hidden lg:flex h-[52px] bg-white border-b border-[rgba(10,61,61,0.08)] fixed top-0 left-[240px] right-0 z-40 items-center justify-between px-6">
            {/* Left: Breadcrumbs */}
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-[#7A9E9E] font-medium tracking-wide font-sans">
                {path}
              </span>
              <span className="text-sm font-semibold text-[#0D2626] leading-tight font-sans">
                {title}
              </span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              {/* Global search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Recherche globale..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`h-8 pl-9 pr-3 rounded-lg bg-[rgba(10,61,61,0.06)] border border-[rgba(10,61,61,0.12)] text-xs text-[#0D2626] outline-none focus:bg-white focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/15 placeholder-[#7A9E9E]/70 font-sans transition-all duration-250 ${
                    searchFocused ? "w-[360px]" : "w-[260px]"
                  }`}
                />
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#7A9E9E]" />
              </div>

              {/* Notification bell */}
              <button className="p-1.5 hover:bg-[rgba(10,61,61,0.06)] rounded-lg text-[#3D5C5C] relative cursor-pointer">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-[#FF6B35] rounded-full" />
              </button>

              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                  className="flex items-center gap-2 pl-3 border-l border-[rgba(10,61,61,0.08)] cursor-pointer"
                >
                  <div className="h-7 w-7 rounded-full bg-[#E0F2F2] flex items-center justify-center font-bold text-[11px] text-[#0E7C7B]">
                    {user?.name?.slice(0, 2).toUpperCase() || "HB"}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#0D2626] leading-none">{user?.name || "Hamza Belkadi"}</p>
                    <p className="text-[9px] uppercase font-mono tracking-wider text-[#FF6B35] leading-none mt-0.5">
                      ADMIN
                    </p>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-[#7A9E9E]" />
                </button>

                {showAvatarMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowAvatarMenu(false)} />
                    <div className="absolute right-0 mt-1.5 w-48 bg-white border border-[rgba(10,61,61,0.12)] rounded-lg shadow-lg py-1 z-50">
                      <div className="px-3 py-2 border-b border-[rgba(10,61,61,0.06)]">
                        <p className="text-xs font-bold text-[#0D2626]">{user?.name || "Hamza Belkadi"}</p>
                        <span className="inline-block mt-1 px-1.5 py-0.5 bg-red-50 text-[9px] font-bold text-red-600 rounded">
                          ADMIN
                    </span>
                      </div>
                      <Link
                        href="/admin/settings"
                        onClick={() => setShowAvatarMenu(false)}
                        className="block w-full text-left px-3 py-1.5 text-xs text-[#0D2626] hover:bg-[#F5FAFA] font-sans"
                      >
                        Mon profil
                      </Link>
                      <Link
                        href="/"
                        target="_blank"
                        className="block w-full text-left px-3 py-1.5 text-xs text-[#0D2626] hover:bg-[#F5FAFA] font-sans"
                      >
                        Voir le site étudiant
                      </Link>
                      <div className="h-[1px] bg-[rgba(10,61,61,0.06)] my-1" />
                      <button
                        onClick={() => {
                          setShowAvatarMenu(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 font-sans cursor-pointer"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Main content body */}
          <main className="pt-[52px] lg:pt-[52px] bg-[#F5FAFA] min-h-screen w-full">
            <div className="p-4 sm:p-6 lg:p-7 max-w-[1280px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
