"use client";

import React, { useState } from "react";
import Link from "next/link";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import { ChevronLeft, Search, UserCheck, Shield, UserMinus } from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  yearOfStudy: number;
  university: string;
  role: "student" | "admin";
  status: "active" | "suspended";
}

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([
    { id: "u1", name: "Dr. Amine Bensalah", email: "amine@agora.dz", yearOfStudy: 5, university: "Université d'Alger", role: "admin", status: "active" },
    { id: "u2", name: "Meriem Bensalah", email: "meriem@agora.dz", yearOfStudy: 5, university: "Université d'Alger", role: "student", status: "active" },
    { id: "u3", name: "Youcef Khelifi", email: "youcef@agora.dz", yearOfStudy: 6, university: "Université d'Alger", role: "student", status: "active" },
    { id: "u4", name: "Lina Chaoui", email: "lina@agora.dz", yearOfStudy: 4, university: "Université de Constantine", role: "student", status: "active" },
    { id: "u5", name: "Ali Larbi", email: "ali@agora.dz", yearOfStudy: 5, university: "Université d'Oran", role: "student", status: "suspended" }
  ]);

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === "active" ? "suspended" : "active" };
      }
      return u;
    }));
  };

  const toggleRole = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, role: u.role === "admin" ? "student" : "admin" };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="font-serif text-3xl font-bold text-green-dark">Administration des Utilisateurs</h1>
          <p className="text-text-mid text-sm mt-1">
            Gérez les permissions des carabins inscrits sur Agora et suspendez les comptes non conformes.
          </p>
        </div>

        {/* Search */}
        <Card className="p-4 flex gap-4 items-center justify-between border-border-brand/40 text-sm">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-border-brand rounded-sm text-xs bg-white text-text-dark focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-light" />
          </div>
        </Card>

        {/* User Table */}
        <Card className="p-6">
          <div className="overflow-x-auto text-xs sm:text-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-brand/40 text-xs text-text-light font-mono uppercase pb-2">
                  <th className="py-3 px-2">Nom & Email</th>
                  <th className="py-3 px-2">Université</th>
                  <th className="py-3 px-2">Rôle</th>
                  <th className="py-3 px-2">Statut</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-brand/20">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-beige-base/20 transition-colors">
                    <td className="py-3.5 px-2">
                      <span className="font-semibold text-green-dark block">{u.name}</span>
                      <span className="text-[10px] text-text-light font-mono">@{u.email.split("@")[0]} • {u.email}</span>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className="font-semibold text-text-dark">{u.university}</span>
                      <span className="text-[10px] text-text-light font-mono block">{u.yearOfStudy}e Année</span>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                        u.role === "admin"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 capitalize">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        u.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => toggleRole(u.id)}
                          className="p-1.5 border border-border-brand text-text-light hover:text-amber-600 rounded-sm bg-white"
                          title={u.role === "admin" ? "Promouvoir étudiant" : "Promouvoir admin"}
                        >
                          <Shield className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleStatus(u.id)}
                          className={`p-1.5 border border-border-brand rounded-sm bg-white ${
                            u.status === "active" ? "text-text-light hover:text-red-600" : "text-emerald-600 hover:text-emerald-700"
                          }`}
                          title={u.status === "active" ? "Suspendre" : "Activer"}
                        >
                          {u.status === "active" ? <UserMinus className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </SidebarLayout>
  );
}
