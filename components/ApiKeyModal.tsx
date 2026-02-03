"use client";
import { useState, useEffect } from "react";
import { AlertTriangle, X, ShieldAlert } from "lucide-react";
import ApiKeyInput from "./ApiKeyInput";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  initialKey?: string;
  isSystemError?: boolean;
}

export default function ApiKeyModal({
  isOpen,
  onClose,
  onSave,
  initialKey = "",
  isSystemError = false,
}: ApiKeyModalProps) {
  const [tempKey, setTempKey] = useState(initialKey);

  useEffect(() => {
    if (isOpen) {
      setTempKey(initialKey);
    }
  }, [isOpen, initialKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-whitecolor dark:bg-background border border-border rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
        {/* CONDITIONAL RENDERING*/}
        {isSystemError ? (
          // --- SYSTEM ERROR VIEW (No Input) ---
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full">
              <ShieldAlert size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-tertiary">
                Service Unavailable
              </h3>
              <p className="text-sm text-muted mt-2">
                The AI model is not working right now. Please contact support or
                try again later.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-sm font-medium text-whitecolor bg-tertiary hover:opacity-90 rounded-lg transition-colors mt-2"
            >
              Close
            </button>
          </div>
        ) : (
          // --- NORMAL INPUT VIEW ---
          <>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-tertiary">
                    Invalid API Key
                  </h3>
                  <p className="text-xs text-muted">
                    The key provided is invalid or expired.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-muted hover:text-tertiary"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-6">
              <label className="text-xs font-semibold text-tertiary mb-2 block">
                Enter New Groq API Key
              </label>
              <ApiKeyInput value={tempKey} onChange={setTempKey} />
              <p className="text-xs text-muted mt-2">
                This will update your settings immediately and retry the
                analysis.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-tertiary bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSave(tempKey);
                  onClose();
                }}
                disabled={!tempKey.trim()}
                className="flex-1 px-4 py-2 text-sm font-medium text-whitecolor bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
              >
                Save & Retry
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
