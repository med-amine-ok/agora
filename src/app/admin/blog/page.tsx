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
  BookOpen
} from "lucide-react";
import { useArticlesStore, Article } from "@/store/useArticlesStore";

export default function BlogCMSPage() {
  const { articles, addArticle, updateArticle, deleteArticle } = useArticlesStore();
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<Article | null>(null);

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
    if (confirm("Supprimer cet article ?")) {
      deleteArticle(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header banner */}
      <div className="border-b border-teal/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-teal-dark flex items-center gap-2">
            <FileText className="h-6 w-6 text-accent" /> Gestion du CMS Articles
          </h1>
          <p className="text-xs text-text-light mt-1 uppercase font-mono tracking-wider">
            Publiez des articles de révision clinique, organisez les étiquettes et gérez l'éditorial d'Agora.
          </p>
        </div>

        {!showEditor && (
          <button 
            onClick={startCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal text-white-custom hover:bg-teal-dark text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Nouvel article
          </button>
        )}
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <form onSubmit={handleSave} className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-4 max-w-3xl">
          <div className="flex items-center justify-between border-b border-teal/10 pb-3">
            <h3 className="font-display text-sm font-bold text-text-dark">
              {editingPost ? `Modifier l'article : ${editingPost.title}` : "Nouvel article"}
            </h3>
            <button 
              type="button" 
              onClick={() => setShowEditor(false)}
              className="text-text-light hover:text-teal cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-text-light font-bold">Titre de l'article</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-[#F5FAFA] text-xs outline-none focus:border-teal text-text-dark"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-mono text-text-light font-bold">Catégorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-[#F5FAFA] text-xs outline-none focus:border-teal text-text-dark"
                >
                  <option value="Cardiologie">Cardiologie</option>
                  <option value="Pneumologie">Pneumologie</option>
                  <option value="Pédiatrie">Pédiatrie</option>
                  <option value="Méthodologie">Méthodologie</option>
                  <option value="Physiologie">Physiologie</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-text-light font-bold">Étiquettes (séparées par des virgules)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Ex. ECG, Résidanat"
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-[#F5FAFA] text-xs outline-none focus:border-teal text-text-dark"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-mono text-text-light font-bold">Temps de lecture</label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="Ex. 6 min"
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-[#F5FAFA] text-xs outline-none focus:border-teal text-text-dark"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-mono text-text-light font-bold">Image de couverture (URL)</label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="URL d'image Unsplash..."
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-[#F5FAFA] text-xs outline-none focus:border-teal text-text-dark"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-text-light font-bold">Résumé / Description de l'article (Excerpt)</label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Court résumé visible sur la grille..."
                className="w-full mt-1 p-2.5 rounded-lg border border-teal/15 bg-[#F5FAFA] text-xs outline-none focus:border-teal text-text-dark font-sans"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-text-light font-bold">Points Clés (Un par ligne)</label>
                <textarea
                  rows={3}
                  value={summaryInput}
                  onChange={(e) => setSummaryInput(e.target.value)}
                  placeholder="Point clé 1&#10;Point clé 2"
                  className="w-full mt-1 p-2 rounded-lg border border-teal/15 bg-[#F5FAFA] text-xs outline-none focus:border-teal text-text-dark font-sans"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-mono text-text-light font-bold">Notes Cliniques (Une par ligne)</label>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Note diagnostique 1&#10;Alerte thérapeutique 2"
                  className="w-full mt-1 p-2 rounded-lg border border-teal/15 bg-[#F5FAFA] text-xs outline-none focus:border-teal text-text-dark font-sans"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-text-light font-bold">Corps de l'article</label>
              <textarea
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Rédigez le contenu complet de l'article..."
                className="w-full mt-1 p-2.5 rounded-lg border border-teal/15 bg-[#F5FAFA] text-xs outline-none focus:border-teal text-text-dark font-sans"
              />
            </div>

            <div className="flex gap-2 justify-end border-t border-teal/10 pt-4">
              <button 
                type="button"
                onClick={() => setShowEditor(false)}
                className="px-4 py-2 rounded-lg border border-teal/10 hover:bg-surface text-xs font-semibold text-text-dark cursor-pointer"
              >
                Annuler
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-teal text-white-custom hover:bg-teal-dark rounded-lg text-xs font-bold shadow-sm cursor-pointer"
              >
                Sauvegarder l'Article
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Blog list */}
      {!showEditor && (
        <div className="border border-teal/10 bg-white-custom rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-teal/10 bg-[#F5FAFA] text-text-light uppercase tracking-wider font-mono text-[10px]">
                  <th className="p-4">Titre</th>
                  <th className="p-4">Catégorie</th>
                  <th className="p-4">Étiquettes (Tags)</th>
                  <th className="p-4">Auteur</th>
                  <th className="p-4">Likes</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((post) => (
                  <tr key={post.id} className="border-b border-teal/5 hover:bg-surface/10 transition-colors">
                    <td className="p-4 font-semibold text-text-dark">{post.title}</td>
                    <td className="p-4 text-teal font-bold">{post.category}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((t, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-surface/50 border border-teal/5 text-[9px] text-text-main font-semibold flex items-center gap-0.5">
                            <Tag className="h-2.5 w-2.5 text-accent" /> {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-text-light">{post.author}</td>
                    <td className="p-4 text-text-light font-mono font-semibold">{post.likes}</td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={() => startEdit(post)}
                        className="p-1.5 rounded border border-teal/10 text-teal hover:bg-teal/5 cursor-pointer"
                        title="Éditer l'article"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="p-1.5 rounded border border-error/10 text-error hover:bg-error/5 cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

