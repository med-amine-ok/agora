"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import TimerRing from "@/presentation/components/quiz/TimerRing";
import { useRoomStore } from "@/presentation/store/useRoomStore";
import { useUserStore } from "@/presentation/store/useUserStore";
import {
  Send,
  ChevronRight,
  MessageSquare,
  Crown,
  Volume2,
  VolumeX
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RoomGame() {
  const params = useParams();
  const router = useRouter();
  const roomId = (params?.roomId as string) || "";

  const { user } = useUserStore();
  const {
    roomId: storeRoomId,
    players,
    messages,
    gameState,
    currentQuestion,
    currentQuestionIndex,
    timeRemaining,
    submitAnswer,
    sendChatMessage,
    joinRoom
  } = useRoomStore();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [typedMessage, setTypedMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const startQuestionTimeRef = useRef<number>(Date.now());

  // Reset selected answer state when question index changes
  useEffect(() => {
    setSelectedOpt(null);
    startQuestionTimeRef.current = Date.now();
  }, [currentQuestionIndex]);

  // Re-establish connection if we hit the page directly
  useEffect(() => {
    if (!storeRoomId && roomId && user) {
      joinRoom(roomId, user).catch(() => {
        router.push("/medquest/room");
      });
    }
  }, [roomId, storeRoomId, user, joinRoom, router]);

  // Handle redirect to results screen when finished
  useEffect(() => {
    if (gameState === "results") {
      router.push(`/medquest/room/${roomId}/results`);
    } else if (gameState === "lobby") {
      router.push(`/medquest/room/${roomId}/lobby`);
    }
  }, [gameState, roomId, router]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Audio helper (Web Audio API correct answer synth beep)
  const playWinSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.1); // A5 note
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (selectedOpt !== null || !currentQuestion) return;
    setSelectedOpt(idx);

    const timeSpentMs = Date.now() - startQuestionTimeRef.current;
    submitAnswer(idx, timeSpentMs);

    const isCorrect = idx === currentQuestion.correctIndex;
    if (isCorrect) {
      playWinSound();
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    sendChatMessage(typedMessage.trim());
    setTypedMessage("");
  };

  if (!currentQuestion) {
    return (
      <SidebarLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-green-mid border-t-transparent rounded-full animate-spin" />
        </div>
      </SidebarLayout>
    );
  }

  const isQuestionAnswered = selectedOpt !== null;
  const optionLetters = ["A", "B", "C", "D"];

  // Sort players for live leaderboard display
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const maxScorePossible = players.length > 0 ? Math.max(...players.map(p => p.score), 100) : 100;

  return (
    <SidebarLayout>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 pb-16 select-none">
        
        {/* Left panel - 60% Quiz gameplay card */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between border-b border-border-brand/40 pb-2 text-xs text-text-light font-mono font-semibold">
            <span className="bg-surface-brand text-green-dark px-2.5 py-0.5 rounded-full">
              Question {currentQuestionIndex + 1}
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1 border border-border-brand rounded-sm text-text-light hover:text-text-dark cursor-pointer bg-white-brand"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <span>Chrono : {timeRemaining}s</span>
            </div>
          </div>

          {/* Horizontal countdown timer bar */}
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-green-mid h-full rounded-full transition-all duration-1000 linear"
              style={{ width: `${(timeRemaining / 20) * 100}%` }}
            />
          </div>

          {/* Question card */}
          <Card className="p-6 border-green-light/10">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-green-dark leading-snug">
              {currentQuestion.text}
            </h2>
          </Card>

          {/* Options grid */}
          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((opt, idx) => {
              const letter = optionLetters[idx];
              const isSelected = idx === selectedOpt;
              const isCorrect = idx === currentQuestion.correctIndex;

              let btnClass = "border-border-brand text-text-dark bg-white-brand hover:bg-surface-brand/10";
              
              if (isQuestionAnswered) {
                if (isCorrect) {
                  btnClass = "border-green-mid bg-green-mid/10 text-green-dark font-semibold";
                } else if (isSelected) {
                  btnClass = "border-error bg-red-50 text-error-brand font-semibold animate-shake";
                } else {
                  btnClass = "border-border-brand/40 text-text-light opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isQuestionAnswered}
                  className={`w-full p-4 border rounded-sm flex items-center justify-between gap-4 text-left text-sm transition-all ${btnClass} ${
                    !isQuestionAnswered ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono font-bold ${
                      isSelected ? "bg-green-mid text-white border-green-mid" : "bg-gray-100 text-text-mid"
                    }`}>
                      {letter}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right panel - 40% Players leaderboard & chat */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Half: Live Score Tracker */}
          <Card className="p-6">
            <div className="border-b border-border-brand/40 pb-2 mb-4">
              <span className="text-xs font-bold text-green-dark uppercase tracking-wider font-mono">Classement en Direct</span>
            </div>
            <div className="space-y-4">
              {sortedPlayers.map((player) => {
                const isYou = player.user.id === user?.id;
                const scoreProgress = Math.min((player.score / maxScorePossible) * 100, 100);

                return (
                  <div key={player.user.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={player.user.avatar} alt={player.user.name} className="w-6 h-6 rounded-full bg-green-dark/5 shrink-0" />
                        <span className={`truncate font-semibold ${isYou ? "text-green-mid font-bold" : "text-text-dark"}`}>
                          {player.user.name} {isYou && "(Vous)"}
                        </span>
                        {player.score > 0 && player.score === sortedPlayers[0]?.score && (
                          <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
                        )}
                        {player.lastAnswerCorrect !== null && (
                          <span className={`text-[9px] font-bold px-1 rounded-sm ${
                            player.lastAnswerCorrect ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                          }`}>
                            {player.lastAnswerCorrect ? "Correct" : "Faux"}
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-green-dark">{player.score} pts</span>
                    </div>
                    {/* Live animated scoring bar */}
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isYou ? "bg-green-mid" : "bg-green-light"
                        }`}
                        style={{ width: `${scoreProgress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Bottom Half: Chat pane */}
          <Card className="p-6 h-72 flex flex-col justify-between">
            <div className="border-b border-border-brand/40 pb-2 mb-3">
              <span className="text-xs font-bold text-green-dark uppercase tracking-wider font-mono">Chat Room</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
              {messages.map((msg) => {
                const isYou = msg.userId === user?.id;
                return (
                  <div key={msg.id} className="text-[11px]">
                    <span className={`font-mono font-bold mr-1 ${isYou ? "text-green-mid" : "text-text-dark"}`}>
                      {msg.username.split(" ")[0]} :
                    </span>
                    <span className="text-text-mid bg-beige-base/35 px-2 py-1 rounded-sm border border-border-brand/10 inline-block">
                      {msg.text}
                    </span>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-border-brand/40 mt-3">
              <input
                type="text"
                placeholder="Tapez un message..."
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                className="flex-1 px-3 py-2 border border-border-brand rounded-sm text-xs bg-white-brand text-text-dark focus:outline-none focus:border-green-mid"
              />
              <Button type="submit" size="sm" className="px-3">
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}
