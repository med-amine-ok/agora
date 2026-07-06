"use client";

import React from "react";
import PublicLayout from "@/components/layout/public/PublicLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
