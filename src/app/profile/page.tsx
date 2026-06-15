"use client";

import React, { useState } from "react";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import { useUserStore } from "@/presentation/store/useUserStore";
import {
  User,
  GraduationCap,
  Building2,
  Calendar,
  Flame,
  Award,
  Users,
  Search,
  UserPlus,
  Zap,
  Check,
  X,
  Plus,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const { user, friends, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } = useUserStore();

  // Search input state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedUser, setSearchedUser] = useState<{ name: string; username: string; university: string; year: number } | null>(null);
  const [searchSuccess, setSearchSuccess] = useState(false);

  // Edit profile state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editUni, setEditUni] = useState(user?.university || "");
  const [editYear, setEditYear] = useState(user?.yearOfStudy || 5);

  // Challenges alert
  const [challengeAlert, setChallengeAlert] = useState("");

  // Pending Friend Requests mock database
  const [pendingRequests, setPendingRequests] = useState([
    { id: "p-req-1", name: "Ines Meddah", username: "ines_m", university: "Faculté d'Alger", year: 4 }
  ]);

  // Achievement badges mock database
  const achievements = [
    { id: "a1", name: "Premier Pas", desc: "A complété son premier QCM", icon: "🌱", unlocked: true },
    { id: "a2", name: "Savant de Garde", desc: "10 bonnes réponses consécutives", icon: "🧠", unlocked: true },
    { id: "a3", name: "Phénix d'Alger", desc: "A maintenu un streak de 14 jours", icon: "🔥", unlocked: true },
    { id: "a4", name: "Maître de Salle", desc: "A remporté 5 duels multijoueurs", icon: "👑", unlocked: false },
    { id: "a5", name: "Génie Clinique", desc: "Précision globale supérieure à 90%", icon: "🎯", unlocked: false }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedUser(null);
    setSearchSuccess(false);

    if (!searchTerm.trim()) return;

    // Simulate database username lookups
    const mockUsers = [
      { name: "Samy Benmessaoud", username: "samy_ben", university: "Faculté d'Oran", year: 5 },
      { name: "Feriel Chaouch", username: "feriel_ch", university: "Faculté d'Alger", year: 6 },
      { name: "Ryad Kaced", username: "ryad_k", university: "Faculté de Constantine", year: 4 }
    ];

    const match = mockUsers.find(
      (u) => u.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (match) {
      setSearchedUser(match);
    } else {
      setSearchedUser(null);
    }
  };

  const handleAddSearchedFriend = async () => {
    if (!searchedUser) return;
    const added = await sendFriendRequest(searchedUser.username);
    if (added) {
      setSearchSuccess(true);
      setSearchTerm("");
      setTimeout(() => {
        setSearchedUser(null);
        setSearchSuccess(false);
      }, 2000);
    }
  };

  const handleAcceptPending = async (reqId: string, username: string) => {
    await acceptFriendRequest(reqId);
    setPendingRequests((prev) => prev.filter((r) => r.id !== reqId));
  };

  const handleDeclinePending = async (reqId: string) => {
    await rejectFriendRequest(reqId);
    setPendingRequests((prev) => prev.filter((r) => r.id !== reqId));
  };

  const handleChallenge = (friendName: string) => {
    setChallengeAlert(`Défi MedQuest lancé à ${friendName} ! Rejoignez la salle AX7K2M.`);
    setTimeout(() => setChallengeAlert(""), 4000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      useUserStore.setState({
        user: {
          ...user,
          name: editName,
          university: editUni,
          yearOfStudy: Number(editYear)
        }
      });
    }
    setIsEditOpen(false);
  };

  return (
    <SidebarLayout>
      <div className="space-y-8 pb-16">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-brand pb-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-teal-dark">Mon Espace Personnel</h1>
            <p className="text-text-mid text-sm mt-1">
              Gérez votre profil, suivez vos succès et défiez vos collègues de promotion.
            </p>
          </div>
        </div>

        {/* Global Challenge notification */}
        <AnimatePresence>
          {challengeAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-accent-brand text-white px-6 py-4 rounded-sm shadow-md flex items-center justify-between gap-4 font-sans font-semibold text-sm animate-pulse"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 fill-white" />
                <span>{challengeAlert}</span>
              </div>
              <button onClick={() => setChallengeAlert("")} className="cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column: Personal info summary (2/5) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 border-teal-light/20 flex flex-col items-center text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-surface-brand/20 rounded-full blur-2xl pointer-events-none" />

              {/* Avatar block with hover upload overlay */}
              <div className="relative group w-24 h-24 rounded-full border-2 border-teal select-none overflow-hidden bg-teal-dark/5">
                <img
                  src={user?.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=Mohamed"}
                  alt="Avatar profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-teal-dark/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold uppercase transition-opacity cursor-pointer">
                  Changer
                </div>
              </div>

              {/* Identity details */}
              <div className="space-y-1 w-full">
                <h2 className="font-serif text-2xl font-bold text-teal-dark truncate">
                  {user?.name}
                </h2>
                <span className="font-mono text-xs text-text-light block">@{user?.username}</span>
              </div>

              <div className="w-full border-t border-border-brand/40 pt-4 space-y-3 text-sm text-text-mid text-left">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4.5 h-4.5 text-teal shrink-0" />
                  <span>{user?.yearOfStudy}e Année (Secteur Clinique)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-4.5 h-4.5 text-teal shrink-0" />
                  <span className="truncate">{user?.university}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4.5 h-4.5 text-teal shrink-0" />
                  <span>Membre depuis : Octobre 2025</span>
                </div>
              </div>

              <Button onClick={() => setIsEditOpen(true)} variant="outline" className="w-full py-2.5">
                Modifier le profil
              </Button>
            </Card>

            {/* Streak records widget */}
            <Card className="p-6 border-accent-brand/10">
              <h3 className="font-bold text-teal-dark font-sans flex items-center gap-2 border-b border-border-brand/40 pb-3 mb-4">
                <Flame className="w-5 h-5 text-accent-brand fill-accent-brand" />
                Records de Streak
              </h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-surface-brand/30 p-4 border border-teal-light/10 rounded-sm">
                  <span className="text-[10px] text-text-light uppercase tracking-wider block font-bold font-mono">Streak Actuel</span>
                  <span className="font-mono text-2xl font-extrabold text-teal-dark block mt-1">
                    {user?.streak} jours
                  </span>
                </div>
                <div className="bg-orange-50/30 p-4 border border-accent-brand/10 rounded-sm">
                  <span className="text-[10px] text-text-light uppercase tracking-wider block font-bold font-mono">Record Absolu</span>
                  <span className="font-mono text-2xl font-extrabold text-accent-brand block mt-1">
                    22 jours
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Social details & Achievements (3/5) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Pending Requests checklist */}
            {pendingRequests.length > 0 && (
              <Card className="p-6 border-teal/20 bg-teal/5 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-teal/10 pb-3 mb-4">
                  <h3 className="font-bold text-teal-dark font-sans text-sm uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-5 h-5 text-teal" /> Demandes en attente
                  </h3>
                </div>
                <div className="space-y-3">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-white-brand border border-teal-light/20 rounded-sm shadow-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${req.name}`}
                          alt={req.name}
                          className="w-8 h-8 rounded-full bg-teal-dark/5"
                        />
                        <div>
                          <span className="text-xs font-bold text-text-dark block">{req.name}</span>
                          <span className="text-[10px] text-text-light block font-mono">@{req.username} • {req.university}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptPending(req.id, req.username)}
                          className="py-1 px-3 text-xs bg-teal text-white flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Accepter
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeclinePending(req.id)}
                          className="py-1 px-2.5 text-xs text-text-light"
                        >
                          <X className="w-3.5 h-3.5" /> Refuser
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Friend search bar */}
            <Card className="p-6">
              <h3 className="font-bold text-teal-dark font-sans flex items-center gap-2 border-b border-border-brand/40 pb-3 mb-4">
                <Search className="w-5 h-5 text-teal" /> Ajouter un camarade
              </h3>
              
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Rechercher par @username (ex: samy_ben, feriel_ch)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 border border-border-brand rounded-sm text-sm bg-white-brand text-text-dark focus:outline-none focus:border-teal"
                />
                <Button type="submit" className="py-2.5 px-5"> Rechercher </Button>
              </form>

              {/* Searched Friend output row */}
              {searchedUser && (
                <div className="mt-4 p-3 bg-gray-50 border border-border-brand rounded-sm flex items-center justify-between gap-4 animate-slide-up">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-dark/5 flex items-center justify-center font-bold text-teal font-serif">
                      {searchedUser.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-text-dark block">{searchedUser.name}</span>
                      <span className="text-[10px] text-text-light block font-mono">
                        @{searchedUser.username} • {searchedUser.year}e Année • {searchedUser.university}
                      </span>
                    </div>
                  </div>
                  {searchSuccess ? (
                    <span className="text-xs text-teal font-bold flex items-center gap-1">
                      <Check className="w-4.5 h-4.5" /> Ajouté !
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleAddSearchedFriend}
                      className="py-1 px-3 text-xs flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Ajouter
                    </Button>
                  )}
                </div>
              )}
            </Card>

            {/* Friend List summary cards */}
            <Card className="p-6">
              <h3 className="font-bold text-teal-dark font-sans flex items-center gap-2 border-b border-border-brand/40 pb-3 mb-4">
                <Users className="w-5 h-5 text-teal" /> Liste des amis
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {friends.map((friend: any) => (
                  <div
                    key={friend.id}
                    className="p-3 border border-border-brand/60 rounded-sm bg-white-brand flex items-center justify-between gap-3 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${friend.name}`}
                          alt={friend.name}
                          className="w-9 h-9 rounded-full bg-teal-dark/5"
                        />
                        {friend.online && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-teal-light border-2 border-white rounded-full animate-pulse" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold truncate text-text-dark">{friend.name}</span>
                        <span className="text-[10px] text-text-light truncate font-mono">@{friend.username}</span>
                      </div>
                    </div>
                    
                    {friend.online ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleChallenge(friend.name)}
                        className="py-1 px-2.5 text-[10px] shrink-0 font-bold uppercase tracking-wider flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3 text-teal fill-teal" /> Défier
                      </Button>
                    ) : (
                      <span className="text-[9px] text-text-light font-bold uppercase font-mono tracking-wider shrink-0">Hors ligne</span>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Locked / Unlocked Achievement Badges */}
            <Card className="p-6">
              <h3 className="font-bold text-teal-dark font-sans flex items-center gap-2 border-b border-border-brand/40 pb-3 mb-4">
                <Award className="w-5 h-5 text-accent-brand" />
                Badges de Réussite
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className={`flex flex-col items-center justify-center p-3.5 border rounded-sm text-center relative group transition-all select-none ${
                      ach.unlocked
                        ? "bg-white-brand border-teal-light/20 hover:border-teal hover:shadow-sm"
                        : "bg-gray-50/50 border-dashed border-border-brand/50 opacity-55"
                    }`}
                  >
                    <span className="text-3xl mb-2">{ach.icon}</span>
                    <span className="text-[11px] font-bold text-teal-dark truncate w-full">{ach.name}</span>

                    {/* Simple Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 bg-teal-dark text-white text-[10px] leading-relaxed p-2 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md z-10 border border-white/5">
                      {ach.desc}
                      {!ach.unlocked && <span className="block mt-1 font-bold text-accent-brand font-mono">🔒 Verrouillé</span>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Form Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-teal-dark/60 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />
          <form
            onSubmit={handleSaveProfile}
            className="relative w-full max-w-md bg-white-brand rounded-lg shadow-xl border border-border-brand p-6 z-10 space-y-4"
          >
            <h3 className="text-xl font-semibold text-teal-dark border-b border-border-brand pb-2">
              Modifier mes informations
            </h3>
            
            <div className="space-y-3 font-sans text-sm">
              <div className="space-y-1">
                <label className="block font-semibold text-text-dark">Nom complet</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 border border-border-brand rounded-sm bg-white-brand text-text-dark focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-text-dark">Faculté / Université</label>
                <input
                  type="text"
                  value={editUni}
                  onChange={(e) => setEditUni(e.target.value)}
                  className="w-full p-2 border border-border-brand rounded-sm bg-white-brand text-text-dark focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-text-dark">Année d'étude</label>
                <select
                  value={editYear}
                  onChange={(e) => setEditYear(Number(e.target.value))}
                  className="w-full p-2 border border-border-brand rounded-sm bg-white-brand text-text-dark focus:outline-none appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}e Année (Clinique / Résidanat)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEditOpen(false)}>
                Fermer
              </Button>
              <Button type="submit" size="sm">
                Enregistrer
              </Button>
            </div>
          </form>
        </div>
      )}
    </SidebarLayout>
  );
}
