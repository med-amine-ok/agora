"use client";

import React, { useEffect, useState, useRef } from "react";
import { Search, Book, Trophy, BarChart3, User, Shield, Terminal, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  url: string;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const commands: CommandItem[] = [
    { id: "lessons", title: "Accéder au parcours de leçons", category: "Navigation", icon: <Book className="h-4 w-4" />, url: "/lessons" },
    { id: "quest", title: "Arènes MedQuest", category: "Navigation", icon: <Trophy className="h-4 w-4" />, url: "/medquest" },
    { id: "stats", title: "Analyses & statistiques détaillées", category: "Navigation", icon: <BarChart3 className="h-4 w-4" />, url: "/statistics" },
    { id: "auth", title: "Se connecter / Changer de rôle", category: "Compte", icon: <User className="h-4 w-4" />, url: "/auth/login" },
    { id: "admin", title: "Portail Administrateur", category: "Gestion", icon: <Shield className="h-4 w-4" />, url: "/admin" },
  ];

  const filteredCommands = commands.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    router.push(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleSelect(filteredCommands[selectedIndex].url);
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal/15 bg-white-custom/80 hover:bg-white-custom hover:border-teal/30 transition-all text-xs font-medium text-text-light"
      >
        <Search className="h-3.5 w-3.5 text-teal" />
        <span>Rechercher sur Agora...</span>
        <kbd className="ml-2 px-1.5 py-0.5 rounded bg-surface/50 border border-teal/10 font-mono text-[9px] uppercase">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-teal-dark/30 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-xl overflow-hidden rounded-xl border border-teal/20 bg-white-custom shadow-2xl z-10"
            >
              {/* Input wrapper */}
              <div className="flex items-center gap-3 border-b border-teal/10 px-4 py-3 bg-surface/20">
                <Search className="h-5 w-5 text-teal" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Que recherchez-vous ?"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent text-sm text-text-dark placeholder-text-light/60 outline-none"
                />
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-surface/50 border border-teal/10 font-mono text-[9px] text-text-light">
                  ÉCHAP
                </kbd>
              </div>

              {/* Suggestions */}
              <div className="max-h-[300px] overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-text-light">
                    <Terminal className="h-8 w-8 stroke-[1.5] mb-2 opacity-40 text-teal" />
                    <p className="text-sm font-medium">Aucun résultat trouvé</p>
                    <p className="text-xs text-text-light/60">Essayez de chercher &quot;leçons&quot; ou &quot;blitz&quot;</p>
                  </div>
                ) : (
                  filteredCommands.map((command, idx) => (
                    <button
                      key={command.id}
                      onClick={() => handleSelect(command.url)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all ${
                        idx === selectedIndex
                          ? "bg-teal text-white-custom"
                          : "text-text"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={idx === selectedIndex ? "text-white-custom" : "text-teal"}>
                          {command.icon}
                        </span>
                        <div>
                          <p className="text-xs font-semibold">{command.title}</p>
                          <p className={`text-[10px] ${idx === selectedIndex ? "text-white-custom/75" : "text-text-light"}`}>
                            {command.category}
                          </p>
                        </div>
                      </div>
                      {idx === selectedIndex && (
                        <ArrowRight className="h-3.5 w-3.5 text-white-custom" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
