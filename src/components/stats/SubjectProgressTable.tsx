"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";

interface ChapterProgress {
  id: string;
  title: string;
  modulesCompleted: number;
  modulesTotal: number;
  lessonsCompleted: number;
  lessonsTotal: number;
  qcmPrecision: number;
  flashcardsMastered: number;
  flashcardsTotal: number;
}

interface SubjectProgress {
  id: string;
  name: string;
  modulesCompleted: number;
  modulesTotal: number;
  lessonsCompleted: number;
  lessonsTotal: number;
  qcmPrecision: number;
  flashcardsMastered: number;
  flashcardsTotal: number;
  chapters: ChapterProgress[];
}

const MOCK_SUBJECTS_PROGRESS: SubjectProgress[] = [
  {
    id: "s1",
    name: "Cardiologie",
    modulesCompleted: 12,
    modulesTotal: 18,
    lessonsCompleted: 24,
    lessonsTotal: 30,
    qcmPrecision: 82,
    flashcardsMastered: 36,
    flashcardsTotal: 48,
    chapters: [
      { id: "c1", title: "Le Cœur & Anatomie", modulesCompleted: 4, modulesTotal: 6, lessonsCompleted: 8, lessonsTotal: 10, qcmPrecision: 85, flashcardsMastered: 12, flashcardsTotal: 16 },
      { id: "c2", title: "Hémodynamique", modulesCompleted: 5, modulesTotal: 6, lessonsCompleted: 10, lessonsTotal: 10, qcmPrecision: 79, flashcardsMastered: 18, flashcardsTotal: 20 },
      { id: "c3", title: "Interprétation ECG", modulesCompleted: 3, modulesTotal: 6, lessonsCompleted: 6, lessonsTotal: 10, qcmPrecision: 64, flashcardsMastered: 6, flashcardsTotal: 12 }
    ]
  },
  {
    id: "s2",
    name: "Neurologie",
    modulesCompleted: 8,
    modulesTotal: 16,
    lessonsCompleted: 12,
    lessonsTotal: 24,
    qcmPrecision: 71,
    flashcardsMastered: 20,
    flashcardsTotal: 40,
    chapters: [
      { id: "c4", title: "Système Nerveux Central", modulesCompleted: 5, modulesTotal: 8, lessonsCompleted: 8, lessonsTotal: 12, qcmPrecision: 75, flashcardsMastered: 12, flashcardsTotal: 20 },
      { id: "c5", title: "Pathologies Vasculaires", modulesCompleted: 3, modulesTotal: 8, lessonsCompleted: 4, lessonsTotal: 12, qcmPrecision: 67, flashcardsMastered: 8, flashcardsTotal: 20 }
    ]
  },
  {
    id: "s3",
    name: "Pneumologie",
    modulesCompleted: 4,
    modulesTotal: 10,
    lessonsCompleted: 8,
    lessonsTotal: 20,
    qcmPrecision: 48,
    flashcardsMastered: 10,
    flashcardsTotal: 30,
    chapters: [
      { id: "c6", title: "Ventilation mécanique", modulesCompleted: 2, modulesTotal: 5, lessonsCompleted: 4, lessonsTotal: 10, qcmPrecision: 52, flashcardsMastered: 6, flashcardsTotal: 15 },
      { id: "c7", title: "BPCO & Asthme", modulesCompleted: 2, modulesTotal: 5, lessonsCompleted: 4, lessonsTotal: 10, qcmPrecision: 44, flashcardsMastered: 4, flashcardsTotal: 15 }
    ]
  }
];

export default function SubjectProgressTable() {
  const [data, setData] = useState<SubjectProgress[]>(MOCK_SUBJECTS_PROGRESS);
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleSort = (field: string) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);

    const sorted = [...data].sort((a, b) => {
      let valA: any = a[field as keyof SubjectProgress];
      let valB: any = b[field as keyof SubjectProgress];

      if (typeof valA === "string") {
        return direction === "asc" 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      } else {
        return direction === "asc" ? valA - valB : valB - valA;
      }
    });

    setData(sorted);
  };

  const getPrecisionColor = (precision: number) => {
    if (precision > 75) return "text-teal font-bold";
    if (precision >= 50) return "text-amber-500 font-bold";
    return "text-error font-bold";
  };

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="rounded-2xl border border-teal/10 bg-white overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface/50 border-b border-teal/5 text-[11px] font-sans font-bold uppercase tracking-wider text-text-light">
              <th className="p-4 cursor-pointer hover:text-text-dark" onClick={() => handleSort("name")}>
                Matière <ArrowUpDown className="inline h-3.5 w-3.5 ml-1" />
              </th>
              <th className="p-4 cursor-pointer hover:text-text-dark" onClick={() => handleSort("modulesCompleted")}>
                Modules <ArrowUpDown className="inline h-3.5 w-3.5 ml-1" />
              </th>
              <th className="p-4 cursor-pointer hover:text-text-dark" onClick={() => handleSort("lessonsCompleted")}>
                Leçons <ArrowUpDown className="inline h-3.5 w-3.5 ml-1" />
              </th>
              <th className="p-4 cursor-pointer hover:text-text-dark" onClick={() => handleSort("qcmPrecision")}>
                Précision QCM <ArrowUpDown className="inline h-3.5 w-3.5 ml-1" />
              </th>
              <th className="p-4 cursor-pointer hover:text-text-dark" onClick={() => handleSort("flashcardsMastered")}>
                Flashcards <ArrowUpDown className="inline h-3.5 w-3.5 ml-1" />
              </th>
              <th className="p-4">Progression</th>
            </tr>
          </thead>
          <tbody className="text-xs text-text-dark">
            {data.map((subj) => {
              const isExpanded = expandedRow === subj.id;
              const totalPercent = Math.round((subj.lessonsCompleted / subj.lessonsTotal) * 100) || 0;

              return (
                <React.Fragment key={subj.id}>
                  {/* Subject Row */}
                  <tr 
                    onClick={() => toggleRow(subj.id)}
                    className="border-b border-teal/5 hover:bg-surface/30 cursor-pointer transition-colors"
                  >
                    <td className="p-4 font-bold flex items-center gap-2">
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-teal" /> : <ChevronDown className="h-4 w-4 text-teal" />}
                      <span>{subj.name}</span>
                    </td>
                    <td className="p-4">{subj.modulesCompleted} / {subj.modulesTotal}</td>
                    <td className="p-4">{subj.lessonsCompleted} / {subj.lessonsTotal}</td>
                    <td className={`p-4 ${getPrecisionColor(subj.qcmPrecision)}`}>
                      {subj.qcmPrecision}%
                    </td>
                    <td className="p-4 font-mono">{subj.flashcardsMastered} / {subj.flashcardsTotal}</td>
                    <td className="p-4 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 bg-surface rounded-full overflow-hidden">
                          <div className="h-full bg-teal" style={{ width: `${totalPercent}%` }} />
                        </div>
                        <span className="font-mono text-[10px] font-bold text-text-light">{totalPercent}%</span>
                      </div>
                    </td>
                  </tr>

                  {/* Accordion Chapter Rows */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={6} className="bg-surface/20 p-4 border-b border-teal/5">
                        <div className="space-y-3 px-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-text-light mb-2">
                            Détail des Chapitres
                          </p>
                          <div className="space-y-2">
                            {subj.chapters.map(chap => {
                              const chapPercent = Math.round((chap.lessonsCompleted / chap.lessonsTotal) * 100) || 0;
                              return (
                                <div 
                                  key={chap.id}
                                  className="grid grid-cols-6 items-center py-2 border-b border-teal/5 last:border-0 text-text-mid text-[11px]"
                                >
                                  <div className="font-semibold text-text-dark">{chap.title}</div>
                                  <div>{chap.modulesCompleted} / {chap.modulesTotal} mod.</div>
                                  <div>{chap.lessonsCompleted} / {chap.lessonsTotal} leçons</div>
                                  <div className={getPrecisionColor(chap.qcmPrecision)}>{chap.qcmPrecision}%</div>
                                  <div className="font-mono">{chap.flashcardsMastered} / {chap.flashcardsTotal} cards</div>
                                  <div>
                                    <div className="h-1 w-24 bg-surface rounded-full overflow-hidden">
                                      <div className="h-full bg-teal/60" style={{ width: `${chapPercent}%` }} />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
