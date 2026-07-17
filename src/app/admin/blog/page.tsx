"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  X,
  Tag,
  BookOpen,
  Search,
  Filter,
  Eye,
  Settings,
  Calendar,
  ThumbsUp,
  User,
  Clock,
  ChevronRight,
  Sparkles,
  LayoutGrid,
  List
} from "lucide-react";
import { useArticlesStore, Article } from "@/store/useArticlesStore";

export default function BlogCMSPage() {
  const { articles, addArticle, updateArticle, deleteArticle } = useArticlesStore();
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<Article | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  // Editor states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Cardiologie");
  const [tagsInput, setTagsInput] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [summaryInput, setSummaryInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [content, setContent] = useState("");
  const [readTime, setReadTime] = useState("5 min");
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");

  const startCreate = () => {
    setEditingPost(null);
    setTitle("");
    setCategory("Cardiologie");
    setTagsInput("");
    setExcerpt("");
    setCoverImage("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80");
    setSummaryInput("");
    setNotesInput("");
    setContent("");
    setReadTime("5 min");
    setEditorTab("write");
    setShowEditor(true);
  };

  const startEdit = (post: Article) => {
    setEditingPost(post);
    setTitle(post.title);
    setCategory(post.category);
    setTagsInput(post.tags.join(", "));
    setExcerpt(post.excerpt);
    setCoverImage(post.coverImage);
    setSummaryInput(post.summaryPoints.join("\n"));
    setNotesInput(post.medicalNotes.join("\n"));
    setContent(post.content);
    setReadTime(post.readTime);
    setEditorTab("write");
    setShowEditor(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedTags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    const parsedSummary = summaryInput.split("\n").map(s => s.trim()).filter(Boolean);
    const parsedNotes = notesInput.split("\n").map(n => n.trim()).filter(Boolean);

    const payload = {
      title,
      category,
      tags: parsedTags,
      excerpt,
      coverImage,
      summaryPoints: parsedSummary,
      medicalNotes: parsedNotes,
      content,
      readTime,
      author: "Dr. Belkacem",
    };

    if (editingPost) {
      updateArticle(editingPost.id, payload);
    } else {
      addArticle(payload);
    }

    setShowEditor(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cet article de révision ?")) {
      deleteArticle(id);
    }
  };

  // Filter logic
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "Tous" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["Tous", "Cardiologie", "Pneumologie", "Pédiatrie", "Méthodologie", "Physiologie"];

  return (
    <div className="space-y-6 text-left">
      {/* Header banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[rgba(10,61,61,0.08)] pb-5 gap-4">
        <div>
          <h1 className="font-display text-[24px] font-semibold text-[#0D2626] flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#0E7C7B]" /> Gestion du CMS Articles
          </h1>
          <p className="text-[13px] text-[#7A9E9E] mt-1 font-sans">
            Rédigez, organisez et publiez des fiches de synthèse cliniques et des guides méthodologiques.
          </p>
        </div>

        {!showEditor && (
          <button 
            onClick={startCreate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0E7C7B] hover:bg-[#0A3D3D] text-white font-sans text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Nouvel article
          </button>
        )}
      </div>

      {/* Editor Workspace */}
      {showEditor ? (
        <div className="bg-white rounded-xl border border-[rgba(10,61,61,0.08)] overflow-hidden shadow-xs flex flex-col font-sans">
          {/* Editor Header */}
          <div className="p-4 border-b border-[rgba(10,61,61,0.08)] bg-[#F5FAFA] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#0E7C7B]/10 text-[#0E7C7B]">
                {editingPost ? "Édition" : "Création"}
              </span>
              <h3 className="text-xs font-bold text-[#0D2626] truncate max-w-md">
                {title || "Sans titre"}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {/* Tab Selector */}
              <div className="flex bg-[#E0F2F2]/50 p-0.5 rounded-lg border border-[rgba(10,61,61,0.08)]">
                <button
                  type="button"
                  onClick={() => setEditorTab("write")}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    editorTab === "write" ? "bg-white text-[#0E7C7B] shadow-xs" : "text-[#7A9E9E]"
                  }`}
                >
                  Éditeur
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab("preview")}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    editorTab === "preview" ? "bg-white text-[#0E7C7B] shadow-xs" : "text-[#7A9E9E]"
                  }`}
                >
                  Aperçu clinique
                </button>
              </div>

              <button 
                type="button" 
                onClick={() => setShowEditor(false)}
                className="p-1 rounded-lg hover:bg-[rgba(10,61,61,0.05)] text-[#7A9E9E] cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Editor Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[rgba(10,61,61,0.08)] min-h-[600px]">
            {/* Main Form Area */}
            <div className="lg:col-span-2 p-6 space-y-4">
              {editorTab === "write" ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-[#7A9E9E] font-bold">Titre principal</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="ex: Diagnostic différentiel de l'infarctus du myocarde..."
                      className="w-full mt-1.5 px-3 py-2 rounded-lg border border-[rgba(10,61,61,0.12)] bg-[#F5FAFA] text-xs outline-none focus:border-[#0E7C7B] text-[#0D2626] font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-[#7A9E9E] font-bold">Résumé (Excerpt)</label>
                    <textarea
                      rows={2}
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Court paragraphe d'introduction pour accrocher le lecteur..."
                      className="w-full mt-1.5 p-2.5 rounded-lg border border-[rgba(10,61,61,0.12)] bg-[#F5FAFA] text-xs outline-none focus:border-[#0E7C7B] text-[#0D2626]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-[#7A9E9E] font-bold">Points clés (Un par ligne)</label>
                      <textarea
                        rows={4}
                        value={summaryInput}
                        onChange={(e) => setSummaryInput(e.target.value)}
                        placeholder="• Règle de compensation acido-basique&#10;• Importance clinique du trou anionique"
                        className="w-full mt-1.5 p-2.5 rounded-lg border border-[rgba(10,61,61,0.12)] bg-[#F5FAFA] text-xs outline-none focus:border-[#0E7C7B] text-[#0D2626] font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono text-[#7A9E9E] font-bold">Notes médicales urgentes (Une par ligne)</label>
                      <textarea
                        rows={4}
                        value={notesInput}
                        onChange={(e) => setNotesInput(e.target.value)}
                        placeholder="⚠️ Attention: Ne jamais administrer dans ce contexte..."
                        className="w-full mt-1.5 p-2.5 rounded-lg border border-[rgba(10,61,61,0.12)] bg-[#F5FAFA] text-xs outline-none focus:border-[#0E7C7B] text-[#0D2626] font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-[#7A9E9E] font-bold">Corps de l'article (Markdown supporté)</label>
                    <textarea
                      rows={12}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Rédigez le cours ici. Utilisez des titres markdown (###) pour structurer le contenu..."
                      className="w-full mt-1.5 p-3 rounded-lg border border-[rgba(10,61,61,0.12)] bg-[#F5FAFA] text-xs outline-none focus:border-[#0E7C7B] text-[#0D2626] font-mono leading-relaxed"
                    />
                  </div>
                </div>
              ) : (
                /* Visual Preview Page rendering mimicking student page */
                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                  <div className="relative h-48 rounded-xl overflow-hidden bg-slate-100 border border-[rgba(10,61,61,0.08)]">
                    <img 
                      src={coverImage || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"} 
                      alt="Cover" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
                      <div className="flex gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-[#0E7C7B] text-white text-[9px] font-bold uppercase tracking-wider">
                          {category}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-xs text-white text-[9px] font-mono">
                          {readTime}
                        </span>
                      </div>
                      <h2 className="text-sm font-bold text-white leading-tight font-display">{title || "Nouveau cours sans titre"}</h2>
                    </div>
                  </div>

                  {excerpt && (
                    <p className="text-xs text-[#214646] italic leading-relaxed border-l-2 border-[#FF6B35] pl-3">
                      {excerpt}
                    </p>
                  )}

                  {/* Summary key points */}
                  {summaryInput && (
                    <div className="p-4 rounded-xl bg-[#E0F2F2]/30 border border-[#0E7C7B]/10 space-y-2">
                      <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0E7C7B] flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" /> Objectifs & Points clés
                      </h4>
                      <ul className="space-y-1 text-xs text-[#214646]">
                        {summaryInput.split("\n").map((pt, idx) => pt.trim() && (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#0E7C7B] mt-0.5">•</span>
                            <span>{pt.replace(/^•\s*/, "")}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="text-xs text-[#214646] space-y-3 leading-relaxed whitespace-pre-line font-sans">
                    {content || "Rédigez du contenu pour voir l'aperçu..."}
                  </div>

                  {/* Medical Urgent Notes */}
                  {notesInput && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200/50 space-y-2">
                      <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                        ⚠️ Alerte clinique de garde
                      </h4>
                      <ul className="space-y-1 text-xs text-red-700 font-mono">
                        {notesInput.split("\n").map((n, idx) => n.trim() && (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span>{n}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar metadata settings */}
            <div className="p-6 bg-[#F5FAFA] space-y-4">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7A9E9E] flex items-center gap-1.5 border-b border-[rgba(10,61,61,0.08)] pb-2">
                <Settings className="h-4 w-4 text-[#0E7C7B]" /> Paramètres éditoriaux
              </h4>

              <div className="space-y-3.5">
                <div>
                  <label className="text-[10px] uppercase font-mono text-[#7A9E9E] font-bold">Catégorie principale</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg border border-[rgba(10,61,61,0.12)] bg-white text-xs outline-none focus:border-[#0E7C7B] text-[#0D2626] font-semibold"
                  >
                    <option value="Cardiologie">Cardiologie</option>
                    <option value="Pneumologie">Pneumologie</option>
                    <option value="Pédiatrie">Pédiatrie</option>
                    <option value="Méthodologie">Méthodologie</option>
                    <option value="Physiologie">Physiologie</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-[#7A9E9E] font-bold">Étiquettes (Séparées par virgules)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="ECG, Réanimation, Urgences..."
                    className="w-full mt-1 px-3 py-1.5 rounded-lg border border-[rgba(10,61,61,0.12)] bg-white text-xs outline-none focus:border-[#0E7C7B] text-[#0D2626]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-[#7A9E9E] font-bold">Temps de lecture estimé</label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="ex: 8 min"
                    className="w-full mt-1 px-3 py-1.5 rounded-lg border border-[rgba(10,61,61,0.12)] bg-white text-xs outline-none focus:border-[#0E7C7B] text-[#0D2626]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-[#7A9E9E] font-bold">Image de couverture (URL Unsplash)</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://images.unsplash.com..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[rgba(10,61,61,0.12)] bg-white text-xs outline-none focus:border-[#0E7C7B] text-[#0D2626] truncate"
                    />
                    <button 
                      type="button" 
                      onClick={() => setCoverImage("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80")}
                      className="p-1.5 rounded-lg border border-[rgba(10,61,61,0.12)] bg-white hover:bg-[#F5FAFA] text-[#0E7C7B]"
                      title="Utiliser l'image par défaut"
                    >
                      <Upload className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {coverImage && (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-[rgba(10,61,61,0.08)] bg-white">
                    <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t border-[rgba(10,61,61,0.08)] pt-4 flex flex-col gap-2">
                <button 
                  type="submit" 
                  onClick={handleSave}
                  className="w-full py-2 bg-[#0E7C7B] hover:bg-[#0A3D3D] text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer text-center"
                >
                  Sauvegarder et publier
                </button>
                <button 
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="w-full py-2 border border-[rgba(10,61,61,0.12)] bg-white hover:bg-slate-50 text-[#7A9E9E] rounded-lg text-xs font-bold cursor-pointer text-center"
                >
                  Annuler les modifications
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Blog posts dashboard list */
        <div className="space-y-4 font-sans">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[rgba(10,61,61,0.08)] shadow-xs">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Category tabs */}
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat 
                      ? "bg-[#E0F2F2] text-[#0E7C7B]" 
                      : "text-[#7A9E9E] hover:bg-[#F5FAFA] hover:text-[#0D2626]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#7A9E9E]" />
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-[rgba(10,61,61,0.12)] text-xs bg-[#F5FAFA] outline-none focus:bg-white focus:border-[#0E7C7B] text-[#0D2626] font-sans"
                />
              </div>

              {/* View mode toggle */}
              <div className="flex border border-[rgba(10,61,61,0.12)] p-0.5 rounded-lg bg-[#F5FAFA]">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1 rounded-md transition-all cursor-pointer ${
                    viewMode === "table" ? "bg-white text-[#0E7C7B] shadow-xs" : "text-[#7A9E9E]"
                  }`}
                >
                  <List className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1 rounded-md transition-all cursor-pointer ${
                    viewMode === "grid" ? "bg-white text-[#0E7C7B] shadow-xs" : "text-[#7A9E9E]"
                  }`}
                >
                  <LayoutGrid className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          </div>

          {/* List display */}
          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-[rgba(10,61,61,0.08)] shadow-xs">
              <BookOpen className="h-10 w-10 text-[#7A9E9E] mx-auto mb-3 opacity-50" />
              <p className="text-xs text-[#7A9E9E] font-semibold">Aucun article trouvé pour les filtres sélectionnés.</p>
            </div>
          ) : viewMode === "table" ? (
            /* Premium Dense Table View */
            <div className="border border-[rgba(10,61,61,0.08)] bg-white rounded-xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[rgba(10,61,61,0.08)] bg-[#F5FAFA] text-[#7A9E9E] uppercase tracking-wider font-mono text-[9px]">
                      <th className="p-4 font-bold">Article</th>
                      <th className="p-4 font-bold">Catégorie</th>
                      <th className="p-4 font-bold">Mots clés / Tags</th>
                      <th className="p-4 font-bold">Stats</th>
                      <th className="p-4 font-bold">Date & Auteur</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.map((post) => (
                      <tr key={post.id} className="border-b border-[rgba(10,61,61,0.04)] hover:bg-[#F5FAFA]/50 transition-colors">
                        <td className="p-4 max-w-sm">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-16 rounded overflow-hidden bg-slate-50 border border-[rgba(10,61,61,0.08)] shrink-0">
                              <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="font-bold text-[#0D2626] line-clamp-1">{post.title}</h4>
                              <p className="text-[10px] text-[#7A9E9E] line-clamp-1">{post.excerpt}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#E0F2F2] text-[#0E7C7B] border border-[#0E7C7B]/10">
                            {post.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {post.tags.map((t, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-[#F5FAFA] border border-[rgba(10,61,61,0.08)] text-[9px] text-[#214646] font-semibold flex items-center gap-0.5">
                                <Tag className="h-2 w-2 text-[#FF6B35]" /> {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 font-mono text-[10px] text-[#214646] space-y-1">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3 text-[#0E7C7B]" /> {post.likes} likes
                          </div>
                          <div className="flex items-center gap-1 text-[#7A9E9E]">
                            <Clock className="h-3 w-3" /> {post.readTime}
                          </div>
                        </td>
                        <td className="p-4 text-[#7A9E9E] text-[10px] space-y-0.5">
                          <div className="flex items-center gap-1 font-semibold text-[#214646]">
                            <User className="h-3 w-3 text-[#0E7C7B]" /> {post.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {post.date}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => startEdit(post)}
                              className="h-8 w-8 rounded-lg border border-[rgba(10,61,61,0.12)] text-[#0E7C7B] hover:bg-[#F5FAFA] flex items-center justify-center cursor-pointer"
                              title="Éditer"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDelete(post.id)}
                              className="h-8 w-8 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Visual Grid Mode */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((post) => (
                <div key={post.id} className="bg-white rounded-xl border border-[rgba(10,61,61,0.08)] overflow-hidden shadow-xs hover:border-[rgba(10,61,61,0.15)] transition-all flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-video bg-slate-100 border-b border-[rgba(10,61,61,0.08)]">
                      <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#E0F2F2] text-[#0E7C7B] text-[9px] font-bold uppercase tracking-wider border border-[#0E7C7B]/10">
                        {post.category}
                      </span>
                    </div>
                    
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-[9px] text-[#7A9E9E] font-mono">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                      </div>
                      
                      <h4 className="font-display font-semibold text-xs text-[#0D2626] line-clamp-2 leading-snug">{post.title}</h4>
                      <p className="text-[10px] text-[#7A9E9E] line-clamp-3 leading-relaxed">{post.excerpt}</p>
                    </div>
                  </div>

                  <div className="p-4 border-t border-[rgba(10,61,61,0.05)] bg-[#F5FAFA]/50 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[9px] text-[#214646] font-mono font-bold">
                      <ThumbsUp className="h-3.5 w-3.5 text-[#0E7C7B]" /> {post.likes} likes
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => startEdit(post)}
                        className="h-7 px-2.5 rounded-lg border border-[rgba(10,61,61,0.12)] bg-white text-[#0E7C7B] hover:bg-[#F5FAFA] text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="h-3 w-3" /> Éditer
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="h-7 w-7 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
