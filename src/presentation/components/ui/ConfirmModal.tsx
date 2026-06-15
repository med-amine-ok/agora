"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmWord?: string;
  confirmButtonText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmWord = "CONFIRM",
  confirmButtonText = "Confirmer"
}) => {
  const [inputVal, setInputVal] = useState("");

  const handleConfirm = () => {
    if (inputVal === confirmWord) {
      onConfirm();
      setInputVal("");
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-text-mid text-sm leading-relaxed">{description}</p>
        <div className="space-y-2">
          <label className="block text-xs font-bold text-text-dark uppercase tracking-wider">
            Veuillez saisir <span className="font-mono text-error-brand font-black select-all">{confirmWord}</span> pour valider
          </label>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Saisir ${confirmWord}`}
            className="w-full p-2.5 border border-border-brand rounded-sm bg-white text-text-dark text-sm focus:outline-none focus:border-green-mid"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="danger"
            size="sm"
            disabled={inputVal !== confirmWord}
            onClick={handleConfirm}
          >
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
