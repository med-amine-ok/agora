"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import Button from "../ui/Button";

interface CSVImporterProps {
  onImport: (rows: any[]) => Promise<{ successCount: number; errors: { row: number; reason: string }[] }>;
}

export const CSVImporter: React.FC<CSVImporterProps> = ({ onImport }) => {
  const [dragActive, setDragActive] = useState(false);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; failed: { row: number; reason: string }[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      alert("Veuillez sélectionner un fichier CSV valide.");
      return;
    }

    setLoading(true);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
        if (lines.length < 2) throw new Error("Le fichier CSV est vide.");

        const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, ""));
        const rows = [];

        for (let i = 1; i < lines.length; i++) {
          const columns = lines[i].split(",").map(c => c.trim().replace(/^["']|["']$/g, ""));
          if (columns.length < headers.length) continue;

          const rowObj: Record<string, string> = {};
          headers.forEach((h, idx) => {
            rowObj[h] = columns[idx];
          });
          rows.push(rowObj);
        }

        setParsedRows(rows);
      } catch (err) {
        alert("Erreur lors de la lecture du fichier CSV.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const executeImport = async () => {
    if (parsedRows.length === 0) return;
    setLoading(true);

    try {
      // Map rows to question entities format
      const formattedQuestions = parsedRows.map((row, idx) => ({
        id: `imported-${Date.now()}-${idx}`,
        text: row.question_text || "Question sans texte",
        options: [row.option_a, row.option_b, row.option_c, row.option_d].filter(Boolean),
        correctIndex: parseInt(row.correct_index) || 0,
        explanation: row.explanation || "Aucune explication fournie.",
        difficulty: (row.difficulty?.toLowerCase() || "medium") as any,
        subject: row.subject || "Général",
        lessonId: row.lesson_id || "Tous",
        createdDate: new Date().toISOString()
      }));

      const res = await onImport(formattedQuestions);
      setImportResult({
        success: res.successCount,
        failed: res.errors
      });
      setParsedRows([]);
    } catch (err) {
      alert("Une erreur est survenue lors de l'importation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 font-sans text-sm">
      {/* Upload Zone */}
      {parsedRows.length === 0 && !importResult && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-md p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
            dragActive ? "border-green-mid bg-green-light/10" : "border-border-brand hover:bg-beige-light"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <UploadCloud className="w-12 h-12 text-text-light mb-3" />
          <h4 className="font-serif text-lg font-bold text-green-dark">Glisser & Déposer votre fichier CSV</h4>
          <p className="text-text-mid text-xs mt-1">Ou cliquez pour explorer vos fichiers locaux. Fichiers .csv uniquement.</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center p-8 bg-beige-light border border-border-brand rounded-sm">
          <RefreshCw className="w-6 h-6 text-green-mid animate-spin mr-3" />
          <span className="font-semibold text-green-dark">Analyse du fichier en cours...</span>
        </div>
      )}

      {/* Preview Table */}
      {parsedRows.length > 0 && !loading && (
        <div className="space-y-4 bg-beige-light border border-border-brand p-6 rounded-md">
          <div className="flex items-center justify-between border-b border-border-brand pb-3">
            <div>
              <h4 className="font-serif text-lg font-bold text-green-dark">Aperçu de l'importation</h4>
              <p className="text-text-mid text-xs mt-0.5">{parsedRows.length} questions prêtes à être analysées.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setParsedRows([])}>
                Annuler
              </Button>
              <Button size="sm" onClick={executeImport}>
                Lancer l'importation
              </Button>
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto border border-border-brand rounded-sm text-xs">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-green-dark text-white text-left font-semibold uppercase tracking-wider">
                  <th className="p-3">Question</th>
                  <th className="p-3">Options</th>
                  <th className="p-3">Index Correct</th>
                  <th className="p-3">Difficulté</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-brand">
                {parsedRows.slice(0, 10).map((row, idx) => (
                  <tr key={idx} className="hover:bg-beige-base/20 text-text-dark">
                    <td className="p-3 truncate max-w-xs">{row.question_text}</td>
                    <td className="p-3 font-mono">{[row.option_a, row.option_b, row.option_c, row.option_d].filter(Boolean).join(" | ")}</td>
                    <td className="p-3 font-mono font-bold text-center">{row.correct_index}</td>
                    <td className="p-3 capitalize">{row.difficulty || "medium"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parsedRows.length > 10 && (
              <div className="p-2.5 text-center text-text-light font-medium border-t border-border-brand bg-beige-base/30">
                ... et {parsedRows.length - 10} autres lignes.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Result Display */}
      {importResult && (
        <div className="space-y-4 bg-beige-light border border-border-brand p-6 rounded-md">
          <h4 className="font-serif text-lg font-bold text-green-dark">Rapport d'importation</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-sm p-4 flex items-center gap-3 text-emerald-800">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <span className="text-xl font-bold font-mono">{importResult.success}</span>
                <p className="text-xs">Questions importées avec succès</p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-sm p-4 flex items-center gap-3 text-red-800">
              <AlertTriangle className="w-8 h-8 text-red-600 shrink-0" />
              <div>
                <span className="text-xl font-bold font-mono">{importResult.failed.length}</span>
                <p className="text-xs">Lignes en échec</p>
              </div>
            </div>
          </div>

          {importResult.failed.length > 0 && (
            <div className="border border-red-200 rounded-sm p-3.5 bg-red-50/50 max-h-40 overflow-y-auto text-xs space-y-2">
              <span className="font-bold text-red-900">Détail des erreurs :</span>
              <ul className="list-disc pl-5 space-y-1 text-red-800">
                {importResult.failed.map((err, idx) => (
                  <li key={idx}>Ligne {err.row} : {err.reason}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button size="sm" onClick={() => setImportResult(null)}>
              Terminer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVImporter;
