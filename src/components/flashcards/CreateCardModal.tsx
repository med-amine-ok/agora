"use client";

import React, { useState, useEffect } from "react";
import { X, Check, BookOpen, ImageIcon, HelpCircle, FileText, Bookmark, Eye, Sparkles } from "lucide-react";
import { LESSONS_DATA, MOCK_CHAPTERS, MOCK_LESSON_LIST } from "@/app/(student)/lessons/mockLessonsData";
import { useFlashcardStore } from "@/lib/store/flashcardStore";
import { FlashcardType } from "@/types/flashcard";
import { motion } from "framer-motion";

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

  // Preview state
  const [previewFlipped, setPreviewFlipped] = useState(false);

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
      front: frontText || "Question Recto",
      back: backText || "Réponse Verso",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-5xl rounded-3xl bg-[#0D2E2E] border border-teal/20 shadow-2xl overflow-hidden p-6 md:p-8 space-y-6 max-h-[95vh] overflow-y-auto text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-black tracking-tight text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-light" /> Créateur de Flashcard Manuel
          </h3>
          <button 
            onClick={onClose} 
            className="rounded-xl p-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Side-by-Side Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Column 1: Creator Form (Inputs) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5 text-xs text-teal-light">
            
            {/* Type Tabs */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50">Type de Flashcard</label>
              <div className="flex flex-wrap gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl">
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
                      onClick={() => {
                        setType(tab.id);
                        setPreviewFlipped(false);
                      }}
                      className={`flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-teal text-white shadow-md" 
                          : "text-teal-light/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cascading dropdowns */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50">Matière</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-teal-light focus:outline-none cursor-pointer"
                >
                  {LESSONS_DATA.map(sub => (
                    <option key={sub.id} value={sub.id} className="bg-[#0D2E2E]">{sub.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50">Chapitre</label>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-teal-light focus:outline-none cursor-pointer"
                >
                  {filteredChapters.map(chap => (
                    <option key={chap.id} value={chap.id} className="bg-[#0D2E2E]">{chap.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50">Leçon</label>
                <select
                  value={selectedLesson}
                  onChange={(e) => setSelectedLesson(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-teal-light focus:outline-none cursor-pointer"
                >
                  {filteredLessons.map(les => (
                    <option key={les.id} value={les.id} className="bg-[#0D2E2E]">{les.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Type-specific fields */}
            {type === "definition" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50">Recto (Terme)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Valve Mitrale"
                    value={frontText}
                    onChange={(e) => setFrontText(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-teal-light/30 focus:border-teal-light focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50">Verso (Définition)</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Définition ou explication détaillée..."
                    value={backText}
                    onChange={(e) => setBackText(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-teal-light/30 focus:border-teal-light focus:outline-none"
                  />
                </div>
              </div>
            )}

            {type === "image_question" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50">Lien URL de l'image</label>
                  <input
                    type="url"
                    placeholder="Lien URL de l'image médicale..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-teal-light/30 focus:border-teal-light focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50">Question à poser</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Identifiez cette structure anatomique..."
                    value={frontText}
                    onChange={(e) => setFrontText(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-teal-light/30 focus:border-teal-light focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50">Réponse</label>
                  <input
                    type="text"
                    required
                    placeholder="Nom de la structure et rôle..."
                    value={backText}
                    onChange={(e) => setBackText(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-teal-light/30 focus:border-teal-light focus:outline-none"
                  />
                </div>
              </div>
            )}

            {type === "true_false" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50">Affirmation</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: L'osmolarité normale du plasma est de 300 mOsm/kg."
                    value={frontText}
                    onChange={(e) => setFrontText(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-teal-light/30 focus:border-teal-light focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50 block">L'affirmation est :</label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-xs">
                      <input
                        type="radio"
                        checked={isAffirmationTrue === true}
                        onChange={() => setIsAffirmationTrue(true)}
                        className="text-teal focus:ring-teal bg-white/5 border-white/10"
                      />
                      <span>VRAIE</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-xs">
                      <input
                        type="radio"
                        checked={isAffirmationTrue === false}
                        onChange={() => setIsAffirmationTrue(false)}
                        className="text-teal focus:ring-teal bg-white/5 border-white/10"
                      />
                      <span>FAUSSE</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50">Explication / Justification</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Pourquoi est-ce vrai ou faux..."
                    value={backText}
                    onChange={(e) => setBackText(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-teal-light/30 focus:border-teal-light focus:outline-none"
                  />
                </div>
              </div>
            )}

            {type === "fill_blank" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50">Phrase complète avec brackets</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Les reins filtrent le sang au niveau du [glomérule]."
                    value={frontText}
                    onChange={(e) => setFrontText(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-teal-light/30 focus:border-teal-light focus:outline-none"
                  />
                  <span className="text-[9px] text-teal-light/40 block mt-1 leading-normal">
                    Enveloppez le mot secret à cacher entre crochets : [mot]
                  </span>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50">Explication / Contexte additionnel</label>
                  <input
                    type="text"
                    required
                    placeholder="Raison ou détail physiologique..."
                    value={backText}
                    onChange={(e) => setBackText(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-teal-light/30 focus:border-teal-light focus:outline-none"
                  />
                </div>
              </div>
            )}

            {type === "image_label" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50">URL Image sans étiquettes (Vierge)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-teal-light/30 focus:border-teal-light focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50">URL Image avec étiquettes (Corrigé)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={imageBackUrl}
                    onChange={(e) => setImageBackUrl(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-teal-light/30 focus:border-teal-light focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50">Question / Consigne</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Nommez les structures indiquées..."
                    value={frontText}
                    onChange={(e) => setFrontText(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-teal-light/30 focus:border-teal-light focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50">Explications de correction</label>
                  <input
                    type="text"
                    required
                    placeholder="Détails anatomiques..."
                    value={backText}
                    onChange={(e) => setBackText(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-teal-light/30 focus:border-teal-light focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Difficulty Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50 block">Difficulté</label>
              <div className="flex gap-4">
                {([
                  { id: "easy", label: "Facile" },
                  { id: "medium", label: "Moyen" },
                  { id: "hard", label: "Difficile" }
                ] as const).map(diff => (
                  <label key={diff.id} className="inline-flex items-center gap-2 cursor-pointer font-bold text-xs text-white">
                    <input
                      type="radio"
                      checked={difficulty === diff.id}
                      onChange={() => setDifficulty(diff.id)}
                      className="text-teal focus:ring-teal bg-white/5 border-white/10"
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
                className="rounded border-white/10 text-teal focus:ring-teal h-4 w-4 bg-white/5 cursor-pointer"
              />
              <label htmlFor="propose" className="text-[10px] font-black uppercase tracking-wider text-teal-light/50 cursor-pointer">
                Proposer à la communauté (soumis à validation)
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 rounded-xl border border-white/10 bg-white/5 font-bold text-xs text-teal-light hover:bg-white/10 transition-all cursor-pointer text-center"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-xl bg-teal text-white font-bold text-xs hover:bg-teal-dark transition-all shadow-md cursor-pointer text-center"
              >
                Sauvegarder la carte →
              </button>
            </div>

          </form>

          {/* Column 2: Interactive Live Preview Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4 bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden">
            
            <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-teal-light/40">
              <Eye className="h-4 w-4" /> Prévisualisation en direct
            </div>

            {/* Card Preview Container */}
            <div className="relative w-full max-w-[280px] h-[340px] perspective-1000 mt-4">
              <motion.div
                animate={{ rotateY: previewFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformStyle: "preserve-3d" }}
                className="w-full h-full relative"
              >
                {/* Preview Front */}
                <div 
                  style={{ backfaceVisibility: "hidden" }}
                  className="absolute inset-0 w-full h-full rounded-2xl bg-[#0D2E2E] border border-teal/20 p-5 flex flex-col justify-between text-white shadow-xl"
                >
                  <span className="text-[8px] font-black uppercase tracking-wider bg-white/10 border border-white/10 rounded-full px-2 py-0.5 self-start">
                    {type}
                  </span>

                  <div className="my-auto text-center space-y-3">
                    {type === "true_false" ? (
                      <p className="text-xs font-bold leading-relaxed italic text-white/90">
                        &ldquo;{frontText || "Saisissez l'affirmation..."}&rdquo;
                      </p>
                    ) : type === "fill_blank" ? (
                      <p className="text-xs font-bold leading-relaxed text-white/90">
                        {frontText ? frontText.replace(/\[(.*?)\]/g, " [???] ") : "Saisissez le texte avec [brackets]..."}
                      </p>
                    ) : (
                      <p className="text-xs font-bold leading-relaxed text-white/90">
                        {frontText || "Saisissez la question..."}
                      </p>
                    )}

                    {(type === "image_question" || type === "image_label") && (
                      <div className="h-24 w-full bg-white/10 rounded-lg flex items-center justify-center border border-dashed border-teal/20 overflow-hidden">
                        {imageUrl ? (
                          <img src={imageUrl} alt="preview" className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-teal/40" />
                        )}
                      </div>
                    )}
                  </div>

                  <span className="text-[8px] font-bold text-teal-light/40 text-center uppercase tracking-wider">
                    Agora Preview
                  </span>
                </div>

                {/* Preview Back */}
                <div 
                  style={{ 
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }}
                  className="absolute inset-0 w-full h-full rounded-2xl bg-[#0D2E2E] border border-teal/20 p-5 flex flex-col justify-between text-white shadow-xl"
                >
                  <span className="text-[8px] font-black uppercase tracking-wider bg-teal/20 border border-teal/30 rounded-full px-2 py-0.5 self-start text-teal-light">
                    Réponse
                  </span>

                  <div className="my-auto text-center space-y-2">
                    {type === "true_false" && (
                      <span className="inline-block text-[8px] font-black tracking-wider uppercase bg-white/10 px-2 py-0.5 rounded border border-white/10 mb-2">
                        Affirmation: {isAffirmationTrue ? "VRAIE" : "FAUSSE"}
                      </span>
                    )}
                    <p className="text-xs font-bold leading-relaxed text-teal-light/90">
                      {backText || "Saisissez la réponse / explication..."}
                    </p>
                  </div>

                  <span className="text-[8px] font-bold text-teal-light/40 text-center uppercase tracking-wider">
                    Agora Preview
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Toggle Preview Button */}
            <button
              type="button"
              onClick={() => setPreviewFlipped(!previewFlipped)}
              className="py-2 px-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-wider text-teal-light hover:bg-white/10 transition-all cursor-pointer"
            >
              Retourner l'aperçu
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
