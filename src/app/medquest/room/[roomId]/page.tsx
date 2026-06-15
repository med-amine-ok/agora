"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function RoomRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params?.roomId as string;

  useEffect(() => {
    if (roomId) {
      router.replace(`/medquest/room/${roomId}/lobby`);
    }
  }, [roomId, router]);

  return (
    <div className="min-h-screen bg-beige-base flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-green-mid border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
