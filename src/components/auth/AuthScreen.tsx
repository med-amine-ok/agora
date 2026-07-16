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
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  Phone,
  School,
  GraduationCap,
  User
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

  // Form states
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("DCEM1");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const activeRole = isLogin ? selectedRole ?? "student" : "student";

  const handleValidationAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      if (activeRole === "student") {
        if (!email.trim() || !email.includes("@")) {
          setError("Veuillez entrer une adresse e-mail valide.");
          return;
        }
        if (password.length < 6) {
          setError("Le mot de passe doit contenir au moins 6 caractères.");
          return;
        }
      } else {
        if (password !== "admin123") {
          setError("Jeton d'accès administrateur invalide.");
          return;
        }
      }
    } else {
      if (!name.trim()) {
        setError("Veuillez saisir votre nom complet.");
        return;
      }
      if (!username.trim()) {
        setError("Veuillez choisir un nom d'utilisateur.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setError("Veuillez saisir une adresse e-mail valide.");
        return;
      }
      if (!phone.trim() || phone.length < 8) {
        setError("Veuillez saisir un numéro de téléphone valide.");
        return;
      }
      if (!university.trim()) {
        setError("Veuillez renseigner votre université.");
        return;
      }
      if (password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        return;
      }
    }

    setIsLoading(true);

    // Simulate database query/registration delay
    setTimeout(() => {
      setIsLoading(false);
      login(
        activeRole === "admin" ? "Dr. Belkacem" : name || email.split("@")[0], 
        activeRole,
        activeRole === "student" ? {
          username,
          phone,
          university,
          yearOfStudy
        } : undefined
      );
      router.push(activeRole === "admin" ? "/admin" : "/dashboard");
    }, 1500);
  };

  const handleSocialLogin = (provider: "Google" | "Apple" | "GitHub") => {
    setError("");
    setIsLoading(true);

    // Simulate OAuth flow redirect and successful callback
    setTimeout(() => {
      setIsLoading(false);
      login(`Étudiant ${provider}`, "student");
      router.push("/dashboard");
    }, 1800);
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center p-4 transition-all duration-500 relative overflow-hidden ${
        isLogin && activeRole === "admin" 
          ? "bg-gradient-to-br from-[#071F1F] via-[#0D2E2E] to-[#041515]" 
          : "bg-gradient-to-br from-[#F5F9F9] via-white-custom to-[#EBF3F3]"
      }`}
    >
      {/* Background visual sparkles/blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square rounded-full bg-teal/5 filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] aspect-square rounded-full bg-teal-light/5 filter blur-3xl pointer-events-none" />

      {/* Return home link */}
      <Link
        href="/"
        className={`absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
          isLogin && activeRole === "admin"
            ? "text-white-custom/75 border-white-custom/10 bg-white-custom/5 hover:bg-white-custom/10 hover:text-white"
            : "text-text-light border-teal/10 bg-white hover:bg-surface hover:text-teal"
        }`}
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à l'accueil
      </Link>

      <div className="w-full max-w-md space-y-8 z-10 py-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center p-1 rounded-2xl bg-white shadow-md border border-teal/5 transform hover:scale-105 transition-transform duration-300">
            <img src="/agoraLogo.png" alt="Agora Logo" className="h-full w-full object-contain" />
          </div>
          <h2
            className={`mt-5 font-display text-2xl font-black tracking-tight ${
              isLogin && activeRole === "admin" ? "text-white-custom" : "text-text-dark"
            }`}
          >
            {isLogin 
              ? (activeRole === "admin" ? "Connexion Espace Admin" : "Connexion à Agora") 
              : "Rejoindre Agora"}
          </h2>
          <p
            className={`text-xs mt-1 max-w-xs ${
              isLogin && activeRole === "admin" ? "text-white-custom/60" : "text-text-light"
            }`}
          >
            {isLogin
              ? "Préparez vos examens médicaux avec notre système d'apprentissage actif."
              : "Créez votre compte étudiant pour accéder à la bibliothèque de révision."}
          </p>
        </div>

        {/* Student/Admin Role Selection (Only on Login Mode) */}
        {isLogin && (
          <div className="grid grid-cols-2 gap-4 p-1.5 bg-surface/50 border border-teal/10 rounded-2xl">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setRole("student");
                setError("");
              }}
              className={`p-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeRole === "student"
                  ? "bg-white text-teal shadow-sm font-bold border border-teal/10"
                  : "text-text-light hover:text-text-dark"
              }`}
            >
              <UserCheck className="h-4 w-4" />
              <span className="text-xs">Étudiant</span>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setRole("admin");
                setError("");
              }}
              className={`p-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeRole === "admin"
                  ? "bg-white/10 text-white-custom shadow-sm font-bold border border-white-custom/10"
                  : "text-text-light hover:text-text-dark"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs">Admin</span>
            </button>
          </div>
        )}

        <motion.div
          key={`${mode}-${activeRole}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden backdrop-blur-md ${
            isLogin && activeRole === "admin"
              ? "bg-[#0B2525]/90 border-white-custom/10 text-white-custom"
              : "bg-white/90 border-teal/10 text-text-dark"
          }`}
        >
          <form onSubmit={handleValidationAndSubmit} className="space-y-4">
            {error && (
              <p className="text-xs text-error font-semibold bg-error/10 p-3 rounded-xl flex items-center gap-2 border border-error/15">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </p>
            )}

            {isLogin ? (
              activeRole === "student" ? (
                <>
                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-text-light">
                      Adresse E-mail
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        disabled={isLoading}
                        placeholder="yanis@univ-alger.dz"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-teal/15 bg-white text-xs text-text-dark outline-none focus:ring-1 focus:ring-teal focus:border-teal transition-all disabled:opacity-50"
                      />
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-text-light/50" />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-text-light">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        disabled={isLoading}
                        placeholder="Entrez votre mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-teal/15 bg-white text-xs text-text-dark outline-none focus:ring-1 focus:ring-teal focus:border-teal transition-all disabled:opacity-50"
                      />
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-text-light/50" />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-3 top-3 text-text-light/60 hover:text-text-dark cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Admin token input */}
                  <div className="bg-white-custom/5 p-3 rounded-xl border border-white-custom/10 text-[10px] text-teal-light leading-relaxed flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <strong>Note Administrateur :</strong> Le panneau d'administration requiert le jeton d'accès de sécurité standard : <code className="bg-[#123D3D] px-1.5 py-0.5 rounded font-mono text-white-custom border border-white-custom/10">admin123</code>.
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-white-custom/75">
                      Jeton d'accès de Sécurité
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        disabled={isLoading}
                        placeholder="Entrez le jeton de sécurité"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-white-custom/15 bg-white-custom/10 text-xs text-white-custom placeholder-white-custom/30 outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all disabled:opacity-50"
                      />
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-white-custom/40" />
                    </div>
                  </div>
                </>
              )
            ) : (
              <>
                {/* Registration Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-text-light">
                      Nom complet
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        disabled={isLoading}
                        placeholder="Yanis Meziani"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-teal/15 bg-white text-xs text-text-dark outline-none focus:ring-1 focus:ring-teal focus:border-teal transition-all disabled:opacity-50"
                      />
                      <UserCheck className="absolute left-3 top-3 h-4 w-4 text-text-light/50" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-text-light">
                      Nom d'utilisateur
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        disabled={isLoading}
                        placeholder="yanis_mez"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-teal/15 bg-white text-xs text-text-dark outline-none focus:ring-1 focus:ring-teal focus:border-teal transition-all disabled:opacity-50"
                      />
                      <User className="absolute left-3 top-3 h-4 w-4 text-text-light/50" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-text-light">
                      Adresse E-mail
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        disabled={isLoading}
                        placeholder="yanis@univ-alger.dz"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-teal/15 bg-white text-xs text-text-dark outline-none focus:ring-1 focus:ring-teal focus:border-teal transition-all disabled:opacity-50"
                      />
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-text-light/50" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-text-light">
                      N° de Téléphone
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        disabled={isLoading}
                        placeholder="0550 12 34 56"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-teal/15 bg-white text-xs text-text-dark outline-none focus:ring-1 focus:ring-teal focus:border-teal transition-all disabled:opacity-50"
                      />
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-text-light/50" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-text-light">
                      Université / Faculté
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        disabled={isLoading}
                        placeholder="Université d'Alger 1"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-teal/15 bg-white text-xs text-text-dark outline-none focus:ring-1 focus:ring-teal focus:border-teal transition-all disabled:opacity-50"
                      />
                      <School className="absolute left-3 top-3 h-4 w-4 text-text-light/50" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-text-light">
                      Année d'études
                    </label>
                    <div className="relative">
                      <select
                        disabled={isLoading}
                        value={yearOfStudy}
                        onChange={(e) => setYearOfStudy(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-teal/15 bg-white text-xs text-text-dark outline-none focus:ring-1 focus:ring-teal focus:border-teal transition-all disabled:opacity-50"
                      >
                        <option value="PCEM1">1ère année (PCEM1)</option>
                        <option value="PCEM2">2ème année (PCEM2)</option>
                        <option value="DCEM1">3ème année (DCEM1)</option>
                        <option value="DCEM2">4ème année (DCEM2)</option>
                        <option value="DCEM3">5ème année (DCEM3)</option>
                        <option value="DCEM4">6ème année (DCEM4)</option>
                        <option value="Internat">Internat</option>
                      </select>
                      <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-text-light/50 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-text-light">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        disabled={isLoading}
                        placeholder="Créer un mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-teal/15 bg-white text-xs text-text-dark outline-none focus:ring-1 focus:ring-teal focus:border-teal transition-all disabled:opacity-50"
                      />
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-text-light/50" />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-3 top-3 text-text-light/60 hover:text-text-dark cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-text-light">
                      Confirmer
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        disabled={isLoading}
                        placeholder="Confirmer"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-teal/15 bg-white text-xs text-text-dark outline-none focus:ring-1 focus:ring-teal focus:border-teal transition-all disabled:opacity-50"
                      />
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-text-light/50" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Remember me & Forgot Password */}
            {isLogin && activeRole === "student" && (
              <div className="flex items-center justify-between text-[11px] text-text-light pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-teal focus:ring-teal h-3.5 w-3.5"
                  />
                  <span>Se souvenir de moi</span>
                </label>
                <button type="button" className="hover:underline font-semibold text-teal cursor-pointer">
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60 ${
                isLogin && activeRole === "admin"
                  ? "bg-accent hover:bg-accent/90 text-white"
                  : "bg-teal hover:bg-teal-dark text-white"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Traitement en cours...</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? "Établir la Session" : "Créer mon Compte"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Social Logins Splitter (Only for student mode) */}
          {activeRole === "student" && (
            <div className="space-y-4 pt-5 mt-5 border-t border-teal/10">
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-teal/10"></div>
                <span className="flex-shrink mx-3 text-[10px] text-text-light/70 uppercase font-bold tracking-wider">Ou continuer avec</span>
                <div className="flex-grow border-t border-teal/10"></div>
              </div>

              <div className="flex justify-center w-full">
                {/* Google Login */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSocialLogin("Google")}
                  className="w-full py-2.5 rounded-xl border border-teal/10 bg-white flex items-center justify-center gap-2 hover:bg-surface transition-all cursor-pointer disabled:opacity-50 text-xs font-semibold text-text-dark hover:border-teal/20 shadow-sm"
                  title="Se connecter avec Google"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continuer avec Google</span>
                </button>
              </div>
            </div>
          )}

          {/* Footer toggle switcher links */}
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