"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";

const ANCIENT_QUOTES = [
  "“You have power over your mind — not outside events. Realize this, and you will find strength.” — Marcus Aurelius",
  "“We suffer more often in imagination than in reality.” — Seneca",
  "“A man is great by deeds, not by birth.” — Chanakya",
  "“The journey of a thousand miles begins with a single step.” — Lao Tzu",
  "“It does not matter how slowly you go as long as you do not stop.” — Confucius",
  "“He who conquers himself is the mightiest warrior.” — Confucius",
];

export function QuoteDisplay() {
  const [quote, setQuote] = useState(() => ANCIENT_QUOTES[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("pomodoro_ancient_quote");
    if (saved) {
      setQuote(saved);
    } else {
      // Pick random quote
      const rand = ANCIENT_QUOTES[Math.floor(Math.random() * ANCIENT_QUOTES.length)];
      setQuote(rand);
    }
  }, []);

  const handleStartEdit = () => {
    setEditText(quote.replace(/^“|”$/g, ""));
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editText.trim()) {
      const formatted = `“${editText.trim()}”`;
      setQuote(formatted);
      localStorage.setItem("pomodoro_ancient_quote", formatted);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="quotewrap">
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="bg-white/10 border border-[var(--gold-border)] rounded-lg px-3 py-1 text-xs text-white max-w-md w-full focus:outline-none"
          autoFocus
        />
        <button
          type="button"
          onClick={handleSave}
          className="text-[var(--gold-primary)] hover:text-white p-1"
        >
          <Check size={14} />
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="text-white/40 hover:text-white p-1"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="quotewrap">
      <p className="quote-text">{quote}</p>
      <button
        type="button"
        onClick={handleStartEdit}
        className="quote-edit-btn"
        title="Edit daily motto"
        aria-label="Edit daily motto"
      >
        <Pencil size={13} />
      </button>
    </div>
  );
}
