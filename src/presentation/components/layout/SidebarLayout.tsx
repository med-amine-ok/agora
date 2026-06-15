"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/presentation/store/useUserStore";
import { useQuizStore } from "@/presentation/store/useQuizStore";
import {
  LayoutDashboard,
  BookOpen,
  Zap,
  BarChart3,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Flame,
  ShieldCheck,
  Bell
} from "lucide-react";
import Button from "../ui/Button";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loadFriends } = useUserStore();
  const { resetSession } = useQuizStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadFriends();
  }, []);

  const menuItems = [
    { name: "Tableau de Bord", href: "/dashboard", icon: LayoutDashboard },
    { name: "Leçons", href: "/lessons", icon: BookOpen },
    { name: "MedQuest", href: "/medquest", icon: Zap },
    { name: "Statistiques", href: "/statistics", icon: BarChart3 },
    { name: "Profil & Amis", href: "/profile", icon: User },
  ];

  const handleLogout = () => {
    logout();
    resetSession();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-beige-base text-text-dark font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-green-dark text-white border-b border-white/5 z-30">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-green-light">Agora</span>
        </Link>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full text-xs font-mono font-bold animate-bounce-streak">
              🔥 {user.streak}
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-white/80 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar - Desktop / Tablet */}
      <aside className="hidden md:flex flex-col w-[72px] xl:w-[260px] bg-green-dark text-white/90 border-r border-white/5 shrink-0 select-none transition-all duration-300">
        {/* Top Branding & Profile */}
        <div className="p-6 border-b border-white/5 flex flex-col items-center xl:items-start gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 select-none">
            <span className="font-serif text-3xl font-bold tracking-wider text-green-light">Agora</span>
          </Link>

          {/* User Info (Expanded on large screens) */}
          {user && (
            <div className="hidden xl:flex flex-col gap-2 bg-white/5 p-4 rounded-md w-full border border-white/5 mt-2">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border border-green-light/40 bg-green-dark/50 shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold truncate text-white">{user.name}</span>
                  <span className="text-xs text-green-light/75 truncate font-mono">
                    {user.yearOfStudy}e Année
                  </span>
                </div>
              </div>
              
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="mt-2 text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-1 rounded-sm text-center flex items-center justify-center gap-1 hover:bg-amber-500/30 transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Espace Admin
                </Link>
              )}
            </div>
          )}

          {/* User Avatar (Collapsed on mid screens) */}
          {user && (
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`}
              alt="Avatar"
              className="xl:hidden w-10 h-10 rounded-full border border-green-light/40 bg-green-dark/50"
            />
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-center xl:justify-start gap-4 px-4 py-3.5 rounded-sm transition-all relative ${
                  isActive
                    ? "bg-beige-base text-green-dark font-semibold border-l-4 border-green-mid shadow-md"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-5.5 h-5.5 shrink-0 ${isActive ? "text-green-mid" : "text-white/60"}`} />
                <span className="hidden xl:block text-sm tracking-wide">{item.name}</span>

                {item.name === "Tableau de Bord" && user && user.streak > 0 && (
                  <span className="hidden xl:inline-flex absolute right-4 items-center justify-center bg-orange-500 text-white text-[10px] font-bold font-mono px-2 py-0.5 rounded-full animate-bounce-streak">
                    🔥 {user.streak}j
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center justify-center xl:justify-start gap-4 w-full px-4 py-3 rounded-sm text-white/60 hover:text-white hover:bg-white/5 text-left transition-colors cursor-pointer"
          >
            <Settings className="w-5 h-5 shrink-0" />
            <span className="hidden xl:block text-sm">Paramètres</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center xl:justify-start gap-4 w-full px-4 py-3 rounded-sm text-red-300 hover:text-white hover:bg-red-950/20 text-left transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="hidden xl:block text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-green-dark/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex flex-col w-4/5 max-w-xs bg-green-dark text-white p-6 z-50">
            <div className="flex items-center justify-between mb-8">
              <span className="font-serif text-2xl font-bold tracking-tight text-green-light">Agora</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6 text-white/80" />
              </button>
            </div>

            {user && (
              <div className="flex flex-col gap-2 bg-white/5 p-3 rounded-md w-full border border-white/5 mb-6">
                <div className="flex items-center gap-3">
                  <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full bg-green-dark/50" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold truncate text-white">{user.name}</span>
                    <span className="text-xs text-green-light truncate">{user.university}</span>
                  </div>
                </div>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 py-1 rounded-sm text-center"
                  >
                    Espace Admin
                  </Link>
                )}
              </div>
            )}

            <nav className="flex-1 space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-sm ${
                      isActive ? "bg-beige-base text-green-dark font-semibold" : "text-white/80 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-green-light" />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-2 border-t border-white/5 pt-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSettingsOpen(true);
                }}
                className="flex items-center gap-4 w-full px-4 py-3 rounded-sm text-white/80 hover:bg-white/5 text-left cursor-pointer"
              >
                <Settings className="w-5 h-5 text-green-light" />
                <span className="text-sm">Paramètres</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-4 w-full px-4 py-3 rounded-sm text-red-400 hover:bg-red-950/20 text-left cursor-pointer"
              >
                <LogOut className="w-5 h-5 text-red-400" />
                <span className="text-sm">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-beige-base overflow-y-auto pb-20 md:pb-0">
        <div className="flex-1 p-6 md:p-10 max-w-[1200px] w-full mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Bar navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-green-dark border-t border-white/5 flex items-center justify-around z-30 px-2">
        {menuItems.slice(0, 4).map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-12 rounded-sm transition-colors ${
                isActive ? "text-green-light" : "text-white/60 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-sans truncate max-w-full text-center">
                {item.name.split(" ")[0]}
              </span>
            </Link>
          );
        })}
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center w-16 h-12 rounded-sm transition-colors ${
            pathname.startsWith("/profile") ? "text-green-light" : "text-white/60 hover:text-white"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-sans">Profil</span>
        </Link>
      </div>

      {/* Settings Dialog */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-green-dark/65 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)} />
          <div className="relative w-full max-w-md bg-beige-light rounded-lg shadow-xl border border-border-brand p-6 z-10">
            <h3 className="text-xl font-semibold text-green-dark mb-4 border-b border-border-brand pb-2">
              Paramètres de l'application
            </h3>
            <div className="space-y-4 font-sans text-sm text-text-mid">
              <div>
                <label className="block font-semibold mb-1 text-text-dark">Sons de réussite</label>
                <div className="flex items-center gap-3 mt-1">
                  <input type="checkbox" id="sound" defaultChecked className="accent-green-mid h-4 w-4" />
                  <label htmlFor="sound">Activer le signal sonore pour les réponses correctes</label>
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-text-dark">Notifications</label>
                <div className="flex items-center gap-3 mt-1">
                  <input type="checkbox" id="notif" defaultChecked className="accent-green-mid h-4 w-4" />
                  <label htmlFor="notif">Recevoir un rappel quotidien par e-mail</label>
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-text-dark">Langue du système</label>
                <select className="w-full mt-1 p-2 border border-border-brand rounded-sm bg-white text-text-dark focus:outline-none focus:border-green-mid">
                  <option>Français (Actif)</option>
                  <option disabled>Arabe (Bientôt)</option>
                  <option disabled>Anglais (Bientôt)</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button variant="outline" size="sm" onClick={() => setIsSettingsOpen(false)}>
                  Fermer
                </Button>
                <Button size="sm" onClick={() => setIsSettingsOpen(false)}>
                  Enregistrer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarLayout;
