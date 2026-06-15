"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import { useRoomStore } from "@/presentation/store/useRoomStore";
import { useUserStore } from "@/presentation/store/useUserStore";
import { Crown } from "lucide-react";

export default function RoomResults() {
  const params = useParams();
  const router = useRouter();
  const roomId = (params?.roomId as string) || "";

  const { user } = useUserStore();
  const {
    roomId: storeRoomId,
    players,
    gameState,
    leaveRoom,
    joinRoom,
    sendReadyStatus
  } = useRoomStore();

  // Re-establish connection if we hit the page directly
  useEffect(() => {
    if (!storeRoomId && roomId && user) {
      joinRoom(roomId, user).catch(() => {
        router.push("/medquest/room");
      });
    }
  }, [roomId, storeRoomId, user, joinRoom, router]);

  // Handle redirect if room goes back to lobby or playing
  useEffect(() => {
    if (gameState === "lobby") {
      router.push(`/medquest/room/${roomId}/lobby`);
    } else if (gameState === "playing") {
      router.push(`/medquest/room/${roomId}/game`);
    }
  }, [gameState, roomId, router]);

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const handleQuit = () => {
    leaveRoom();
    router.push("/medquest");
  };

  const handleReplay = () => {
    // Reset ready status and request replay
    sendReadyStatus(false);
    // Move client back to lobby locally if needed, or wait for socket broadcast
    router.push(`/medquest/room/${roomId}/lobby`);
  };

  return (
    <SidebarLayout>
      <div className="max-w-2xl mx-auto space-y-12 pb-16 text-center select-none">
        <div className="space-y-2">
          <span className="text-5xl">🏆</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-green-dark">Partie Terminée !</h1>
          <p className="text-text-mid text-sm">Félicitations à tous les concurrents de cette session.</p>
        </div>

        {/* 3D Podium stand (🥇🥈🥉 with player names and scores) */}
        <div className="flex items-end justify-center gap-4 h-64 pt-8 border-b border-border-brand/40 pb-6 max-w-md mx-auto relative select-none">
          <div className="absolute inset-0 pointer-events-none overflow-hidden bg-cover bg-[radial-gradient(ellipse_at_center,rgba(116,198,157,0.06),transparent_60%)]" />

          {/* 2nd place stand */}
          {sortedPlayers[1] && (
            <div className="flex flex-col items-center w-28 space-y-2.5">
              <img
                src={sortedPlayers[1].user.avatar}
                alt={sortedPlayers[1].user.name}
                className="w-10 h-10 rounded-full border border-green-light/20 bg-green-dark/5 shrink-0"
              />
              <span className="text-xs font-bold truncate max-w-full text-text-dark">{sortedPlayers[1].user.name.split(" ")[0]}</span>
              <div className="w-full bg-slate-200 border-x border-t border-slate-300 h-28 rounded-t-sm flex flex-col justify-start items-center pt-3 shadow-inner">
                <span className="text-2xl">🥈</span>
                <span className="font-mono text-xs font-bold text-text-mid mt-1">{sortedPlayers[1].score} pts</span>
              </div>
            </div>
          )}

          {/* 1st place stand */}
          {sortedPlayers[0] && (
            <div className="flex flex-col items-center w-32 space-y-2.5 relative -top-4">
              <Crown className="w-5 h-5 text-amber-500 animate-bounce shrink-0" />
              <img
                src={sortedPlayers[0].user.avatar}
                alt={sortedPlayers[0].user.name}
                className="w-12 h-12 rounded-full border-2 border-amber-400 bg-green-dark/5 shrink-0"
              />
              <span className="text-xs font-bold truncate max-w-full text-green-dark">{sortedPlayers[0].user.name.split(" ")[0]}</span>
              <div className="w-full bg-amber-100 border-x border-t border-amber-300 h-36 rounded-t-sm flex flex-col justify-start items-center pt-3 shadow-md">
                <span className="text-3xl">🥇</span>
                <span className="font-mono text-sm font-bold text-amber-900 mt-1">{sortedPlayers[0].score} pts</span>
              </div>
            </div>
          )}

          {/* 3rd place stand */}
          {sortedPlayers[2] && (
            <div className="flex flex-col items-center w-28 space-y-2.5">
              <img
                src={sortedPlayers[2].user.avatar}
                alt={sortedPlayers[2].user.name}
                className="w-10 h-10 rounded-full border border-green-light/20 bg-green-dark/5 shrink-0"
              />
              <span className="text-xs font-bold truncate max-w-full text-text-dark">{sortedPlayers[2].user.name.split(" ")[0]}</span>
              <div className="w-full bg-orange-100 border-x border-t border-orange-200 h-20 rounded-t-sm flex flex-col justify-start items-center pt-3 shadow-inner">
                <span className="text-2xl">🥉</span>
                <span className="font-mono text-xs font-bold text-orange-950 mt-1">{sortedPlayers[2].score} pts</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Panel */}
        <Card className="p-6 border-green-light/20 flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="outline" className="flex-1 py-3" onClick={handleQuit}>
            Quitter le Salon
          </Button>
          <Button variant="primary" className="flex-1 py-3" onClick={handleReplay}>
            Rejouer
          </Button>
        </Card>
      </div>
    </SidebarLayout>
  );
}
