"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  UserCheck,
  Key,
  Lock,
  Mail,
  ArrowLeft,
  Activity,
  ArrowRight,
} from "lucide-react";
import { useAgoraStore } from "@/store/useAgoraStore";

type AuthMode = "login" | "register";

type AuthScreenProps = {
  mode: AuthMode;
};

export default function AuthScreen({ mode }: AuthScreenProps) {
  const router = useRouter();
  const { login, selectedRole, setRole } = useAgoraStore();
  const isLogin = mode === "login";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const activeRole = isLogin ? selectedRole ?? "student" : "student";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      if (activeRole === "student" && !name.trim()) {
        setError("Veuillez entrer votre nom");
        return;
      }

      if (activeRole === "student" && !email.trim()) {
        setError("Veuillez entrer votre adresse e-mail");
        return;
      }

      if (activeRole === "admin" && password !== "admin123") {
        setError("Jeton d'accès administrateur invalide");
        return;
      }

      login(activeRole === "admin" ? "Dr. Belkacem" : name, activeRole);
      router.push(activeRole === "admin" ? "/admin" : "/dashboard");
      return;
    }

    if (!name.trim()) {
      setError("Veuillez saisir votre nom complet");
      return;
    }

    if (!email.trim()) {
      setError("Veuillez saisir votre adresse e-mail");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setRole("student");
    login(name, "student");
    router.push("/dashboard");
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center p-4 transition-all duration-500 ${
        isLogin && activeRole === "admin" ? "bg-teal-dark" : "bg-white-custom"
      }`}
    >
      <Link
        href="/"
        className={`absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold ${
          isLogin && activeRole === "admin"
            ? "text-white-custom/70 hover:text-white-custom"
            : "text-text-light hover:text-teal"
        }`}
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à l'accueil
      </Link>

      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all shadow-md ${
              isLogin && activeRole === "admin"
                ? "bg-white-custom text-teal-dark"
                : "bg-teal-dark text-white-custom"
            }`}
          >
            <Activity
              className={`h-6 w-6 stroke-[2] ${
                isLogin && activeRole === "admin" ? "text-accent" : "text-teal-light"
              }`}
            />
          </div>
          <h2
            className={`mt-4 font-display text-2xl font-bold tracking-tight ${
              isLogin && activeRole === "admin" ? "text-white-custom" : "text-text-dark"
            }`}
          >
            {isLogin ? "Identifiants Agora" : "Créer votre compte Agora"}
          </h2>
          <p
            className={`text-xs mt-1 ${
              isLogin && activeRole === "admin" ? "text-white-custom/60" : "text-text-light"
            }`}
          >
            {isLogin
              ? "Choisissez votre rôle pour accéder à l'espace adapté."
              : "Rejoignez Agora en tant qu'étudiant et commencez votre parcours."}
          </p>
        </div>

        {isLogin && (
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setRole("student");
                setError("");
              }}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-2 transition-all ${
                activeRole === "student"
                  ? "border-teal bg-teal/5 text-teal"
                  : "border-teal/10 bg-white-custom/50 text-text-light hover:border-teal/20"
              }`}
            >
              <UserCheck className="h-6 w-6" />
              <span className="text-xs font-bold">Étudiant</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole("admin");
                setError("");
              }}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-2 transition-all ${
                activeRole === "admin"
                  ? "border-accent bg-white-custom/10 text-white-custom"
                  : "border-teal/10 bg-white-custom/50 text-text-light hover:border-teal/20"
              }`}
            >
              <ShieldCheck className="h-6 w-6" />
              <span className="text-xs font-bold">Administrateur</span>
            </button>
          </div>
        )}

        <motion.div
          key={`${mode}-${activeRole}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-6 rounded-2xl border shadow-xl ${
            isLogin && activeRole === "admin"
              ? "bg-teal-dark border-white-custom/15 text-white-custom"
              : "bg-white-custom border-teal/12 text-text-dark"
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-xs text-error font-medium bg-error/10 p-2.5 rounded-lg">
                {error}
              </p>
            )}

            {isLogin ? (
              activeRole === "student" ? (
                <>
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-text-light mb-1">
                      Votre Nom
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Ex. Yanis Meziani"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-teal/15 bg-white-custom text-xs text-text-dark outline-none focus:border-teal"
                      />
                      <UserCheck className="absolute left-3 top-3 h-4 w-4 text-text-light/50" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-text-light mb-1">
                      Adresse E-mail
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="yanis@univ-alger.dz"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-teal/15 bg-white-custom text-xs text-text-dark outline-none focus:border-teal"
                      />
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-text-light/50" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white-custom/5 p-3 rounded-lg border border-white-custom/10 mb-4 text-[10px] text-teal-light leading-relaxed">
                    <strong>Note :</strong> Le panneau d'administration utilise des statistiques de cycles cliniques avancées. Le mot de passe est <code className="bg-teal-dark px-1.5 py-0.5 rounded font-mono text-white-custom">admin123</code>.
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-white-custom/70 mb-1">
                      Jeton d'accès / Mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="Entrez le jeton de sécurité"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-white-custom/15 bg-white-custom/10 text-xs text-white-custom placeholder-white-custom/30 outline-none focus:border-accent"
                      />
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-white-custom/40" />
                    </div>
                  </div>
                </>
              )
            ) : (
              <>
                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-text-light mb-1">
                    Nom complet
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Ex. Yanis Meziani"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-teal/15 bg-white-custom text-xs text-text-dark outline-none focus:border-teal"
                    />
                    <UserCheck className="absolute left-3 top-3 h-4 w-4 text-text-light/50" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-text-light mb-1">
                    Adresse E-mail
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="yanis@univ-alger.dz"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-teal/15 bg-white-custom text-xs text-text-dark outline-none focus:border-teal"
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-text-light/50" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-text-light mb-1">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="Créez un mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-teal/15 bg-white-custom text-xs text-text-dark outline-none focus:border-teal"
                    />
                    <Key className="absolute left-3 top-3 h-4 w-4 text-text-light/50" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-text-light mb-1">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="Répétez le mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-teal/15 bg-white-custom text-xs text-text-dark outline-none focus:border-teal"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-text-light/50" />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className={`w-full py-3 rounded-full text-xs font-semibold transition-all inline-flex items-center justify-center gap-2 ${
                isLogin && activeRole === "admin"
                  ? "bg-accent hover:bg-accent/90 text-white-custom"
                  : "bg-teal hover:bg-teal-dark text-white-custom"
              }`}
            >
              {isLogin ? "Établir la Session" : "Créer mon Compte"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-text-light">
            {isLogin ? (
              <>
                Nouveau sur Agora ?{" "}
                <Link href="/auth/register" className="font-semibold text-teal hover:text-teal-dark transition-colors">
                  Créer un compte
                </Link>
              </>
            ) : (
              <>
                Déjà un compte ?{" "}
                <Link href="/auth/login" className="font-semibold text-teal hover:text-teal-dark transition-colors">
                  Se connecter
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}