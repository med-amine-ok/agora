"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import { useRoomStore } from "@/presentation/store/useRoomStore";
import { useUserStore } from "@/presentation/store/useUserStore";
import {
  Users,
  Send,
  Copy,
  Play,
  Volume2,
  VolumeX,
  MessageSquare
} from "lucide-react";

export default function RoomLobby() {
  const params = useParams();
  const router = useRouter();
  const roomId = (params?.roomId as string) || "";

  const { user } = useUserStore();
  const {
    roomId: storeRoomId,
    inviteCode,
    players,
    messages,
    gameState,
    sendReadyStatus,
    sendChatMessage,
    joinRoom,
    leaveRoom
  } = useRoomStore();

  const [copied, setCopied] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [typedMessage, setTypedMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Re-establish connection if we hit the page directly
  useEffect(() => {
    if (!storeRoomId && roomId && user) {
      joinRoom(roomId, user).catch(() => {
        router.push("/medquest/room");
      });
    }
  }, [roomId, storeRoomId, user, joinRoom, router]);

  // Handle redirect to active gameplay screen
  useEffect(() => {
    if (gameState === "playing" || gameState === "countdown") {
      router.push(`/medquest/room/${roomId}/game`);
    }
  }, [gameState, roomId, router]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCopyCode = () => {
    const code = inviteCode || roomId;
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    sendChatMessage(typedMessage.trim());
    setTypedMessage("");
  };

  const currentUser = players.find(p => p.user.id === user?.id);
  const isReady = currentUser?.isReady || false;

  const handleToggleReady = () => {
    sendReadyStatus(!isReady);
  };

  const handleQuit = () => {
    leaveRoom();
    router.push("/medquest/room");
  };

  return (
    <SidebarLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-16 select-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-brand pb-4">
          <h1 className="font-serif text-3xl font-bold text-green-dark flex items-center gap-2">
            <Users className="w-8 h-8 text-green-mid" /> Salle de Quiz Privée
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 border border-border-brand rounded-sm text-text-light hover:text-text-dark cursor-pointer bg-white-brand"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <Button variant="outline" size="sm" onClick={handleQuit}>
              Quitter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Left Box (60%): Code & Invites */}
          <div className="md:col-span-3 space-y-6">
            <Card className="p-8 border-green-light/20 flex flex-col items-center text-center space-y-6">
              <span className="text-xs text-text-light uppercase tracking-wider block font-semibold">
                Invitez vos amis avec ce code
              </span>
              
              {/* Code display */}
              <div
                onClick={handleCopyCode}
                className="px-8 py-4 bg-surface-brand border-2 border-dashed border-green-light text-3xl font-mono font-bold tracking-widest text-green-dark rounded-sm cursor-pointer select-none hover:bg-green-light/10 transition-colors flex items-center gap-4 group"
              >
                <span>{inviteCode || roomId}</span>
                <Copy className="w-5 h-5 text-green-mid shrink-0 group-hover:scale-110 transition-transform" />
              </div>
              {copied && <span className="text-xs text-green-mid font-semibold animate-pulse">Copié dans le presse-papiers !</span>}

              <div className="w-full border-t border-border-brand/40 pt-6 flex gap-4 justify-center">
                <Button
                  variant={isReady ? "primary" : "outline"}
                  onClick={handleToggleReady}
                  className="flex-1 py-3"
                >
                  {isReady ? "✓ Prêt !" : "Signaler prêt"}
                </Button>
                {currentUser?.user.id === players[0]?.user.id && (
                  <Button
                    variant="accent"
                    onClick={handleToggleReady}
                    className="flex-1 py-3 flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" /> Démarrer
                  </Button>
                )}
              </div>
            </Card>

            {/* Chat panel */}
            <Card className="p-6 h-80 flex flex-col justify-between">
              <div className="border-b border-border-brand/40 pb-2 mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-mid" />
                <span className="text-xs font-bold text-green-dark uppercase tracking-wider">Chat du Salon</span>
              </div>
              
              {/* Message display list */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
                {messages.map((msg) => {
                  const isYou = msg.userId === user?.id;
                  return (
                    <div key={msg.id} className="text-xs">
                      <div className="flex justify-between items-center text-text-light font-semibold font-mono mb-0.5">
                        <span className={isYou ? "text-green-mid font-bold" : "text-text-dark"}>
                          {msg.username} {isYou && "(Vous)"}
                        </span>
                        <span className="text-[10px] opacity-70">{msg.timestamp}</span>
                      </div>
                      <p className="bg-beige-base/40 border border-border-brand/20 p-2 rounded-sm text-text-mid inline-block max-w-full break-words">
                        {msg.text}
                      </p>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Form input */}
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

          {/* Right Box (40%): Active Player checklist */}
          <div className="md:col-span-2">
            <Card className="p-6 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-border-brand/40 pb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-green-dark uppercase tracking-wider font-mono">Joueurs Connectés</span>
                  <span className="text-xs bg-surface-brand text-green-dark font-mono font-bold px-2 py-0.5 rounded-full">
                    {players.length} / 8
                  </span>
                </div>
                <div className="space-y-3">
                  {players.map((p) => {
                    const isYou = p.user.id === user?.id;
                    return (
                      <div key={p.user.id} className="flex items-center justify-between p-2 hover:bg-beige-base/20 rounded-sm">
                        <div className="flex items-center gap-3">
                          <img src={p.user.avatar} alt={p.user.name} className="w-8 h-8 rounded-full bg-green-dark/5" />
                          <span className={`text-sm ${isYou ? "font-bold text-green-mid" : "text-text-dark"}`}>
                            {p.user.name} {isYou && "(Vous)"}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                          p.isReady
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {p.isReady ? "Prêt" : "Attente"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-xs text-text-light text-center font-semibold pt-4">
                En attente du lancement par l'hôte.
              </div>
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
