"use client";

import React from "react";
import { Bookmark, FileText, Download, Briefcase, Star } from "lucide-react";

export default function Collections() {
  const items = [
    {
      name: "Articles Sauvegardés",
      count: 12,
      desc: "Lectures cliniques favorites",
      icon: <Bookmark className="h-5 w-5 text-teal" />,
    },
    {
      name: "Signets Cliniques",
      count: 8,
      desc: "Marque-pages de leçons",
      icon: <Star className="h-5 w-5 text-accent" />,
    },
    {
      name: "Cas Cliniques",
      count: 5,
      desc: "Études diagnostiques résolues",
      icon: <Briefcase className="h-5 w-5 text-teal-light" />,
    },
    {
      name: "Notes Personnelles",
      count: 15,
      desc: "Résumés et mémos de cours",
      icon: <FileText className="h-5 w-5 text-teal-dark" />,
    },
    {
      name: "Téléchargements",
      count: 3,
      desc: "Documents et PDF hors-ligne",
      icon: <Download className="h-5 w-5 text-text-light" />,
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="p-5 rounded-2xl border border-teal/10 bg-white-custom/60 backdrop-blur-md shadow-sm hover:shadow-md hover:border-teal/20 transition-all flex items-start gap-4 cursor-pointer"
        >
          <div className="p-3 rounded-xl bg-surface/50">
            {item.icon}
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-dark">{item.name}</h4>
            <p className="text-[10px] text-text-light mt-0.5 leading-normal">{item.desc}</p>
            <span className="inline-block mt-2 text-[10px] font-bold text-teal bg-teal/10 px-2 py-0.5 rounded-full">
              {item.count} documents
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
