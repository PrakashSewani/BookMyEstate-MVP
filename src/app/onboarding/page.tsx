"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const LOCATIONS = [
  { id: "Worli", label: "Worli", emoji: "\uD83C\uDFD9\uFE0F", subtitle: "Business Hub" },
  { id: "Juhu", label: "Juhu", emoji: "\uD83C\uDFD6\uFE0F", subtitle: "Beach Living" },
  { id: "Bandra", label: "Bandra", emoji: "\u2600\uFE0F", subtitle: "Trendy & Vibrant" },
  { id: "Lower Parel", label: "Lower Parel", emoji: "\uD83C\uDFE2", subtitle: "Urban Center" },
  { id: "Andheri", label: "Andheri", emoji: "\uD83D\uDE80", subtitle: "Connected Living" },
  { id: "Thane", label: "Thane", emoji: "\uD83C\uDF3F", subtitle: "Green & Spacious" },
  { id: "Malabar Hill", label: "Malabar Hill", emoji: "\uD83C\uDFDB\uFE0F", subtitle: "Elite Address" },
  { id: "Lonavala", label: "Lonavala", emoji: "\uD83C\uDFD4\uFE0F", subtitle: "Hill Station" },
];

export default function OnboardingPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    setSubmitting(true);
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locations: selected }),
    });
    if (res.ok) {
      window.location.href = "/feed";
    } else {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-brand-950 flex items-center justify-center">
      <div className="w-full max-w-md px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
              Where are you looking?
            </h1>
            <p className="text-brand-400 text-sm mt-2">
              Pick the areas you&apos;re interested in. We&apos;ll personalize your feed.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {LOCATIONS.map((loc, i) => {
              const isSelected = selected.includes(loc.id);
              return (
                <motion.button
                  key={loc.id}
                  onClick={() => toggle(loc.id)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className={`relative p-4 rounded-xl text-left transition-all duration-150 border ${
                    isSelected
                      ? "bg-gold-500/15 border-gold-500/40"
                      : "bg-brand-900/50 border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="text-xl mb-1.5">{loc.emoji}</div>
                  <div className="text-white font-semibold text-sm">{loc.label}</div>
                  <div className="text-brand-500 text-xs mt-0.5">{loc.subtitle}</div>
                  {isSelected && (
                    <motion.div
                      className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15, stiffness: 300 }}
                    >
                      <svg className="w-3 h-3 text-brand-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          <motion.button
            onClick={handleComplete}
            disabled={selected.length === 0 || submitting}
            className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-brand-950 font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {submitting ? "Setting up..." : selected.length > 0 ? `Start Exploring (${selected.length})` : "Select at least one area"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
