"use client";

import React, { useState } from "react";
import Footer from "@/components/Footer";
import { useAgoraStore } from "@/store/useAgoraStore";
import { Users, Send, CheckCircle2, ArrowLeft, ShieldAlert, Award } from "lucide-react";
import Link from "next/link";

interface RoomQuestion {
  text: string;
  options: string[];
  correctIndex: number;
}

const mockRoomQuestions: RoomQuestion[] = [
  {
    text: "Un patient présente une douleur épigastrique aiguë irradiant vers le dos, avec amylase et lipase sériques élevées. Quel est le diagnostic le plus probable ?",
    options: ["Cholécystite aiguë", "Pancréatite aiguë", "Ulcère peptique perforé", "Infarctus du myocarde"],
    correctIndex: 1,
  }
];

export default function MedQuestRoomPage() {
  const { roomCode, players, chatMessages, addChatMessage, updatePlayerScore } = useAgoraStore();
  const [chatInput, setChatInput] = useState("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const activeQuestion = mockRoomQuestions[0];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    addChatMessage("Yanis Meziani (Vous)", chatInput);
    setChatInput("");
  };

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);

    const isCorrect = idx === activeQuestion.correctIndex;
    if (isCorrect) {
      updatePlayerScore("self", 120);
    }
  };

  if (!roomCode) {
    return (
      <>
        <main className="relative z-10 flex-grow max-w-md mx-auto px-4 pt-28 pb-16 w-full flex flex-col justify-center min-h-[70vh] text-center space-y-4">
          <div className="p-6 rounded-2xl border border-error/20 bg-error/5 text-error">
            <ShieldAlert className="h-10 w-10 mx-auto mb-3" />
            <h2 className="font-bold text-sm">Aucune session MedQuest active</h2>
            <p className="text-xs mt-1">Revenez aux arènes pour rejoindre ou créer un salon multijoueur.</p>
          </div>
          <Link href="/medquest" className="text-xs font-semibold text-teal hover:underline">
            Retour aux salons MedQuest
          </Link>
        </main>
         
      </>
    );
  }

  return (
    <>
      <main className="relative z-10 flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left column: Player Rankings Leaderboard */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border-b border-teal/10 pb-3 flex items-center justify-between">
            <h2 className="text-xs uppercase font-mono tracking-wider font-bold text-teal-dark flex items-center gap-1.5">
              <Users className="h-4 w-4" /> JOUEURS DU SALON
            </h2>
            <span className="px-2 py-0.5 rounded bg-surface text-teal-dark text-[9px] font-mono font-bold uppercase tracking-wider">
              CODE: {roomCode}
            </span>
          </div>

          <div className="space-y-3">
            {players
              .sort((a, b) => b.score - a.score)
              .map((player) => (
                <div
                  key={player.id}
                  className={`p-3 rounded-xl border flex items-center justify-between shadow-sm transition-all ${
                    player.id === "self"
                      ? "border-teal bg-teal/5"
                      : "border-teal/10 bg-white-custom"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-teal-dark text-white-custom flex items-center justify-center font-bold text-xs">
                      {player.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-dark">{player.name}</p>
                      <p className="text-[9px] text-text-light font-mono">
                        {player.isReady ? "Prêt" : "En attente"}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-teal-dark">
                    {player.score} pts
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Center columns: Active Question Arena */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-md space-y-6">
            <div>
              <span className="px-2.5 py-0.5 rounded bg-surface/50 text-teal-dark text-[9px] uppercase font-mono tracking-wider font-semibold">
                Partie multijoueur active
              </span>
              <h2 className="font-display text-lg font-bold text-text-dark mt-2">
                {activeQuestion.text}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {activeQuestion.options.map((opt, oIdx) => {
                const selected = selectedOption === oIdx;
                const correct = activeQuestion.correctIndex === oIdx;

                let btnStyle = "border-teal/12 bg-white-custom hover:bg-surface/10 text-text-dark";
                if (selected) {
                  btnStyle = "border-teal bg-teal/5 text-teal font-semibold";
                }
                if (selectedOption !== null) {
                  if (correct) {
                    btnStyle = "border-success bg-success/5 text-success font-semibold";
                  } else if (selected) {
                    btnStyle = "border-error bg-error/5 text-error font-semibold";
                  } else {
                    btnStyle = "border-teal/5 opacity-55 text-text-light";
                  }
                }

                return (
                  <button
                    key={oIdx}
                    disabled={selectedOption !== null}
                    onClick={() => handleSelect(oIdx)}
                    className={`w-full p-4 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Real-time Chat Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border-b border-teal/10 pb-3">
            <h2 className="text-xs uppercase font-mono tracking-wider font-bold text-teal-dark">
              DISCUSSION EN DIRECT
            </h2>
          </div>

          <div className="rounded-2xl border border-teal/10 bg-white-custom flex flex-col h-[350px] shadow-md overflow-hidden justify-between">
            {/* Messages box */}
            <div className="p-4 space-y-3 overflow-y-auto flex-grow text-xs">
              {chatMessages.length === 0 ? (
                <div className="text-center text-text-light/50 py-12">
                  Aucun message pour le moment. Dites salam au salon !
                </div>
              ) : (
                chatMessages.map((msg, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[10px] text-text-light">
                      <span className="font-semibold">{msg.sender}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="bg-surface/40 p-2.5 rounded-lg text-text-dark leading-relaxed">
                      {msg.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Input form */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-teal/10 bg-surface/10 flex gap-2">
              <input
                type="text"
                placeholder="Saisir un message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full px-3 py-2 border border-teal/15 bg-white-custom rounded-lg text-xs outline-none text-text-dark"
              />
              <button
                type="submit"
                className="p-2 bg-teal hover:bg-teal-dark text-white-custom rounded-lg transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </main>

       
    </>
  );
}
