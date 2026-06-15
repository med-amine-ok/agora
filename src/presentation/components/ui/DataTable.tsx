"use client";

import React, { useState } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

export interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  sortKey?: string;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onSortChange,
  searchPlaceholder = "Rechercher...",
  searchValue,
  onSearchChange,
  emptyMessage = "Aucun enregistrement trouvé."
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSort = (key: string) => {
    if (!onSortChange) return;

    let dir: 'asc' | 'desc' = 'asc';
    if (sortKey === key && sortDir === 'asc') {
      dir = 'desc';
    }

    setSortKey(key);
    setSortDir(dir);
    onSortChange(key, dir);
  };

  return (
    <div className="space-y-4 font-sans text-sm">
      {/* Top search bar */}
      {onSearchChange !== undefined && (
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchValue || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full max-w-xs p-2 border border-border-brand bg-white rounded-sm text-text-dark text-xs focus:outline-none focus:border-green-mid"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-border-brand rounded-sm bg-beige-light">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-green-dark text-white border-b border-border-brand text-xs font-semibold uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  onClick={() => col.sortKey && handleSort(col.sortKey)}
                  className={`p-4 ${col.sortKey ? "cursor-pointer select-none hover:bg-green-mid/80" : ""} ${col.className || ""}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortKey && sortKey === col.sortKey && (
                      sortDir === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-brand">
            {data.length > 0 ? (
              data.map((item, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-beige-base/40 text-text-dark transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`p-4 align-middle ${col.className || ""}`}>
                      {col.accessor(item)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-text-light font-medium">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-text-mid font-medium">
            Affichage de la page <strong className="text-text-dark font-semibold">{currentPage}</strong> sur <strong className="text-text-dark font-semibold">{totalPages}</strong> ({totalCount} lignes au total)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="py-1 px-2.5"
            >
              <ChevronLeft className="w-4.5 h-4.5" /> Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="py-1 px-2.5"
            >
              Suivant <ChevronRight className="w-4.5 h-4.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
