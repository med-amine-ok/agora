"use client";

import React, { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  MessageSquare,
  Bookmark,
  Shield,
  Send
} from "lucide-react";

interface Report {
  id: string;
  reporter: string;
  type: "Bug" | "Contenu" | "Utilisateur";
  description: string;
  priority: "Haute" | "Moyenne" | "Basse";
  status: "En attente" | "Résolu";
  assignedTo: string;
  comments: { author: string; text: string; date: string }[];
}

const mockReports: Report[] = [
  {
    id: "rep-101",
    reporter: "Anis Meddah",
    type: "Bug",
    description: "Le bouton de soumission de réponse ne s'active pas sur Android Chrome 126.",
    priority: "Haute",
    status: "En attente",
    assignedTo: "Dr. Belkacem",
    comments: [
      { author: "Dr. Belkacem", text: "Je reproduis le bug, correction en cours.", date: "Aujourd'hui, 09:12" }
    ]
  },
  {
    id: "rep-102",
    reporter: "Mounir K.",
    type: "Contenu",
    description: "L'explication de la question ECG #12 contient une faute sur la dérivation DII.",
    priority: "Moyenne",
    status: "En attente",
    assignedTo: "Non assigné",
    comments: []
  },
  {
    id: "rep-103",
    reporter: "Yasmin L.",
    type: "Utilisateur",
    description: "Signalement d'un joueur inactif répété en mode Blitz.",
    priority: "Basse",
    status: "Résolu",
    assignedTo: "Admin System",
    comments: [
      { author: "Admin System", text: "Avertissement envoyé par e-mail à l'étudiant concerné.", date: "Hier, 14:02" }
    ]
  }
];

export default function ReportsManagementPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [newComment, setNewComment] = useState("");

  const handleResolve = (id: string) => {
    setReports(prev => prev.map(rep => {
      if (rep.id === id) {
        const updated = { ...rep, status: "Résolu" as const };
        if (selectedReport?.id === id) setSelectedReport(updated);
        return updated;
      }
      return rep;
    }));
  };

  const handleAssign = (id: string) => {
    setReports(prev => prev.map(rep => {
      if (rep.id === id) {
        const updated = { ...rep, assignedTo: "Dr. Belkacem" };
        if (selectedReport?.id === id) setSelectedReport(updated);
        return updated;
      }
      return rep;
    }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedReport) return;

    const comment = {
      author: "Dr. Belkacem",
      text: newComment,
      date: "À l'instant"
    };

    setReports(prev => prev.map(rep => {
      if (rep.id === selectedReport.id) {
        const updated = { ...rep, comments: [...rep.comments, comment] };
        setSelectedReport(updated);
        return updated;
      }
      return rep;
    }));
    setNewComment("");
  };

  return (
    <div className="space-y-8">
      {/* Header banner */}
      <div className="border-b border-teal/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-dark flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-accent" /> Signalements & Support
          </h1>
          <p className="text-xs text-text-light mt-1 uppercase font-mono tracking-wider">
            Consultez les signalements cliniques ou techniques, répondez aux étudiants et attribuez les tâches.
          </p>
        </div>
      </div>

      {/* Grid: Reports and detail inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reports list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-text-dark flex items-center gap-1.5 border-b border-teal/5 pb-2">
            <Clock className="h-4 w-4 text-teal" /> DOSSIERS EN ATTENTE ({reports.filter(r => r.status === "En attente").length})
          </h3>

          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                onClick={() => setSelectedReport(rep)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  selectedReport?.id === rep.id 
                    ? "border-teal bg-teal/5 shadow-xs" 
                    : "border-teal/10 bg-white-custom hover:border-teal/20 shadow-sm"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-text-light">{rep.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      rep.type === "Bug" ? "bg-error/10 text-error" : rep.type === "Contenu" ? "bg-teal/10 text-teal" : "bg-accent/10 text-accent"
                    }`}>
                      {rep.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      rep.priority === "Haute" ? "bg-error text-white-custom" : "bg-surface text-text-dark"
                    }`}>
                      Priorité {rep.priority}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-text-dark line-clamp-1">{rep.description}</p>
                </div>

                <div className="flex items-center gap-4 text-[10px] text-text-light font-mono font-bold">
                  <span>Assignation: {rep.assignedTo}</span>
                  <span className={`px-2 py-0.5 rounded-full ${rep.status === "Résolu" ? "bg-teal/10 text-teal" : "bg-accent/10 text-accent"}`}>
                    {rep.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Inspector */}
        <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-6">
          <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-text-dark flex items-center gap-1.5 border-b border-teal/5 pb-2">
            <Bookmark className="h-4 w-4 text-accent" /> DÉTAILS DU SIGNALEMENT
          </h3>

          {selectedReport ? (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono text-text-light uppercase block">Auteur du rapport</span>
                <span className="text-xs font-bold text-text-dark flex items-center gap-1 mt-1">
                  <User className="h-3.5 w-3.5 text-teal" /> {selectedReport.reporter}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-text-light uppercase block">Description</span>
                <p className="text-xs text-text-main mt-1 leading-relaxed">{selectedReport.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAssign(selectedReport.id)}
                  className="p-2 rounded-lg border border-teal/10 hover:bg-surface text-[10px] font-bold text-text-dark flex items-center justify-center gap-1"
                >
                  <Shield className="h-3.5 w-3.5 text-teal" /> S'assigner le dossier
                </button>
                {selectedReport.status === "En attente" && (
                  <button
                    onClick={() => handleResolve(selectedReport.id)}
                    className="p-2 rounded-lg bg-teal text-white-custom hover:bg-teal-dark text-[10px] font-bold flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="h-3.5 w-3.5" /> Résoudre le rapport
                  </button>
                )}
              </div>

              {/* Chat/Comment Section */}
              <div className="space-y-3 border-t border-teal/10 pt-4">
                <span className="text-[10px] font-mono text-text-light uppercase flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5 text-teal" /> Notes et commentaires administratifs
                </span>
                
                <div className="space-y-2 h-36 overflow-y-auto pr-1">
                  {selectedReport.comments.length > 0 ? (
                    selectedReport.comments.map((c, i) => (
                      <div key={i} className="p-2.5 rounded-lg border border-teal/5 bg-surface/20 text-[10px] space-y-1">
                        <div className="flex items-center justify-between text-text-light">
                          <span className="font-bold">{c.author}</span>
                          <span>{c.date}</span>
                        </div>
                        <p className="text-text-main font-medium">{c.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-text-light/50 italic text-center py-6">Aucun commentaire de suivi rédigé.</p>
                  )}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-1.5 mt-2">
                  <input
                    type="text"
                    placeholder="Ajouter une note de suivi..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-grow px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-lg bg-accent text-white-custom hover:bg-accent/90"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <p className="text-xs text-text-light/60 italic text-center py-12">
              Veuillez sélectionner un signalement pour afficher les détails du dossier.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
