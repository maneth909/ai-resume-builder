"use client";
import { useState } from "react";
import { Eye, EyeOff, Key } from "lucide-react";

interface ApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function ApiKeyInput({
  value,
  onChange,
  placeholder = "gsk_...",
}: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="relative">
      <input
        type={showKey ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 pr-10 text-sm bg-secondary/30 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
      />
      <button
        type="button"
        onClick={() => setShowKey(!showKey)}
        className="absolute right-3 top-3 text-muted hover:text-tertiary transition-colors"
      >
        {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
