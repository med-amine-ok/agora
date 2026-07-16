"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useFlashcardStore } from "@/lib/store/flashcardStore";
import { 
  Check, 
  X, 
  ShieldAlert, 
  BookOpen, 
  AlertCircle, 
  Plus, 
  Upload, 
  FileText, 
  Sparkles, 
  HelpCircle, 
  ImageIcon, 
  ArrowRight, 
  CheckCircle,
  FileSpreadsheet,
  Layers,
  ArrowUpDown
} from "lucide-react";
import { LESSONS_DATA, MOCK_CHAPTERS, MOCK_LESSON_LIST } from "@/app/(student)/lessons/mockLessonsData";
import { FlashcardType } from "@/types/flashcard";

export default function AdminFlashcardsPage() {
  const { flashcards, decks, moderateCard, addManualCard } = useFlashcardStore();
  const [activeTab, setActiveTab] = useState<"moderate" | "create" | "import">("moderate");

  // --- MODERATION STATE ---
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [activeRejectId, setActiveRejectId] = useState<string | null>(null);
  const pendingCards = useMemo(() => flashcards.filter(c => c.status === "pending_review"), [flashcards]);

  const handleApprove = (id: string) => {
    moderateCard(id, "approve");
  };

  const handleReject = (id: string) => {
    const reason = rejectReason[id] || "Ne respecte pas les critères de clarté de la plateforme.";
    moderateCard(id, "reject", reason);
    setActiveRejectId(null);
  };

  const handleReasonChange = (id: string, text: string) => {
    setRejectReason(prev => ({ ...prev, [id]: text }));
  };

  // --- MANUAL CREATION STATE ---
  const [selectedSubject, setSelectedSubject] = useState(LESSONS_DATA[0].id);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [cardType, setCardType] = useState<FlashcardType>("definition");
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageBackUrl, setImageBackUrl] = useState("");
  const [isAffirmationTrue, setIsAffirmationTrue] = useState(true);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [proposeToCommunity, setProposeToCommunity] = useState(false);
  const [previewFlipped, setPreviewFlipped] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Sync chapters and lessons for cascading dropdowns
  const filteredChapters = useMemo(() => {
    return MOCK_CHAPTERS.filter(c => c.moduleId === selectedSubject);
  }, [selectedSubject]);

  const filteredLessons = useMemo(() => {
    return MOCK_LESSON_LIST.filter(l => l.chapterId === selectedChapter);
  }, [selectedChapter]);

  useEffect(() => {
    if (filteredChapters.length > 0) {
      setSelectedChapter(filteredChapters[0].id);
    } else {
      setSelectedChapter("");
    }
  }, [selectedSubject, filteredChapters]);

  useEffect(() => {
    if (filteredLessons.length > 0) {
      setSelectedLesson(filteredLessons[0].id);
    } else {
      setSelectedLesson("");
    }
  }, [selectedChapter, filteredLessons]);

  const handleCreateCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Map deckId. Find a deck matching this lesson
    const matchedDeck = decks.find(d => d.lessonId === selectedLesson) || decks[0] || { id: "d1" };

    addManualCard({
      deckId: matchedDeck.id,
      lessonId: selectedLesson,
      chapterId: selectedChapter,
      moduleId: selectedSubject,
      type: cardType,
      front: frontText || "Question Recto",
      back: backText || "Réponse Verso",
      imageUrl: (cardType === "image_question" || cardType === "image_label") ? imageUrl || undefined : undefined,
      imageBackUrl: cardType === "image_label" ? imageBackUrl || undefined : undefined,
      isAffirmationTrue: cardType === "true_false" ? isAffirmationTrue : undefined,
      difficulty,
      proposeToCommunity,
    });

    setFrontText("");
    setBackText("");
    setImageUrl("");
    setImageBackUrl("");
    setSuccessMessage("Flashcard créée avec succès !");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // --- BULK IMPORT STATE ---
  const [csvText, setCsvText] = useState("");
  const [parsedCards, setParsedCards] = useState<any[]>([]);
  const [importDelimiter, setImportDelimiter] = useState<"auto" | "," | ";" | "\t">("auto");
  const [importSummary, setImportSummary] = useState<{ total: number; valid: number; invalid: number } | null>(null);
  const [importSuccess, setImportSuccess] = useState("");

  const handleParseCsv = () => {
    if (!csvText.trim()) return;

    // Detect delimiter
    let delim = importDelimiter;
    if (delim === "auto") {
      const commas = (csvText.match(/,/g) || []).length;
      const semicolons = (csvText.match(/;/g) || []).length;
      const tabs = (csvText.match(/\t/g) || []).length;
      delim = tabs > commas && tabs > semicolons ? "\t" : semicolons > commas ? ";" : ",";
    }

    const lines = csvText.split(/\r?\n/);
    const results: any[] = [];
    let validCount = 0;
    let invalidCount = 0;

    // Simple parser (assuming headers in first line)
    // Headers: front, back, type, isAffirmationTrue, imageUrl, imageBackUrl, difficulty
    const headers = lines[0].toLowerCase().split(delim).map(h => h.trim().replace(/^["']|["']$/g, ""));
    
    const requiredHeaders = ["front", "back"];
    const hasRequired = requiredHeaders.every(req => headers.includes(req));

    if (!hasRequired) {
      alert("Erreur de format : Les colonnes 'front' et 'back' sont requises dans la première ligne.");
      return;
    }

    const frontIdx = headers.indexOf("front");
    const backIdx = headers.indexOf("back");
    const typeIdx = headers.indexOf("type");
    const trueFalseIdx = headers.indexOf("isaffirmationtrue");
    const imageIdx = headers.indexOf("imageurl");
    const imageBackIdx = headers.indexOf("imagebackurl");
    const diffIdx = headers.indexOf("difficulty");

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Simple CSV split (handling optional quotes)
      const values = line.split(delim).map(v => v.trim().replace(/^["']|["']$/g, ""));
      
      const front = values[frontIdx] || "";
      const back = values[backIdx] || "";
      let type: FlashcardType = (values[typeIdx] as FlashcardType) || "definition";
      const isAffirmationTrueRaw = values[trueFalseIdx] || "";
      const isAffTrue = isAffirmationTrueRaw.toLowerCase() === "true" || isAffirmationTrueRaw.toLowerCase() === "vrai" || isAffirmationTrueRaw === "1";
      const imgUrl = values[imageIdx] || "";
      const imgBackUrl = values[imageBackIdx] || "";
      const diff = (values[diffIdx] as "easy" | "medium" | "hard") || "medium";

      // Simple validation
      const isValid = front.length > 2 && back.length > 2;

      if (isValid) {
        validCount++;
      } else {
        invalidCount++;
      }

      results.push({
        id: `parsed-${i}`,
        front,
        back,
        type,
        isAffirmationTrue: type === "true_false" ? isAffTrue : undefined,
        imageUrl: imgUrl || undefined,
        imageBackUrl: imgBackUrl || undefined,
        difficulty: diff,
        isValid
      });
    }

    setParsedCards(results);
    setImportSummary({
      total: results.length,
      valid: validCount,
      invalid: invalidCount
    });
  };

  const executeBulkImport = () => {
    const validOnly = parsedCards.filter(c => c.isValid);
    if (validOnly.length === 0) return;

    // We import into the selected manual creation lesson & deck
    const matchedDeck = decks.find(d => d.lessonId === selectedLesson) || decks[0] || { id: "d1" };

    validOnly.forEach(card => {
      addManualCard({
        deckId: matchedDeck.id,
        lessonId: selectedLesson,
        chapterId: selectedChapter,
        moduleId: selectedSubject,
        type: card.type,
        front: card.front,
        back: card.back,
        imageUrl: card.imageUrl,
        imageBackUrl: card.imageBackUrl,
        isAffirmationTrue: card.isAffirmationTrue,
        difficulty: card.difficulty,
        proposeToCommunity: false, // directly imported by admin
      });
    });

    setImportSuccess(`${validOnly.length} flashcards importées avec succès dans la leçon sélectionnée !`);
    setCsvText("");
    setParsedCards([]);
    setImportSummary(null);
    setTimeout(() => setImportSuccess(""), 5000);
  };

  const loadSampleCsv = () => {
    setCsvText(
      `front${importDelimiter === "auto" ? "," : importDelimiter}back${importDelimiter === "auto" ? "," : importDelimiter}type${importDelimiter === "auto" ? "," : importDelimiter}isAffirmationTrue${importDelimiter === "auto" ? "," : importDelimiter}difficulty\n` +
      `"Quelle est la principale complication d'une sténose aortique serrée ?"${importDelimiter === "auto" ? "," : importDelimiter}"L'insuffisance cardiaque gauche, l'angor d'effort et la syncope."${importDelimiter === "auto" ? "," : importDelimiter}"definition"${importDelimiter === "auto" ? "," : importDelimiter}""${importDelimiter === "auto" ? "," : importDelimiter}"hard"\n` +
      `"L'ECG d'une péricardite montre typiquement un sous-décalage de l'espace PR."${importDelimiter === "auto" ? "," : importDelimiter}"VRAI - C'est un signe précoce très spécifique."${importDelimiter === "auto" ? "," : importDelimiter}"true_false"${importDelimiter === "auto" ? "," : importDelimiter}"vrai"${importDelimiter === "auto" ? "," : importDelimiter}"medium"\n` +
      `"La [___] est le traitement de choix de la fibrillation auriculaire instable."${importDelimiter === "auto" ? "," : importDelimiter}"La cardioversion électrique"${importDelimiter === "auto" ? "," : importDelimiter}"fill_blank"${importDelimiter === "auto" ? "," : importDelimiter}""${importDelimiter === "auto" ? "," : importDelimiter}"medium"`
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 text-xs text-text-dark">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-teal/10 pb-4 gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold font-display text-text-dark flex items-center gap-2">
            📇 Administration des Flashcards
          </h1>
          <p className="text-xs text-text-light">
            Gérez la file de modération communautaire ou importez de nouvelles flashcards unitaires et en masse.
          </p>
        </div>

        {/* Dynamic Tab Switcher */}
        <div className="flex bg-surface p-1 rounded-xl border border-teal/10 w-fit shrink-0">
          <button
            onClick={() => setActiveTab("moderate")}
            className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "moderate"
                ? "bg-teal text-white shadow-sm"
                : "text-text-light hover:text-text-dark"
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Modération ({pendingCards.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "create"
                ? "bg-teal text-white shadow-sm"
                : "text-text-light hover:text-text-dark"
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Création Unitaire</span>
          </button>
          <button
            onClick={() => setActiveTab("import")}
            className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "import"
                ? "bg-teal text-white shadow-sm"
                : "text-text-light hover:text-text-dark"
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Import en Masse</span>
          </button>
        </div>
      </div>

      {/* Target Module / Chapter / Lesson Selector Bar (Shared for Create & Import Tabs) */}
      {(activeTab === "create" || activeTab === "import") && (
        <div className="p-4 rounded-2xl bg-teal/5 border border-teal/10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-teal-dark tracking-wider block">Matière / Module Cible</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-teal/20 bg-white font-sans text-xs focus:ring-1 focus:ring-teal focus:outline-none text-text-dark"
            >
              {LESSONS_DATA.map(subj => (
                <option key={subj.id} value={subj.id}>{subj.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-teal-dark tracking-wider block">Chapitre / Unité</label>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-teal/20 bg-white font-sans text-xs focus:ring-1 focus:ring-teal focus:outline-none text-text-dark"
              disabled={filteredChapters.length === 0}
            >
              {filteredChapters.map(chap => (
                <option key={chap.id} value={chap.id}>{chap.title}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-teal-dark tracking-wider block">Leçon / Deck de destination</label>
            <select
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-teal/20 bg-white font-sans text-xs focus:ring-1 focus:ring-teal focus:outline-none text-text-dark"
              disabled={filteredLessons.length === 0}
            >
              {filteredLessons.map(lesson => (
                <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* --- TAB 1: MODERATION QUEUE --- */}
      {activeTab === "moderate" && (
        <div className="space-y-4">
          {pendingCards.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-teal/20 p-12 text-center space-y-3 bg-white">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal/5 text-teal">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-display text-sm font-bold text-text-dark">File de modération vide</h3>
              <p className="text-[11px] text-text-light max-w-sm mx-auto">
                Aucune proposition de flashcard n'est en attente de révision pour le moment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingCards.map(card => (
                <div 
                  key={card.id}
                  className="p-5 rounded-2xl border border-teal/10 bg-white shadow-sm flex flex-col md:flex-row gap-5 items-start justify-between hover:shadow-md transition-all"
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-teal/5 px-2 py-0.5 text-[9px] font-bold text-teal border border-teal/10 uppercase">
                        {card.type}
                      </span>
                      <span className="text-[10px] text-text-light font-medium">
                        Proposé par : <strong className="text-text-dark">{card.authorName || "Anonyme"}</strong>
                      </span>
                      <span className="text-[10px] text-text-light">•</span>
                      <span className="text-[10px] text-text-light uppercase font-semibold">
                        {card.moduleId}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-text-light uppercase tracking-wider block">Recto (Question)</span>
                        <p className="font-sans font-medium text-xs text-text-dark bg-surface/40 p-3 rounded-lg border border-teal/5">
                          {card.front}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-text-light uppercase tracking-wider block">Verso (Réponse)</span>
                        <p className="font-sans font-medium text-xs text-text-dark bg-surface/40 p-3 rounded-lg border border-teal/5">
                          {card.back}
                        </p>
                      </div>
                    </div>

                    {(card.imageUrl || card.isAffirmationTrue !== undefined) && (
                      <div className="flex flex-wrap gap-4 pt-1">
                        {card.isAffirmationTrue !== undefined && (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 text-[10px] font-bold">
                            Affirmation : {card.isAffirmationTrue ? "VRAI" : "FAUX"}
                          </span>
                        )}
                        {card.imageUrl && (
                          <a 
                            href={card.imageUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-teal hover:underline text-[10px] font-semibold"
                          >
                            🖼️ Voir l'image associée
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-teal/5">
                    <button
                      onClick={() => handleApprove(card.id)}
                      className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal px-4 py-2.5 font-bold text-white hover:bg-teal-dark transition-all cursor-pointer text-[10px]"
                    >
                      <Check className="h-4 w-4" /> Approuver
                    </button>

                    {activeRejectId === card.id ? (
                      <div className="w-full md:w-48 space-y-2 mt-2">
                        <textarea
                          placeholder="Indiquez le motif de rejet..."
                          value={rejectReason[card.id] || ""}
                          onChange={(e) => handleReasonChange(card.id, e.target.value)}
                          className="w-full p-2 border border-error/25 bg-white text-[11px] rounded-lg focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReject(card.id)}
                            className="flex-1 py-1.5 bg-error text-white font-bold rounded-lg hover:bg-error/95 cursor-pointer"
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => setActiveRejectId(null)}
                            className="px-2 py-1.5 border border-teal/15 text-text-light font-bold rounded-lg hover:bg-surface cursor-pointer"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveRejectId(card.id)}
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-error/20 bg-white px-4 py-2.5 font-bold text-error hover:bg-red-50 transition-all cursor-pointer text-[10px]"
                      >
                        <X className="h-4 w-4" /> Rejeter
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: MANUAL CREATION FORM WITH PREVIEW --- */}
      {activeTab === "create" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Creator form */}
          <form onSubmit={handleCreateCardSubmit} className="lg:col-span-7 space-y-5 bg-white p-6 rounded-3xl border border-teal/10 shadow-sm">
            <h3 className="font-display text-sm font-bold text-text-dark flex items-center gap-1.5">
              <Plus className="h-4 w-4 text-teal" /> Nouvelle Flashcard Unitaire
            </h3>

            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> {successMessage}
              </div>
            )}

            {/* Type Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-text-light">Type de Flashcard</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {([
                  { id: "definition", label: "Définition", icon: BookOpen },
                  { id: "image_question", label: "Image / Question", icon: ImageIcon },
                  { id: "true_false", label: "Vrai / Faux", icon: HelpCircle },
                  { id: "fill_blank", label: "Texte à trous", icon: FileText },
                  { id: "image_label", label: "Anatomie / Schéma", icon: Layers }
                ] as const).map(tab => {
                  const Icon = tab.icon;
                  const isSelected = cardType === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setCardType(tab.id);
                        setPreviewFlipped(false);
                      }}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-teal border-teal text-white shadow-sm" 
                          : "bg-white border-teal/15 text-text-light hover:bg-surface"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Fields */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-text-light block">
                  {cardType === "true_false" ? "Affirmation (Recto)" : cardType === "fill_blank" ? "Texte avec trous [___] (Recto)" : "Question / Concept (Recto)"}
                </label>
                <textarea
                  value={frontText}
                  onChange={(e) => setFrontText(e.target.value)}
                  placeholder={cardType === "fill_blank" ? "Le cœur possède [___] cavités." : "ex: Qu'est-ce que l'insuffisance cardiaque ?"}
                  rows={3}
                  required
                  className="w-full p-3 rounded-xl border border-teal/20 bg-white font-sans text-xs focus:ring-1 focus:ring-teal focus:outline-none text-text-dark"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-text-light block">
                  {cardType === "true_false" ? "Explication (Verso)" : cardType === "fill_blank" ? "Texte complet résolu (Verso)" : "Réponse / Définition (Verso)"}
                </label>
                <textarea
                  value={backText}
                  onChange={(e) => setBackText(e.target.value)}
                  placeholder={cardType === "fill_blank" ? "Le cœur possède [quatre] cavités." : "ex: Incapacité du cœur à pomper suffisamment de sang..."}
                  rows={3}
                  required
                  className="w-full p-3 rounded-xl border border-teal/20 bg-white font-sans text-xs focus:ring-1 focus:ring-teal focus:outline-none text-text-dark"
                />
              </div>

              {/* Conditional parameters */}
              {cardType === "true_false" && (
                <div className="flex items-center gap-4 bg-teal/5 p-3 rounded-xl border border-teal/10">
                  <span className="text-[10px] font-black uppercase text-teal-dark">Valeur de l'affirmation</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAffirmationTrue(true)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                        isAffirmationTrue ? "bg-emerald-600 text-white animate-pulse" : "bg-white text-text-light border border-teal/10 hover:bg-surface"
                      }`}
                    >
                      VRAI
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAffirmationTrue(false)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                        !isAffirmationTrue ? "bg-rose-600 text-white animate-pulse" : "bg-white text-text-light border border-teal/10 hover:bg-surface"
                      }`}
                    >
                      FAUX
                    </button>
                  </div>
                </div>
              )}

              {(cardType === "image_question" || cardType === "image_label") && (
                <div className="space-y-3 p-3 bg-teal/5 border border-teal/10 rounded-2xl">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-teal-dark block">URL de l'image (Recto)</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://ex.com/image.jpg"
                      className="w-full p-2.5 rounded-xl border border-teal/20 bg-white font-sans text-xs focus:ring-1 focus:ring-teal focus:outline-none text-text-dark"
                    />
                  </div>
                  {cardType === "image_label" && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-teal-dark block">URL de l'image annotée (Verso)</label>
                      <input
                        type="url"
                        value={imageBackUrl}
                        onChange={(e) => setImageBackUrl(e.target.value)}
                        placeholder="https://ex.com/annotated-image.jpg"
                        className="w-full p-2.5 rounded-xl border border-teal/20 bg-white font-sans text-xs focus:ring-1 focus:ring-teal focus:outline-none text-text-dark"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Difficulty & Visibility options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-light block">Difficulté</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-teal/20 bg-white font-sans text-xs focus:ring-1 focus:ring-teal focus:outline-none text-text-dark"
                  >
                    <option value="easy">Facile</option>
                    <option value="medium">Moyen</option>
                    <option value="hard">Difficile</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 self-end h-10 border border-teal/15 px-3 rounded-xl bg-surface/30">
                  <input
                    type="checkbox"
                    id="propose"
                    checked={proposeToCommunity}
                    onChange={(e) => setProposeToCommunity(e.target.checked)}
                    className="h-4 w-4 text-teal rounded focus:ring-teal"
                  />
                  <label htmlFor="propose" className="text-[10px] font-bold text-text-dark cursor-pointer select-none">
                    Proposer à la communauté (attente de modération)
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal text-white font-bold rounded-xl hover:bg-teal-dark transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm text-[11px] uppercase tracking-wider"
            >
              <Check className="h-4 w-4" /> Enregistrer la Flashcard
            </button>
          </form>

          {/* Interactive Card Preview */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-text-light">Aperçu Réaliste</span>
              <button
                type="button"
                onClick={() => setPreviewFlipped(prev => !prev)}
                className="text-teal hover:underline font-bold text-[10px] uppercase flex items-center gap-1 cursor-pointer"
              >
                <ArrowUpDown className="h-3.5 w-3.5" /> Retourner la carte
              </button>
            </div>

            {/* Flashcard container */}
            <div 
              onClick={() => setPreviewFlipped(prev => !prev)}
              className="w-full aspect-[4/3] rounded-3xl p-6 bg-gradient-to-br from-[#0F3838] to-[#0A2626] border border-teal/20 relative shadow-xl flex flex-col justify-between overflow-hidden cursor-pointer select-none text-white transition-all transform hover:scale-[1.01] duration-300"
            >
              {/* Radial Top-Left Light Effect */}
              <div className="absolute top-0 left-0 w-48 h-48 bg-teal-light/5 rounded-full filter blur-3xl pointer-events-none" />

              {/* Front view */}
              {!previewFlipped ? (
                <>
                  <div className="flex items-center justify-between z-10">
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[8px] font-bold tracking-wider uppercase border border-white/10 text-teal-light">
                      {cardType}
                    </span>
                    <span className="text-[9px] text-teal-light/60 uppercase font-black tracking-widest">{difficulty}</span>
                  </div>

                  <div className="my-auto text-center space-y-4 z-10 px-4">
                    {imageUrl && (cardType === "image_question" || cardType === "image_label") && (
                      <div className="w-full h-24 rounded-lg overflow-hidden bg-black/20 border border-white/5 flex items-center justify-center">
                        <img src={imageUrl} alt="preview" className="object-cover h-full w-full" />
                      </div>
                    )}
                    <h2 className="text-sm font-sans font-bold leading-relaxed text-white">
                      {frontText || "Saisissez votre question recto..."}
                    </h2>
                  </div>

                  <div className="text-center text-[9px] text-teal-light/40 z-10">
                    Recto (Cliquez pour retourner)
                  </div>
                </>
              ) : (
                /* Back view */
                <>
                  <div className="flex items-center justify-between z-10">
                    <span className="rounded-full bg-teal px-2 py-0.5 text-[8px] font-bold tracking-wider uppercase text-white">
                      RÉPONSE
                    </span>
                    {cardType === "true_false" && (
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${isAffirmationTrue ? "bg-emerald-600/30 text-emerald-400 border border-emerald-500/25" : "bg-rose-600/30 text-rose-400 border border-rose-500/25"}`}>
                        {isAffirmationTrue ? "VRAI" : "FAUX"}
                      </span>
                    )}
                  </div>

                  <div className="my-auto text-center space-y-4 z-10 px-4">
                    {imageBackUrl && cardType === "image_label" && (
                      <div className="w-full h-24 rounded-lg overflow-hidden bg-black/20 border border-white/5 flex items-center justify-center">
                        <img src={imageBackUrl} alt="preview back" className="object-cover h-full w-full" />
                      </div>
                    )}
                    <p className="text-xs font-sans font-medium text-teal-light/95 leading-relaxed whitespace-pre-line">
                      {backText || "Saisissez votre réponse verso..."}
                    </p>
                  </div>

                  <div className="text-center text-[9px] text-teal-light/40 z-10">
                    Verso (Cliquez pour retourner)
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: BULK IMPORT FROM CSV/TSV --- */}
      {activeTab === "import" && (
        <div className="space-y-6 bg-white p-6 rounded-3xl border border-teal/10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-display text-sm font-bold text-text-dark flex items-center gap-1.5">
              <FileSpreadsheet className="h-4 w-4 text-teal" /> Import de Flashcards en Masse
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={loadSampleCsv}
                className="px-2.5 py-1.5 text-[10px] font-bold border border-teal/15 text-teal hover:bg-teal/5 rounded-lg cursor-pointer transition-all"
              >
                📝 Charger un modèle CSV
              </button>
              <select
                value={importDelimiter}
                onChange={(e: any) => setImportDelimiter(e.target.value)}
                className="p-1.5 rounded-lg border border-teal/20 text-[10px] font-bold bg-white"
              >
                <option value="auto">Détection Auto</option>
                <option value=",">Séparateur Virgule (,)</option>
                <option value=";">Séparateur Point-Virgule (;)</option>
                <option value="\t">Séparateur Tabulation (TSV)</option>
              </select>
            </div>
          </div>

          {importSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl font-medium flex items-center gap-2 text-xs">
              <CheckCircle className="h-4 w-4" /> {importSuccess}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-text-light block">
              Collez vos données tabulaires (avec entêtes : front, back, type, isAffirmationTrue, difficulty)
            </label>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder={`front,back,type,isAffirmationTrue,difficulty\n"Quel est le rythme sinusal normal ?","60-100 bpm","definition","","easy"`}
              rows={8}
              className="w-full p-3 font-mono text-[11px] rounded-xl border border-teal/20 bg-white focus:ring-1 focus:ring-teal focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleParseCsv}
            className="px-4 py-2.5 bg-teal text-white font-bold rounded-xl hover:bg-teal-dark transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[10px] uppercase tracking-wider shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" /> Analyser les données
          </button>

          {/* Validation & Preview table */}
          {importSummary && (
            <div className="space-y-4 pt-4 border-t border-teal/5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-teal/5 border border-teal/10">
                <div className="flex gap-4">
                  <span className="text-[10px] font-bold text-text-dark">Total détecté: <strong className="text-teal font-black">{importSummary.total}</strong></span>
                  <span className="text-[10px] font-bold text-text-dark">Valides: <strong className="text-emerald-600 font-black">{importSummary.valid}</strong></span>
                  <span className="text-[10px] font-bold text-text-dark">Invalides: <strong className="text-rose-600 font-black">{importSummary.invalid}</strong></span>
                </div>
                <button
                  type="button"
                  disabled={importSummary.valid === 0}
                  onClick={executeBulkImport}
                  className={`px-4 py-2 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all flex items-center gap-1 ${
                    importSummary.valid > 0
                      ? "bg-teal text-white hover:bg-teal-dark cursor-pointer shadow-sm"
                      : "bg-surface text-text-light border border-teal/5 cursor-not-allowed"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" /> Importer les {importSummary.valid} cartes valides
                </button>
              </div>

              {/* Data Table */}
              <div className="max-h-60 overflow-y-auto border border-teal/10 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface text-[9px] font-black uppercase tracking-wider text-text-light border-b border-teal/10">
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Recto (Front)</th>
                      <th className="p-2.5">Verso (Back)</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Difficulté</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedCards.map((card, idx) => (
                      <tr key={card.id} className={`border-b border-teal/5 text-[10px] ${card.isValid ? "bg-white hover:bg-surface/30" : "bg-red-50/40"}`}>
                        <td className="p-2.5">
                          {card.isValid ? (
                            <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                              <Check className="h-3 w-3" /> Prêt
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                              <X className="h-3 w-3" /> Invalide
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 font-medium max-w-xs truncate">{card.front}</td>
                        <td className="p-2.5 font-medium max-w-xs truncate">{card.back}</td>
                        <td className="p-2.5 uppercase font-bold text-teal">{card.type}</td>
                        <td className="p-2.5 uppercase font-bold text-text-light">{card.difficulty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
