"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/presentation/store/useUserStore";
import { ArrowLeft, Mail, Lock, AlertCircle } from "lucide-react";
import Button from "@/presentation/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Veuillez saisir une adresse e-mail valide."),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères.")
});

type LoginInputs = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const { login } = useUserStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginInputs) => {
    setError("");
    setLoading(true);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Identifiants incorrects. Veuillez réessayer.");
      }
    } catch (err) {
      setError("Une erreur réseau est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-beige-base text-text-dark font-sans">
      {/* Left Column: Branding / Dark Sidebar */}
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
              "L'éducation médicale redéfinie pour la réussite de nos futurs praticiens algériens."
            </p>
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-white/5 p-6 rounded-md border border-white/10 mt-auto relative z-10">
          <p className="text-sm italic text-white/90">
            "Agora a complètement changé ma méthode de préparation pour le résidanat d'Alger. Les QCMs en mode Blitz m'obligent à réfléchir vite et bien !"
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-light text-green-dark font-bold text-[10px] flex items-center justify-center">
              SB
            </div>
            <span className="text-xs font-semibold text-green-light">Sarah B., Interne en Neurologie</span>
          </div>
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-8 bg-beige-light border border-border-brand/40 p-8 rounded-lg shadow-sm">
          <div className="space-y-2">
            <h2 className="font-serif text-3xl font-bold text-green-dark tracking-tight font-semibold">Se connecter</h2>
            <p className="text-text-mid text-sm">
              Accédez à vos leçons médicales et quiz MedQuest.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 text-error-brand p-4 rounded-sm border border-red-200 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-semibold text-text-dark">
                Adresse e-mail
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="nom@fac-alger.dz"
                  {...register("email")}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-sm bg-white text-text-dark text-sm focus:outline-none focus:ring-1 focus:ring-green-mid ${
                    errors.email ? "border-error-brand focus:border-error-brand" : "border-border-brand focus:border-green-mid"
                  }`}
                />
                <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-text-light" />
              </div>
              {errors.email && (
                <p className="text-xs text-error-brand mt-1 flex items-center gap-1 animate-shake">
                  <AlertCircle className="w-3 h-3" /> {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-text-dark">
                  Mot de passe
                </label>
                <Link href="/reset-password" className="text-xs text-blue-accent hover:underline font-semibold">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-sm bg-white text-text-dark text-sm focus:outline-none focus:ring-1 focus:ring-green-mid ${
                    errors.password ? "border-error-brand focus:border-error-brand" : "border-border-brand focus:border-green-mid"
                  }`}
                />
                <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-text-light" />
              </div>
              {errors.password && (
                <p className="text-xs text-error-brand mt-1 flex items-center gap-1 animate-shake">
                  <AlertCircle className="w-3 h-3" /> {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full py-3" disabled={loading}>
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>

          {/* Social login divider */}
          <div className="relative my-6 select-none">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-brand" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-beige-light px-3 text-text-light font-medium">Ou continuer avec</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full py-2.5 flex items-center justify-center gap-3"
            onClick={async () => {
              setLoading(true);
              await login("samy.google@fac-oran.dz", "Samy Ben");
              router.push("/dashboard");
              setLoading(false);
            }}
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.428-2.519 4.114-5.136 4.114-3.478 0-6.3-2.823-6.3-6.3 0-3.477 2.822-6.3 6.3-6.3 1.63 0 3.11.618 4.242 1.62l3.022-3.023C19.062 2.502 15.86 1 12.24 1 5.866 1 .7 6.166.7 12.54s5.166 11.54 11.54 11.54c6.262 0 11.233-5.074 11.233-11.54 0-.766-.085-1.512-.233-2.255H12.24z"
              />
            </svg>
            Google
          </Button>

          <p className="text-center text-sm text-text-mid">
            Nouveau sur Agora ?{" "}
            <Link href="/register" className="text-green-mid hover:underline font-semibold">
              Créer mon compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
