"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropertyCard from "./PropertyCard";
import CallbackModal from "./CallbackModal";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  propertyType: string;
  bhk: number;
  areaSqFt: number;
  images: string;
}

interface SwipeableCardsProps {
  properties: Property[];
}

type SwipeDir = "LIKE" | "SKIP" | "SAVE" | null;

export default function SwipeableCards({ properties: initial }: SwipeableCardsProps) {
  const [remaining, setRemaining] = useState<Property[]>(initial);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCallback, setShowCallback] = useState(false);
  const [indicator, setIndicator] = useState<{ dir: SwipeDir; progress: number } | null>(null);

  const currentProperty = remaining[currentIndex];
  const nextProperty = remaining[currentIndex + 1];

  const goNext = useCallback(() => {
    if (currentIndex < remaining.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setRemaining([]);
    }
  }, [currentIndex, remaining.length]);

  const recordBehavior = useCallback(async (propertyId: string, action: string) => {
    await fetch("/api/behavior", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId, action }),
    });
  }, []);

  const handleAction = useCallback(async (action: string) => {
    if (!currentProperty) return;
    if (action === "CALLBACK") {
      setShowCallback(true);
      return;
    }
    if (action === "LIKE" || action === "SAVE") {
      await recordBehavior(currentProperty.id, action);
    }
    goNext();
  }, [currentProperty, recordBehavior, goNext]);

  const handleDrag = useCallback((_: any, info: any) => {
    const dx = info.offset.x;
    const dy = info.offset.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (absX > absY && absX > 15) {
      if (dx > 0) {
        setIndicator({ dir: "LIKE", progress: Math.min(dx / 130, 1) });
      } else {
        setIndicator({ dir: "SKIP", progress: Math.min(absX / 130, 1) });
      }
    } else if (dy > 15 && absY > absX) {
      setIndicator({ dir: "SAVE", progress: Math.min(dy / 130, 1) });
    } else {
      setIndicator(null);
    }
  }, []);

  const handleDragEnd = useCallback((_: any, info: any) => {
    const dx = info.offset.x;
    const dy = info.offset.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const threshold = 100;

    setIndicator(null);

    if (absX > absY && absX > threshold) {
      if (dx > 0) {
        handleAction("LIKE");
      } else {
        goNext();
      }
    } else if (dy > threshold && absY > absX) {
      handleAction("SAVE");
    }
  }, [handleAction, goNext]);

  const handleShare = useCallback(() => {
    if (!currentProperty) return;
    const text = `${currentProperty.title} — ${formatPrice(currentProperty.price)} in ${currentProperty.location}`;
    if (navigator.share) {
      navigator.share({ title: currentProperty.title, text });
    } else {
      navigator.clipboard.writeText(text);
    }
  }, [currentProperty]);

  const handleCallbackSubmit = useCallback(async (data: { name: string; phone: string; email: string; message: string }) => {
    if (!currentProperty) return;
    await recordBehavior(currentProperty.id, "CALLBACK");
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId: currentProperty.id, ...data }),
    });
    goNext();
  }, [currentProperty, recordBehavior, goNext]);

  if (remaining.length === 0 || currentIndex >= remaining.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-brand-900 flex items-center justify-center mb-5">
          <svg className="w-10 h-10 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">All caught up</h2>
        <p className="text-brand-400 text-sm max-w-xs mt-2">
          You&apos;ve seen all available properties. Check back later for new listings.
        </p>
      </div>
    );
  }

  const overlayProgress = indicator?.progress ?? 0;

  return (
    <div className="flex items-center justify-center w-full lg:max-w-lg lg:mx-auto lg:px-4">
      <div className="relative w-full h-[calc(100dvh-6rem)] lg:h-auto lg:aspect-[3/4] lg:max-h-[75vh]">
        {nextProperty && (
          <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-40 scale-[0.93] -translate-y-2 pointer-events-none hidden lg:block">
            <img
              src={JSON.parse(nextProperty.images)[0]}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        )}

        <div className="absolute inset-0">
          <AnimatePresence mode="popLayout">
            {currentProperty && (
              <motion.div
                key={currentProperty.id}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.7}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  transition: { duration: 0.15 },
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {/* Card content with fade on drag */}
                <div
                  className="relative w-full h-full"
                  style={{ opacity: 1 - overlayProgress * 0.45 }}
                >
                  <PropertyCard property={currentProperty} isActive={true} />
                </div>

                {/* Color overlay on drag — tint based on direction */}
                {indicator && (
                  <motion.div
                    className="absolute inset-0 z-20 pointer-events-none rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: overlayProgress * 0.85 }}
                    transition={{ duration: 0.05 }}
                    style={{
                      backgroundColor:
                        indicator.dir === "LIKE"
                          ? "rgba(34,197,94,0.25)"
                          : indicator.dir === "SKIP"
                            ? "rgba(239,68,68,0.25)"
                            : "rgba(234,179,8,0.25)",
                    }}
                  />
                )}

                {/* Swipe indicator text — center, no box */}
                <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                  <span
                    className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-xl"
                    style={{
                      opacity: indicator ? overlayProgress : 0,
                      color:
                        indicator?.dir === "LIKE" ? "rgb(74,222,128)" :
                        indicator?.dir === "SKIP" ? "rgb(248,113,113)" :
                        indicator?.dir === "SAVE" ? "rgb(250,204,21)" :
                        "transparent",
                    }}
                  >
                    {indicator?.dir === "LIKE" ? "LIKE" :
                     indicator?.dir === "SKIP" ? "SKIP" :
                     indicator?.dir === "SAVE" ? "SAVE" : ""}
                  </span>
                </div>

                {/* Action buttons — overlaid on card right edge, move with card */}
                <div className="absolute right-2 sm:right-3 bottom-24 sm:bottom-28 z-20 flex flex-col items-center gap-3 sm:gap-4 pointer-events-none">
                  {[
                    {
                      action: "LIKE",
                      icon: (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      ),
                      hover: "hover:bg-green-500/20 hover:border-green-500/30",
                    },
                    {
                      action: "SAVE",
                      icon: (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>
                      ),
                      hover: "hover:bg-gold-500/20 hover:border-gold-500/30",
                    },
                    {
                      action: "CALLBACK",
                      icon: (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                      ),
                      hover: "hover:bg-blue-500/20 hover:border-blue-500/30",
                    },
                    {
                      action: "SHARE",
                      icon: (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                        </svg>
                      ),
                      hover: "hover:bg-purple-500/20 hover:border-purple-500/30",
                    },
                  ].map((btn) => (
                    <button
                      key={btn.action}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (btn.action === "SHARE") handleShare();
                        else handleAction(btn.action);
                      }}
                      className="pointer-events-auto group flex flex-col items-center gap-0.5"
                    >
                      <div
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/30 flex items-center justify-center border border-white/10 transition-all duration-150 active:scale-90 ${btn.hover}`}
                      >
                        {btn.icon}
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-white/60 font-medium">
                        {btn.action === "CALLBACK" ? "Call" : btn.action.charAt(0) + btn.action.slice(1).toLowerCase()}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <CallbackModal
        isOpen={showCallback}
        onClose={() => setShowCallback(false)}
        onSubmit={handleCallbackSubmit}
      />
    </div>
  );
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `\u20B9${(price / 10000000).toFixed(1)} Cr`;
  return `\u20B9${(price / 100000).toFixed(1)} L`;
}
