"use client";

import React, { useState } from "react";
import { Search, UserPlus, ShieldAlert, Award, MessageSquare, Swords } from "lucide-react";
import { useAgoraStore } from "@/store/useAgoraStore";

export default function FriendsPage() {
  const { createRoom } = useAgoraStore();
  const [searchTerm, setSearchTerm] = useState("");

  const friends = [
    { id: "1", name: "Amine Khelifi", university: "Faculté d'Alger", points: 940, status: "online", rank: 4 },
    { id: "2", name: "Sarah Berrada", university: "Faculté d'Oran", points: 1200, status: "online", rank: 2 },
    { id: "3", name: "Ryad Mahour", university: "Faculté d'Alger", points: 810, status: "offline", rank: 9 },
    { id: "4", name: "Karima Tali", university: "Faculté de Constantine", points: 650, status: "offline", rank: 14 },
  ];

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header section with friend search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-teal/10 pb-4">
        <div>
          <h1 className="text-xl font-bold text-text-dark">Camarades d'Études</h1>
          <p className="text-xs text-text-light">Défiez vos amis dans l'arène ou apprenez en groupe.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Rechercher un camarade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-text-light/50" />
        </div>
      </div>

      {/* Friends list grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFriends.map((friend) => (
          <div key={friend.id} className="p-4 rounded-xl border border-teal/10 bg-white-custom flex items-center justify-between shadow-sm hover:shadow-md hover:border-teal/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-teal/10 text-teal-dark flex items-center justify-center font-bold text-sm">
                  {friend.name.charAt(0)}
                </div>
                <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white-custom ${
                  friend.status === "online" ? "bg-teal-light" : "bg-text-light/40"
                }`} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-dark">{friend.name}</h4>
                <p className="text-[10px] text-text-light mt-0.5">{friend.university}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-mono text-text-light flex items-center gap-1">
                    <Award className="h-3 w-3 text-teal" /> {friend.points} XP
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={createRoom}
                disabled={friend.status !== "online"}
                className={`p-2 rounded-lg border transition-all ${
                  friend.status === "online"
                    ? "border-accent/20 bg-accent/5 text-accent hover:bg-accent/10 hover:border-accent cursor-pointer"
                    : "border-teal/5 bg-surface/20 text-text-light/45 cursor-not-allowed"
                }`}
                title="Défier dans MedQuest"
              >
                <Swords className="h-3.5 w-3.5" />
              </button>
              <button className="p-2 rounded-lg border border-teal/10 text-teal hover:bg-surface/30 transition-all">
                <MessageSquare className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
