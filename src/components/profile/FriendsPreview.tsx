"use client";

import React from "react";
import { UserCheck } from "lucide-react";

export default function FriendsPreview() {
  const friends = [
    { name: "Amine K.", lvl: 14, online: true, letter: "A" },
    { name: "Sarah B.", lvl: 21, online: true, letter: "S" },
    { name: "Ryad M.", lvl: 9, online: false, letter: "R" },
    { name: "Lina T.", lvl: 18, online: true, letter: "L" },
    { name: "Mounir Y.", lvl: 25, online: false, letter: "M" }
  ];

  return (
    <div className="p-6 rounded-2xl border border-teal/15 bg-white-custom/60 backdrop-blur-md shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-text-dark">Camarades d'Agora</h3>
          <p className="text-xs text-text-light">Vos contacts et leur progression</p>
        </div>
        <button className="text-[10px] font-bold text-teal hover:underline cursor-pointer">
          Voir tout
        </button>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-thin">
        {friends.map((friend, idx) => (
          <div key={idx} className="flex flex-col items-center text-center shrink-0 min-w-[70px] space-y-1.5 relative">
            <div className="relative">
              <div className="h-11 w-11 rounded-full bg-teal/20 border border-teal/15 text-teal flex items-center justify-center font-bold text-sm shadow-inner">
                {friend.letter}
              </div>
              <span
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white-custom ${
                  friend.online ? "bg-teal" : "bg-text-light/50"
                }`}
              />
            </div>

            <div>
              <p className="text-[10px] font-bold text-text-dark truncate max-w-[75px]">
                {friend.name}
              </p>
              <p className="text-[9px] text-text-light font-mono font-bold">
                Lvl {friend.lvl}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
