"use client";

import React from "react";
import { Star, StarHalf, Star as StarEmpty } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
  onSelect?: (rating: number) => void;
  showLabel?: boolean;
}

const STAR_COLORS = {
  raya: "text-orange-600 fill-orange-600",
  regular: "text-amber-500 fill-amber-500",
  fino: "text-green-600 fill-green-600",
};

export function StarRating({
  rating,
  size = "md",
  readOnly = false,
  onSelect,
  showLabel = false,
}: StarRatingProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  const getStarIcon = (star: number) => {
    if (rating >= star) return <Star className={sizes[size]} fill="currentColor" />;
    if (rating > star - 0.5 && rating < star) return <StarHalf className={sizes[size]} fill="currentColor" />;
    return <StarEmpty className={sizes[size]} stroke="currentColor" />;
  };

  const ratingType =
    rating <= 2 ? "raya" : rating >= 4 ? "fino" : "regular";

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <button
          key={star}
          onClick={() => onSelect?.(star)}
          disabled={readOnly}
          className={cn(
            "p-1 rounded-md transition-colors active:scale-90",
            !readOnly && "hover:bg-orange-50 dark:hover:bg-orange-900/20 cursor-pointer"
          )}
          aria-label={`Calificar con ${star} estrellas`}
        >
          {getStarIcon(star)}
        </button>
      ))}
      {showLabel && (
        <span className={cn("ml-2 text-sm font-medium", STAR_COLORS[ratingType])}>
          {rating === 1 ? "1 estrella" : `${rating} estrellas`}
        </span>
      )}
    </div>
  );
}

export function RatingBadge({ rating }: { rating: number }) {
  const type = rating <= 2 ? "raya" : rating >= 4 ? "fino" : "regular";
  const labels = { raya: "Raya", regular: "Regular", fino: "Fino" };
  const colors = {
    raya: "bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30",
    regular: "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30",
    fino: "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30",
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
      colors[type]
    )}>
      <span className="w-2 h-2 rounded-full" />
      {labels[type]}
    </span>
  );
}
