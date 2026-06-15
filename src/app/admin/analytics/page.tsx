"use client";

import React from "react";
import Link from "next/link";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import { ChevronLeft, BarChart3, TrendingUp, Users, RefreshCw } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

export default function AdminAnalytics() {
  const dauData = [
    { day: "Lun", students: 120 },
    { day: "Mar", students: 140 },
    { day: "Mer", students: 135 },
    { day: "Jeu", students: 180 },
    { day: "Ven", students: 155 },
    { day: "Sam", students: 210 },
    { day: "Dim", students: 195 }
  ];

  const sessionData = [
    { name: "Mode Libre", count: 420 },
    { name: "Mode Blitz", count: 280 },
    { name: "Mode Salon", count: 180 }
  ];

  return (
    <SidebarLayout>
      <div className="space-y-8 pb-16 select-none">
        
        {/* Navigation Actions */}
        <div className="space-y-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-light hover:text-green-mid transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Retour à l'administration
          </Link>
          <h1 className="font-serif text-3xl font-bold text-green-dark flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-green-mid" /> Rapports Analytiques
          </h1>
          <p className="text-text-mid text-sm mt-1">
            Suivez les statistiques de fréquentation quotidiennes des carabins et la répartition des modes.
          </p>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* DAU Chart */}
          <Card className="p-6">
            <h3 className="font-bold text-green-dark text-sm border-b border-border-brand/40 pb-3 mb-4 flex items-center gap-1.5">
              <Users className="w-4.5 h-4.5 text-green-mid" /> Visiteurs actifs hebdomadaires (DAU)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dauData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F1F1" vertical={false} />
                  <XAxis dataKey="day" stroke="#555555" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#555555" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="students" stroke="#0E7C7B" strokeWidth={3} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Session Type Chart */}
          <Card className="p-6">
            <h3 className="font-bold text-green-dark text-sm border-b border-border-brand/40 pb-3 mb-4 flex items-center gap-1.5">
              <TrendingUp className="w-4.5 h-4.5 text-accent-brand" /> Sessions complétées par type de défi
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#555555" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#555555" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#FF6B35" radius={[3, 3, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}
