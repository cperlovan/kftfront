"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ReviewCategory = "" | "SERVICE" | "PRODUCT" | "PRICE" | "AMBIENTE" | "ENTREGA";

const CATEGORY_OPTIONS: Array<{
  value: Exclude<ReviewCategory, "">;
  label: string;
  desc: string;
}> = [
  { value: "SERVICE", label: "Servicio", desc: "Calidad del servicio atendido" },
  { value: "PRODUCT", label: "Producto", desc: "Calidad del producto/servicio" },
  { value: "PRICE", label: "Precio", desc: "Relación calidad-precio" },
  { value: "AMBIENTE", label: "Ambiente", desc: "Atmósfera del lugar" },
  { value: "ENTREGA", label: "Entrega", desc: "Puntualidad y entrega" },
];

const CATEGORY_LABELS: Record<string, string> = {
  SERVICE: "Servicio",
  PRODUCT: "Producto",
  PRICE: "Precio",
  AMBIENTE: "Ambiente",
  ENTREGA: "Entrega",
};

interface ClientReviewsProps {
  locationId: string;
  initialReviews?: any[];
}

export function ClientReviews({ locationId, initialReviews = [] }: ClientReviewsProps) {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<any[]>(initialReviews);
  const [selectedCategory, setSelectedCategory] = useState<ReviewCategory>("");
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    if (!locationId) return;
    try {
      const response = await api.get(`/reviews/location/${locationId}`);
      setReviews(response.data || []);
    } catch {
      // Mantiene las reseñas actuales si falla la petición
    }
  }, [locationId]);

  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews]);

  const onSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !selectedCategory || !isAuthenticated) return;

    setSubmitting(true);
    setError(null);
    try {
      await api.post("/reviews", {
        locationId,
        rating,
        comment: comment || "",
        category: selectedCategory,
        isApproved: isApproving,
      });
      setRating(0);
      setComment("");
      setSelectedCategory("");
      setIsApproving(false);
      await fetchReviews();
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al enviar la reseña");
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId: string, isUp: boolean) => {
    try {
      await api.post(`/reviews/${reviewId}/helpful`, { isUp });
      await fetchReviews();
    } catch {
      // Mantiene el estado si falla el voto
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Reseñas de la Ubicación
          </h2>
          <Link
            href="/entities"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-orange-500 inline-block transition-colors"
          >
            ← Volver a los lugares
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 rounded-md p-4">
          {error}
        </div>
      )}

      {isAuthenticated ? (
        <form onSubmit={onSubmitReview} className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Califica esta ubicación
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tipo de reseña
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={cn(
                    "w-full rounded-lg border transition-all p-3 text-left flex flex-col",
                    selectedCategory === cat.value
                      ? "bg-orange-50 text-orange-600 border-orange-500"
                      : "text-slate-600 hover:bg-orange-50 dark:text-slate-400 dark:border-slate-600 dark:hover:bg-slate-800"
                  )}
                >
                  <span className="font-medium">{cat.label}</span>
                  <span className="text-xs">{cat.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Calificación (1-5 estrellas)
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={cn(
                    "w-8 h-8 rounded-lg border flex items-center justify-center text-sm transition-colors",
                    rating >= star
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-slate-400 border-slate-300 hover:text-orange-500 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:text-orange-400"
                  )}
                >
                  {star}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Comentario
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              placeholder="Escribe tu opinión..."
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isApproving"
              checked={isApproving}
              onChange={(e) => setIsApproving(e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded border-slate-300 dark:bg-slate-800 dark:border-slate-600 focus:ring-orange-500"
            />
            <label htmlFor="isApproving" className="text-sm text-slate-600 dark:text-slate-400">
              Marcar como aprobada
            </label>
          </div>

          <Button
            type="submit"
            disabled={submitting || !rating || !selectedCategory}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            {submitting ? "Enviando..." : "Enviar Reseña"}
          </Button>
        </form>
      ) : (
        <div className="text-center py-8">
          <Link
            href="/login"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 inline-block"
          >
            Iniciar sesión para calificar
          </Link>
        </div>
      )}

      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        Reseñas ({reviews.length})
      </h3>

      {reviews.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400 text-center py-8">
          No hay reseñas para esta ubicación aún.
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-4">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-900 dark:text-white">
                  {review.user?.name || "Usuario anónimo"}
                </CardTitle>
                <div className="flex text-orange-400 text-sm">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      fill={review.rating >= s ? "currentColor" : "none"}
                      stroke="currentColor"
                      className="w-3 h-3"
                    />
                  ))}
                </div>
              </CardHeader>

              <CardContent>
                {review.isApproved !== undefined && (
                  <span
                    className={cn(
                      "inline-block px-2 py-1 rounded text-xs mb-2",
                      review.isApproved
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    )}
                  >
                    {review.isApproved ? "Aprobado" : "No aprobado"}
                  </span>
                )}

                {review.thumbsUp !== undefined && review.thumbsDown !== undefined && (
                  <div className="flex gap-3 text-slate-500 dark:text-slate-400 text-xs mb-2">
                    <span>{review.thumbsUp} útil</span>
                    <span>{review.thumbsDown} no útil</span>
                  </div>
                )}

                {review.category ? (
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    <strong>{CATEGORY_LABELS[review.category] || review.category}:</strong>{" "}
                    {review.comment || "Sin comentario"}
                  </p>
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {review.comment || "Sin comentario"}
                  </p>
                )}
              </CardContent>

              {isAuthenticated && review.id && (
                <CardFooter className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleHelpful(review.id, true)}
                    className="flex-1 px-3 py-1 rounded-lg border bg-orange-50 text-orange-600 hover:bg-orange-100 text-sm transition-colors"
                  >
                    Útil
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHelpful(review.id, false)}
                    className="flex-1 px-3 py-1 rounded-lg border bg-orange-50 text-orange-600 hover:bg-orange-100 text-sm transition-colors"
                  >
                    No útil
                  </button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}