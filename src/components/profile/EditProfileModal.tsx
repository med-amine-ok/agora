"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, GraduationCap, Heart, Settings, Globe, Shield } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  university: string;
  year: string;
  specialty: string;
  bio: string;
  onSave: (data: { university: string; year: string; specialty: string; bio: string }) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  university: initialUniversity,
  year: initialYear,
  specialty: initialSpecialty,
  bio: initialBio,
  onSave,
}: EditProfileModalProps) {
  const [university, setUniversity] = useState(initialUniversity);
  const [year, setYear] = useState(initialYear);
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [bio, setBio] = useState(initialBio);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ university, year, specialty, bio });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-teal-dark/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-teal/15 bg-white-custom shadow-2xl p-6 md:p-8"
          >
            <div className="flex items-center justify-between border-b border-teal/10 pb-4 mb-6">
              <h2 className="text-lg font-bold font-display text-text-dark flex items-center gap-2">
                <Settings className="h-5 w-5 text-teal" /> Modifier mes informations
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-surface/50 text-text-light hover:text-text-dark transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-dark">Biographie</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl border border-teal/15 bg-white focus:outline-none focus:border-teal text-xs text-text-dark resize-none transition-colors"
                  placeholder="Présentez-vous en quelques mots..."
                />
              </div>

              {/* University */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-dark flex items-center gap-1">
                  <GraduationCap className="h-4 w-4 text-teal" /> Université / Faculté
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full p-3 rounded-xl border border-teal/15 bg-white focus:outline-none focus:border-teal text-xs text-text-dark transition-colors"
                />
              </div>

              {/* Academic Year */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-dark">Année d'Étude</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full p-3 rounded-xl border border-teal/15 bg-white focus:outline-none focus:border-teal text-xs text-text-dark transition-colors"
                >
                  <option value="1ère Année - Sciences Médicales">1ère Année - Sciences Médicales</option>
                  <option value="2ème Année - Préclinique">2ème Année - Préclinique</option>
                  <option value="3ème Année - Préclinique">3ème Année - Préclinique</option>
                  <option value="4ème Année - Externe">4ème Année - Externe (Stage Clinique)</option>
                  <option value="5ème Année - Externe">5ème Année - Externe (Stage Clinique)</option>
                  <option value="6ème Année - Externe">6ème Année - Externe (Stage Clinique)</option>
                  <option value="7ème Année - Interne">7ème Année - Interne (Internat)</option>
                </select>
              </div>

              {/* Specialty Focus */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-dark flex items-center gap-1">
                  <Heart className="h-4 w-4 text-accent" /> Spécialité Favorite
                </label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full p-3 rounded-xl border border-teal/15 bg-white focus:outline-none focus:border-teal text-xs text-text-dark transition-colors"
                />
              </div>

              <div className="pt-4 border-t border-teal/10 flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-text-light hover:bg-surface/50 transition-all cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal hover:bg-teal-dark text-white-custom rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Save className="h-4 w-4" /> Enregistrer
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
