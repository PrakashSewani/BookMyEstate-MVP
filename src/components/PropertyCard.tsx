"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

interface PropertyCardProps {
  property: Property;
  isActive: boolean;
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `\u20B9${(price / 10000000).toFixed(1)} Cr`;
  return `\u20B9${(price / 100000).toFixed(1)} L`;
}

const typeLabels: Record<string, string> = {
  APARTMENT: "Apartment",
  VILLA: "Villa",
  PENTHOUSE: "Penthouse",
  PLOT: "Plot",
};

export default function PropertyCard({ property, isActive }: PropertyCardProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const images: string[] = JSON.parse(property.images);

  useEffect(() => {
    if (isActive) setCurrentImage(0);
  }, [isActive, property.id]);

  const handleNext = () => {
    if (currentImage < images.length - 1) setCurrentImage((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentImage > 0) setCurrentImage((p) => p - 1);
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none rounded-2xl">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentImage}
          src={images[currentImage]}
          alt={property.title}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          draggable={false}
          loading={currentImage === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

      {/* Image carousel dots */}
      {images.length > 1 && (
        <div className="absolute top-3 left-0 right-0 z-10 flex justify-center gap-1.5 pointer-events-none">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-[3px] rounded-full transition-all duration-200 ${
                i === currentImage ? "w-5 bg-white" : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      )}

      {/* Property type badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="px-2.5 py-1 rounded-lg bg-black/40 text-[11px] font-medium text-white/90 tracking-wide uppercase">
          {typeLabels[property.propertyType] || property.propertyType}
        </span>
      </div>

      {/* Image navigation tap zones */}
      <div className="absolute inset-0 z-[5] flex">
        <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
        <div className="w-1/3 h-full" />
        <div className="w-1/3 h-full cursor-pointer" onClick={handleNext} />
      </div>

      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 pb-5">
        <div className="space-y-1.5">
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {formatPrice(property.price)}
          </div>

          <h2 className="text-base sm:text-lg font-semibold text-white leading-tight">
            {property.title}
          </h2>

          <p className="text-white/70 text-xs sm:text-sm flex items-center gap-1">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.location}
          </p>

          <div className="flex items-center gap-2.5 text-[11px] sm:text-xs text-white/60">
            {property.bhk > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 20v-8a2 2 0 012-2h16a2 2 0 012 2v8M2 12V8a2 2 0 012-2h16a2 2 0 012 2v4M4 20v4M20 20v4" />
                </svg>
                {property.bhk} BHK
              </span>
            )}
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
              {property.areaSqFt.toLocaleString()} sqft
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
