"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    phone: string;
    email: string;
    message: string;
  }) => void;
}

export default function CallbackModal({
  isOpen,
  onClose,
  onSubmit,
}: CallbackModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) return;
    setSubmitting(true);
    onSubmit({ name, phone, email, message });
    setSubmitting(false);
    setName("");
    setPhone("");
    setEmail("");
    setMessage("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md bg-brand-900 border border-white/10 p-5 sm:p-6 shadow-2xl sm:rounded-2xl rounded-t-2xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
          >
            {/* Handle bar (mobile) */}
            <div className="sm:hidden flex justify-center mb-3">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white">Request Callback</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/10 text-brand-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-brand-400 mb-1.5">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-800 border border-white/10 text-white placeholder-brand-500 focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all text-sm"
                  placeholder="Your name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-brand-400 mb-1.5">Phone *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-800 border border-white/10 text-white placeholder-brand-500 focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all text-sm"
                    placeholder="Phone"
                  />
                </div>

                <div>
                  <label className="block text-xs text-brand-400 mb-1.5">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-800 border border-white/10 text-white placeholder-brand-500 focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all text-sm"
                    placeholder="Email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-brand-400 mb-1.5">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-800 border border-white/10 text-white placeholder-brand-500 focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all text-sm resize-none"
                  placeholder="Any specific requirements?"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !name || !phone || !email}
                className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-brand-950 font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed mt-1"
              >
                {submitting ? "Sending..." : "Request Callback"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
