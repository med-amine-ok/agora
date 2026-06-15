"use client";

import React, { useState, useEffect } from "react";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import { useUserStore } from "@/presentation/store/useUserStore";
import { useRoomStore } from "@/presentation/store/useRoomStore";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  UserPlus,
  Check,
  X,
  Zap,
  Flame,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FriendsPage() {
  const router = useRouter();
  const {
    user,
    friends,
    pendingRequests,
    loadFriends,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest
  } = useUserStore();

  const { createRoom } = useRoomStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchedUser, setSearchedUser] = useState<any | null>(null);
  const [searchSuccess, setSearchSuccess] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);
  const [challengeAlert, setChallengeAlert] = useState("");

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedUser(null);
    setSearchSuccess(false);
    setSearchError("");

    if (!searchTerm.trim()) return;
    setSearching(true);

    try {
      // Simulate API search in our mock database
      const mockUsers = [
        { id: "u2", name: "Meriem Bensalah", username: "meriem_b", university: "Faculté d'Alger", yearOfStudy: 5, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Meriem" },
        { id: "u3", name: "Youcef Khelifi", username: "youcef_k", university: "Faculté d'Alger", yearOfStudy: 6, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Youcef" },
        { id: "u4", name: "Lina Chaoui", username: "lina_ch", university: "Faculté de Constantine", yearOfStudy: 4, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Lina" },
        { id: "u5", name: "Ali Larbi", username: "ali_l", university: "Faculté d'Oran", yearOfStudy: 5, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ali" }
      ];

      const match = mockUsers.find(
        (u) => u.username.toLowerCase() === searchTerm.trim().toLowerCase()
      );

      if (match) {
        if (friends.some(f => f.id === match.id)) {
          setSearchError("Cette personne fait déjà partie de vos amis.");
        } else if (match.id === user?.id) {
          setSearchError("Vous ne pouvez pas vous ajouter vous-même.");
        } else {
          setSearchedUser(match);
        }
      } else {
        setSearchError("Aucun étudiant trouvé avec ce nom d'utilisateur.");
      }
    } catch (err) {
      setSearchError("Une erreur est survenue lors de la recherche.");
    } finally {
      setSearching(false);
    }
  };

  const handleAddSearchedFriend = async () => {
    if (!searchedUser) return;
    try {
      const sent = await sendFriendRequest(searchedUser.username);
      if (sent) {
        setSearchSuccess(true);
        setSearchTerm("");
        setTimeout(() => {
          setSearchedUser(null);
          setSearchSuccess(false);
        }, 2500);
      } else {
        setSearchError("Impossible d'envoyer la demande.");
      }
    } catch (err) {
      setSearchError("Une erreur est survenue.");
    }
  };

  const handleChallenge = async (friend: any) => {
    if (!user) return;
    try {
      // Auto-create a Cardiologie room and redirect to game/lobby
      const roomId = await createRoom("Cardiologie", 5, 2, user);
      setChallengeAlert(`Salon créé ! Invitation envoyée à ${friend.name}. Redirection...`);
      setTimeout(() => {
        router.push(`/medquest/room/${roomId}/lobby`);
      }, 1500);
    } catch (err) {
      alert("Erreur lors de l'envoi du défi.");
    }
  };

  return (
    <SidebarLayout>
      <div className="space-y-8 pb-16 select-none">
        
        {/* Header */}
        <div className="border-b border-border-brand pb-4">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-green-dark flex items-center gap-2">
            <Users className="w-8 h-8 text-green-mid" /> Liste des Contacts & Amis
          </h1>
          <p className="text-text-mid text-sm mt-1">
            Gérez vos demandes d'amis, recherchez de nouveaux collègues et défiez-les.
          </p>
        </div>

        {/* Global Challenge notification */}
        <AnimatePresence>
          {challengeAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-accent-brand text-white px-6 py-4 rounded-sm shadow-md flex items-center justify-between gap-4 font-sans font-semibold text-sm"
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
          
          {/* Left Panel: Search & Requests (2/5) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Search Card */}
            <Card className="p-6">
              <h3 className="font-bold text-green-dark text-sm border-b border-border-brand/40 pb-3 mb-4 flex items-center gap-2">
                <Search className="w-4.5 h-4.5 text-green-mid" /> Rechercher un étudiant
              </h3>
              
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nom d'utilisateur (ex: ali_l)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 py-2 border border-border-brand rounded-sm text-sm bg-white-brand text-text-dark focus:outline-none focus:border-green-mid font-mono"
                />
                <Button type="submit" size="sm" disabled={searching}>
                  {searching ? "..." : "Chercher"}
                </Button>
              </form>

              {searchError && (
                <div className="mt-3 flex items-center gap-2 text-xs text-error-brand font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{searchError}</span>
                </div>
              )}

              {/* Searched Friend output */}
              {searchedUser && (
                <div className="mt-4 p-3 bg-beige-light border border-border-brand/40 rounded-sm flex items-center justify-between gap-4 animate-slide-up">
                  <div className="flex items-center gap-3">
                    <img src={searchedUser.avatar} alt={searchedUser.name} className="w-8 h-8 rounded-full bg-green-dark/5" />
                    <div>
                      <span className="text-xs font-bold text-text-dark block">{searchedUser.name}</span>
                      <span className="text-[10px] text-text-light block font-mono">
                        @{searchedUser.username} • {searchedUser.yearOfStudy}e Année
                      </span>
                    </div>
                  </div>
                  {searchSuccess ? (
                    <span className="text-xs text-green-mid font-bold flex items-center gap-1">
                      <Check className="w-4.5 h-4.5" /> Envoyé !
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleAddSearchedFriend}
                      className="py-1 px-3 text-xs flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Ajouter
                    </Button>
                  )}
                </div>
              )}
            </Card>

            {/* Pending Requests */}
            <Card className="p-6">
              <h3 className="font-bold text-green-dark text-sm border-b border-border-brand/40 pb-3 mb-4 flex items-center justify-between">
                <span>Demandes d'amis</span>
                <span className="text-xs bg-surface-brand text-green-dark px-2.5 py-0.5 rounded-full font-mono font-bold">
                  {pendingRequests.length}
                </span>
              </h3>
              
              {pendingRequests.length === 0 ? (
                <p className="text-xs text-text-light text-center py-4 font-semibold">Aucune demande en attente.</p>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-3 bg-white-brand border border-border-brand/35 rounded-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={req.avatar} alt={req.name} className="w-8 h-8 rounded-full bg-green-dark/5 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-text-dark block truncate">{req.name}</span>
                          <span className="text-[9px] text-text-light block font-mono truncate">@{req.username}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => acceptFriendRequest(req.id)}
                          className="p-1.5 bg-green-mid text-white rounded-sm hover:bg-green-dark transition-colors"
                          title="Accepter"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => rejectFriendRequest(req.id)}
                          className="p-1.5 border border-border-brand text-text-light rounded-sm hover:bg-gray-50 transition-colors"
                          title="Refuser"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right Panel: Friend Grid list (3/5) */}
          <div className="lg:col-span-3">
            <Card className="p-6 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-border-brand/40 pb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-green-dark uppercase tracking-wider font-mono">Mes Amis Connectés ({friends.length})</span>
                </div>

                {friends.length === 0 ? (
                  <div className="text-center py-12 text-text-light space-y-2">
                    <span className="text-4xl block">👥</span>
                    <p className="text-sm font-semibold">Vous n'avez pas encore d'amis ajoutés.</p>
                    <p className="text-xs max-w-xs mx-auto text-text-mid leading-relaxed">
                      Utilisez le formulaire de recherche à gauche pour envoyer une demande d'ami par nom d'utilisateur.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {friends.map((friend) => {
                      // Mock active statuses: we can randomize online state for rendering variety
                      const isOnline = friend.role === "admin" || friend.streak > 5;
                      const studyState = friend.points > 1000 ? "in-blitz" : "studying";

                      return (
                        <div
                          key={friend.id}
                          className="p-3.5 border border-border-brand/50 rounded-sm bg-white-brand flex items-center justify-between gap-3 hover:shadow-sm transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative shrink-0">
                              <img
                                src={friend.avatar}
                                alt={friend.name}
                                className="w-10 h-10 rounded-full border border-green-light/10 bg-green-dark/5"
                              />
                              {isOnline && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-light border-2 border-white rounded-full animate-pulse" />
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold truncate text-text-dark">{friend.name}</span>
                              <span className="text-[10px] text-text-light truncate font-mono">@{friend.username}</span>
                              <span className="text-[9px] text-accent-brand font-semibold flex items-center gap-0.5 mt-0.5">
                                <Flame className="w-3 h-3 fill-accent-brand" /> {friend.streak}j streak
                              </span>
                            </div>
                          </div>
                          
                          {isOnline ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleChallenge(friend)}
                              className="py-1.5 px-3 text-[10px] shrink-0 font-bold uppercase tracking-wider flex items-center gap-1.5"
                            >
                              <Zap className="w-3.5 h-3.5 text-green-mid fill-green-mid" /> Défier
                            </Button>
                          ) : (
                            <span className="text-[9px] text-text-light font-bold uppercase font-mono tracking-wider shrink-0">Hors ligne</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
