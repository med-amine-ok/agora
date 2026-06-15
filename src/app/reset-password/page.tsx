"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react";
import Button from "@/presentation/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const resetSchema = z.object({
  email: z.string().email("Veuillez saisir une adresse e-mail valide.")
});

type ResetInputs = z.infer<typeof resetSchema>;

export default function ResetPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailVal, setEmailVal] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<ResetInputs>({
    resolver: zodResolver(resetSchema)
  });

  const onSubmit = async (data: ResetInputs) => {
    setLoading(true);
    setEmailVal(data.email);
    // Simulate API request
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-beige-base text-text-dark font-sans">
      {/* Left Column: Branding / Dark Sidebar */}
      <div className="hidden md:flex md:w-[40%] bg-green-dark text-white p-12 flex-col justify-between relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#2D6A4F,transparent_60%)] opacity-35" />
        
        <div>
          <Link href="/login" className="inline-flex items-center gap-2 text-green-light hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-semibold">Retour à la connexion</span>
          </Link>
          <div className="mt-16 space-y-4 relative z-10">
            <span className="font-serif text-4xl font-extrabold tracking-wide text-white">Agora</span>
            <p className="text-green-light/95 text-lg leading-relaxed font-light">
              "Ne perdez pas le rythme. Récupérez vos accès en toute sécurité."
            </p>
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-md border border-white/10 mt-auto relative z-10 text-xs text-white/60">
          En cas de problème persistant de connexion, veuillez contacter le secrétariat de votre faculté ou le support Agora à support@agora.dz.
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 bg-beige-light border border-border-brand/40 p-8 rounded-lg shadow-sm">
          <div className="space-y-2">
            <h2 className="font-serif text-3xl font-bold text-green-dark tracking-tight font-semibold">Réinitialisation</h2>
            <p className="text-text-mid text-sm">
              Saisissez votre e-mail pour recevoir les instructions de récupération de mot de passe.
            </p>
          </div>

          {submitted ? (
            <div className="bg-green-dark/5 border border-green-mid/20 p-6 rounded-md text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-mid mx-auto" />
              <div className="space-y-2">
                <h4 className="font-bold text-green-dark font-serif text-lg">Lien envoyé !</h4>
                <p className="text-text-mid text-sm leading-relaxed">
                  Nous avons envoyé un e-mail à <span className="font-semibold text-text-dark">{emailVal}</span> contenant les instructions de récupération.
                </p>
              </div>
              <div className="pt-2">
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full">Retourner à la connexion</Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-semibold text-text-dark">
                  Adresse e-mail académique
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
                  <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-text-light" />
                </div>
                {errors.email && (
                  <p className="text-xs text-error-brand mt-1 flex items-center gap-1 animate-shake">
                    <AlertCircle className="w-3 h-3" /> {errors.email.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full py-3" disabled={loading}>
                {loading ? "Envoi du lien..." : "Envoyer le lien de récupération"}
              </Button>

              <div className="text-center text-sm">
                <Link href="/login" className="text-green-mid hover:underline font-semibold flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Retour à l'écran de connexion
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
