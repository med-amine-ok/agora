"use client";

import React, { useState, useEffect } from "react";
import { X, Check, BookOpen, ImageIcon, HelpCircle, FileText, Bookmark } from "lucide-react";
import { LESSONS_DATA, MOCK_CHAPTERS, MOCK_LESSON_LIST } from "@/app/(student)/lessons/mockLessonsData";
import { useFlashcardStore } from "@/lib/store/flashcardStore";
import { FlashcardType } from "@/types/flashcard";

interface CreateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDeckId?: string;
}

export default function CreateCardModal({ isOpen, onClose, defaultDeckId }: CreateCardModalProps) {
  const { addManualCard, decks } = useFlashcardStore();

  const [type, setType] = useState<FlashcardType>("definition");

  // Cascading dropdowns state
  const [selectedSubject, setSelectedSubject] = useState(LESSONS_DATA[0].id);
  const [selectedChapter, setSelectedChapter] = useState(MOCK_CHAPTERS[0].id);
  const [selectedLesson, setSelectedLesson] = useState(MOCK_LESSON_LIST[0].id);

  // Form inputs
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageBackUrl, setImageBackUrl] = useState("");
  const [isAffirmationTrue, setIsAffirmationTrue] = useState(true);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [proposeToCommunity, setProposeToCommunity] = useState(true);

  // Filter lists based on selections
  const filteredChapters = MOCK_CHAPTERS.filter(c => c.moduleId === selectedSubject);
  const filteredLessons = MOCK_LESSON_LIST.filter(l => l.chapterId === selectedChapter);

  // Sync child dropdown values
  useEffect(() => {
    if (filteredChapters.length > 0) {
      setSelectedChapter(filteredChapters[0].id);
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (filteredLessons.length > 0) {
      setSelectedLesson(filteredLessons[0].id);
    }
  }, [selectedChapter]);

  // If a default deck ID is specified, pre-fill the cascading dropdown values
  useEffect(() => {
    if (defaultDeckId && isOpen) {
      const targetDeck = decks.find(d => d.id === defaultDeckId);
      if (targetDeck) {
        setSelectedSubject(targetDeck.moduleId);
        setSelectedChapter(targetDeck.chapterId);
        setSelectedLesson(targetDeck.lessonId);
      }
    }
  }, [defaultDeckId, isOpen, decks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Map deckId. Find a deck matching this lesson, or use first deck
    const matchedDeck = decks.find(d => d.lessonId === selectedLesson) || decks[0] || { id: "d1" };

    addManualCard({
      deckId: defaultDeckId || matchedDeck.id,
      lessonId: selectedLesson,
      chapterId: selectedChapter,
      moduleId: selectedSubject,
      type,
      front: frontText,
      back: backText,
      imageUrl: (type === "image_question" || type === "image_label") ? imageUrl || "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=400" : undefined,
      imageBackUrl: type === "image_label" ? imageBackUrl || "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=400" : undefined,
      isAffirmationTrue: type === "true_false" ? isAffirmationTrue : undefined,
      difficulty,
      proposeToCommunity,
    });

    // Reset inputs
    setFrontText("");
    setBackText("");
    setImageUrl("");
    setImageBackUrl("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl rounded-3xl bg-white border border-teal/10 shadow-xl overflow-hidden p-6 md:p-8 space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-text-dark">
            Nouvelle flashcard
          </h3>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-surface text-text-light hover:text-text-dark">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Type Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-surface rounded-xl">
          {([
            { id: "definition", label: "Définition", icon: BookOpen },
            { id: "image_question", label: "Image", icon: ImageIcon },
            { id: "true_false", label: "Vrai/Faux", icon: HelpCircle },
            { id: "fill_blank", label: "Compléter", icon: FileText },
            { id: "image_label", label: "Schéma", icon: Bookmark }
          ] as const).map(tab => {
            const Icon = tab.icon;
            const isSelected = type === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setType(tab.id)}
                className={`flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  isSelected 
                    ? "bg-teal text-white shadow-sm" 
                    : "text-text-mid hover:text-text-dark hover:bg-white/50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-text-dark">
          
          {/* Cascading dropdowns */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-text-light">Matière</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full rounded-lg border border-teal/15 bg-white p-2.5 text-xs focus:border-teal focus:outline-none"
              >
                {LESSONS_DATA.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-text-light">Chapitre</label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full rounded-lg border border-teal/15 bg-white p-2.5 text-xs focus:border-teal focus:outline-none"
              >
                {filteredChapters.map(chap => (
                  <option key={chap.id} value={chap.id}>{chap.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-text-light">Leçon</label>
              <select
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                className="w-full rounded-lg border border-teal/15 bg-white p-2.5 text-xs focus:border-teal focus:outline-none"
              >
                {filteredLessons.map(les => (
                  <option key={les.id} value={les.id}>{les.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Type-specific fields */}
          {type === "definition" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-text-light">Recto (Terme)</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Valve Mitrale"
                  value={frontText}
                  onChange={(e) => setFrontText(e.target.value)}
                  className="w-full rounded-lg border border-teal/15 bg-white p-2.5 focus:border-teal focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-text-light">Verso (Définition)</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Définition ou explication détaillée..."
                  value={backText}
                  onChange={(e) => setBackText(e.target.value)}
                  className="w-full rounded-lg border border-teal/15 bg-white p-2.5 focus:border-teal focus:outline-none"
                />
              </div>
            </div>
          )}

          {type === "image_question" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-text-light">Lien URL de l'image</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full rounded-lg border border-teal/15 bg-white p-2.5 focus:border-teal focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-text-light">Question à poser</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Identifiez cette structure anatomique..."
                  value={frontText}
                  onChange={(e) => setFrontText(e.target.value)}
                  className="w-full rounded-lg border border-teal/15 bg-white p-2.5 focus:border-teal focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-text-light">Réponse</label>
                <input
                  type="text"
                  required
                  placeholder="Nom de la structure et rôle..."
                  value={backText}
                  onChange={(e) => setBackText(e.target.value)}
                  className="w-full rounded-lg border border-teal/15 bg-white p-2.5 focus:border-teal focus:outline-none"
                />
              </div>
            </div>
          )}

          {type === "true_false" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-text-light">Affirmation</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: L'osmolarité normale du plasma est de 300 mOsm/kg."
                  value={frontText}
                  onChange={(e) => setFrontText(e.target.value)}
                  className="w-full rounded-lg border border-teal/15 bg-white p-2.5 focus:border-teal focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-text-light block">L'affirmation est :</label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="radio"
                      checked={isAffirmationTrue === true}
                      onChange={() => setIsAffirmationTrue(true)}
                      className="text-teal focus:ring-teal"
                    />
                    <span>VRAIE</span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="radio"
                      checked={isAffirmationTrue === false}
                      onChange={() => setIsAffirmationTrue(false)}
                      className="text-teal focus:ring-teal"
                    />
                    <span>FAUSSE</span>
                  </label>
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-text-light">Explication / Justification</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Pourquoi est-ce vrai ou faux..."
                  value={backText}
                  onChange={(e) => setBackText(e.target.value)}
                  className="w-full rounded-lg border border-teal/15 bg-white p-2.5 focus:border-teal focus:outline-none"
                />
              </div>
            </div>
          )}

          {type === "fill_blank" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-text-light">Phrase complète avec brackets</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Les reins filtrent le sang au niveau du [glomérule]."
                  value={frontText}
                  onChange={(e) => setFrontText(e.target.value)}
                  className="w-full rounded-lg border border-teal/15 bg-white p-2.5 focus:border-teal focus:outline-none"
                />
                <span className="text-[10px] text-text-light">
                  Enveloppez le mot secret à cacher entre crochets : [mot]
                </span>
              </div>
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-text-light">Explication / Contexte additionnel</label>
                <input
                  type="text"
                  required
                  placeholder="Raison ou détail physiologique..."
                  value={backText}
                  onChange={(e) => setBackText(e.target.value)}
                  className="w-full rounded-lg border border-teal/15 bg-white p-2.5 focus:border-teal focus:outline-none"
                />
              </div>
            </div>
          )}

          {type === "image_label" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-text-light">URL Image sans étiquettes (Schéma vierge)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full rounded-lg border border-teal/15 bg-white p-2.5 focus:border-teal focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-text-light">URL Image avec étiquettes (Schéma corrigé)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageBackUrl}
                  onChange={(e) => setImageBackUrl(e.target.value)}
                  className="w-full rounded-lg border border-teal/15 bg-white p-2.5 focus:border-teal focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-text-light">Question / Consigne</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Nommez les structures indiquées..."
                  value={frontText}
                  onChange={(e) => setFrontText(e.target.value)}
                  className="w-full rounded-lg border border-teal/15 bg-white p-2.5 focus:border-teal focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-text-light">Explications de correction</label>
                <input
                  type="text"
                  required
                  placeholder="Détails anatomiques..."
                  value={backText}
                  onChange={(e) => setBackText(e.target.value)}
                  className="w-full rounded-lg border border-teal/15 bg-white p-2.5 focus:border-teal focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Difficulty Selection */}
          <div className="space-y-1.5">
            <label className="font-bold uppercase tracking-wider text-text-light block">Difficulté</label>
            <div className="flex gap-4">
              {([
                { id: "easy", label: "Facile" },
                { id: "medium", label: "Moyen" },
                { id: "hard", label: "Difficile" }
              ] as const).map(diff => (
                <label key={diff.id} className="inline-flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="radio"
                    checked={difficulty === diff.id}
                    onChange={() => setDifficulty(diff.id)}
                    className="text-teal focus:ring-teal"
                  />
                  <span>{diff.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Propose to community */}
          <div className="flex items-center gap-2.5 py-1">
            <input
              type="checkbox"
              id="propose"
              checked={proposeToCommunity}
              onChange={(e) => setProposeToCommunity(e.target.checked)}
              className="rounded border-teal/20 text-teal focus:ring-teal h-4 w-4"
            />
            <label htmlFor="propose" className="font-bold uppercase tracking-wider text-text-light cursor-pointer">
              Proposer à la communauté (soumis à validation)
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-teal/15 text-xs font-semibold text-text-mid hover:bg-surface transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-full bg-teal text-white text-xs font-semibold hover:bg-teal-dark transition-all shadow-sm"
            >
              Sauvegarder la carte →
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
