"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/presentation/store/useUserStore";
import { ArrowLeft, User, Mail, Lock, GraduationCap, Building2, AlertCircle } from "lucide-react";
import Button from "@/presentation/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const registerSchema = z.object({
  name: z.string().min(3, "Le nom doit comporter au moins 3 caractères."),
  email: z.string().email("Veuillez saisir une adresse e-mail valide."),
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères."),
  confirmPassword: z.string().min(6, "Veuillez confirmer votre mot de passe."),
  yearOfStudy: z.string().or(z.number()),
  university: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"]
});

type RegisterInputs = z.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter();
  const { register: registerUser } = useUserStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      yearOfStudy: 1
    }
  });

  const passwordVal = watch("password", "");

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(passwordVal);

  const getStrengthLabel = (str: number) => {
    switch (str) {
      case 0: return { label: "Trop court", color: "bg-red-500", text: "text-red-500" };
      case 1: return { label: "Faible", color: "bg-orange-500", text: "text-orange-500" };
      case 2: return { label: "Moyen", color: "bg-yellow-500", text: "text-yellow-600" };
      case 3: return { label: "Fort", color: "bg-emerald-500", text: "text-emerald-500" };
      case 4: return { label: "Très Fort", color: "bg-green-mid", text: "text-green-mid" };
      default: return { label: "", color: "bg-gray-200", text: "" };
    }
  };

  const strengthInfo = getStrengthLabel(strength);

  const onSubmit = async (data: RegisterInputs) => {
    setError("");
    setLoading(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        yearOfStudy: Number(data.yearOfStudy),
        university: data.university
      });
      router.push("/dashboard");
    } catch (err) {
      setError("Erreur lors de la création du compte. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-beige-base text-text-dark font-sans">
      {/* Left Column - Dark Sidebar */}
      <div className="hidden md:flex md:w-[40%] bg-green-dark text-white p-12 flex-col justify-between relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#2D6A4F,transparent_60%)] opacity-35" />
        
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-green-light hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-semibold">Retour au site</span>
          </Link>
          <div className="mt-16 space-y-4 relative z-10">
            <span className="font-serif text-4xl font-extrabold tracking-wide text-white">Agora</span>
            <p className="text-green-light/95 text-lg leading-relaxed font-light">
              "Rejoignez le cercle d'étude le plus compétitif pour les carabins algériens."
            </p>
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-white/5 p-6 rounded-md border border-white/10 mt-auto relative z-10">
          <p className="text-sm italic text-white/90">
            "Le fait d'avoir mes leçons résumées à côté des QCMs triés par difficulté m'a permis de rattraper tout mon retard en pharmacologie clinique."
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-light text-green-dark font-bold text-[10px] flex items-center justify-center">
              YK
            </div>
            <span className="text-xs font-semibold text-green-light">Youcef K., 6e Année, Constantine</span>
          </div>
        </div>
      </div>

      {/* Right Column - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6 bg-beige-light border border-border-brand/40 p-8 rounded-lg shadow-sm">
          <div className="space-y-1">
            <h2 className="font-serif text-3xl font-bold text-green-dark tracking-tight font-semibold">Rejoindre Agora</h2>
            <p className="text-text-mid text-sm">
              Créez votre compte en quelques instants pour débuter vos séances.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 text-error-brand p-4 rounded-sm border border-red-200 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Nom complet */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-semibold text-text-dark">
                Nom complet
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  placeholder="Yacine Benchaa"
                  {...register("name")}
                  className={`w-full pl-10 pr-4 py-2 border rounded-sm bg-white text-text-dark text-sm focus:outline-none focus:ring-1 focus:ring-green-mid ${
                    errors.name ? "border-error-brand" : "border-border-brand focus:border-green-mid"
                  }`}
                />
                <User className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-text-light" />
              </div>
              {errors.name && (
                <p className="text-xs text-error-brand mt-1 flex items-center gap-1 animate-shake">
                  <AlertCircle className="w-3 h-3" /> {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-semibold text-text-dark">
                Adresse e-mail
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="y.benchaa@fac-alger.dz"
                  {...register("email")}
                  className={`w-full pl-10 pr-4 py-2 border rounded-sm bg-white text-text-dark text-sm focus:outline-none focus:ring-1 focus:ring-green-mid ${
                    errors.email ? "border-error-brand" : "border-border-brand focus:border-green-mid"
                  }`}
                />
                <Mail className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-text-light" />
              </div>
              {errors.email && (
                <p className="text-xs text-error-brand mt-1 flex items-center gap-1 animate-shake">
                  <AlertCircle className="w-3 h-3" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-semibold text-text-dark">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full pl-10 pr-4 py-2 border rounded-sm bg-white text-text-dark text-sm focus:outline-none focus:ring-1 focus:ring-green-mid ${
                    errors.password ? "border-error-brand" : "border-border-brand focus:border-green-mid"
                  }`}
                />
                <Lock className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-text-light" />
              </div>
              {errors.password && (
                <p className="text-xs text-error-brand mt-1 flex items-center gap-1 animate-shake">
                  <AlertCircle className="w-3 h-3" /> {errors.password.message}
                </p>
              )}

              {/* Password strength bar */}
              {passwordVal.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-mid">Force :</span>
                    <span className={`font-semibold ${strengthInfo.text}`}>{strengthInfo.label}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 h-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full rounded-full transition-colors duration-300 ${
                          strength >= step ? strengthInfo.color : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-text-dark">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className={`w-full pl-10 pr-4 py-2 border rounded-sm bg-white text-text-dark text-sm focus:outline-none focus:ring-1 focus:ring-green-mid ${
                    errors.confirmPassword ? "border-error-brand" : "border-border-brand focus:border-green-mid"
                  }`}
                />
                <Lock className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-text-light" />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-error-brand mt-1 flex items-center gap-1 animate-shake">
                  <AlertCircle className="w-3 h-3" /> {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Row Study Year & Uni */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="year" className="block text-sm font-semibold text-text-dark">
                  Année d'études
                </label>
                <div className="relative">
                  <select
                    id="year"
                    {...register("yearOfStudy")}
                    className="w-full pl-10 pr-4 py-2 border border-border-brand rounded-sm bg-white text-text-dark text-sm focus:outline-none focus:border-green-mid appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}e Année
                      </option>
                    ))}
                  </select>
                  <GraduationCap className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-text-light" />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="uni" className="block text-sm font-semibold text-text-dark">
                  Université / Faculté
                </label>
                <div className="relative">
                  <input
                    id="uni"
                    type="text"
                    placeholder="Faculté d'Alger"
                    {...register("university")}
                    className="w-full pl-10 pr-4 py-2 border border-border-brand rounded-sm bg-white text-text-dark text-sm focus:outline-none focus:border-green-mid"
                  />
                  <Building2 className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-text-light" />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full py-3 mt-2" disabled={loading}>
              {loading ? "Création du compte..." : "Créer mon compte"}
            </Button>
          </form>

          <p className="text-center text-sm text-text-mid mt-4">
            Déjà inscrit ?{" "}
            <Link href="/login" className="text-green-mid hover:underline font-semibold">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
