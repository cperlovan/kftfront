"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Entity, Review, getRatingLabel, getRatingType } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Star, MapPin, Store, BarChart2, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

export default function EntityDetailPage() {
  const { user, isAuthenticated } = useAuth();
  const params = useParams();
  const [entity, setEntity] = useState<Entity | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const entityId = params.id as string;

  useEffect(() => {
    fetchEntity();
  }, [entityId]);

  async function fetchEntity() {
    try {
      const response = await api.get(`/entities/${entityId}`);
      setEntity(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!entity) {
    return <div className="flex h-screen items-center justify-center"><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Lugar no encontrado</h2></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white p-8">{entity.name || "Sin nombre"}</h1>
      <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/estadisticas">
          <Button className="bg-slate-600 text-white hover:bg-slate-700 shadow-lg shadow-slate-600/30 w-full sm:w-auto">
            <BarChart2 className="w-4 h-4 mr-2" /> Ver Estadísticas
          </Button>
        </Link>
        {isAuthenticated && (user?.role ?? '').toString() === 'ADMIN' && (
          <Link href="/admin/encuestas">
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-700/30 w-full sm:w-auto">
              <BarChart3 className="w-4 h-4 mr-2" /> Encuestas
            </Button>
          </Link>
        )}
      </div>
      <div className="p-8">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Califica este lugar</h2>
          </CardHeader>
          <CardContent>
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center gap-1 justify-center">
                  {[1,2,3,4,5].map((s) => (
                    <button key={s} onClick={() => setRating(s)} className={cn("w-10 h-10 rounded-lg transition-all", rating >= s ? "text-orange-400 fill-orange-400 bg-orange-500/10" : "text-slate-400")}>
                      <Star fill={rating >= s ? "currentColor" : "none"} stroke={rating < s ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="¿Cómo te fue?" />
                <Button onClick={async () => {
  if (rating <= 0) return alert('Por favor selecciona una calificación');
  if (!entity?.locations || entity.locations.length === 0) return alert('Esta entidad no tiene ubicaciones para agregar una reseña');
  
  const locationId = entity.locations[0].id;
  
  try {
    await api.post('/reviews', {
      locationId,
      rating,
      comment: comment || '',
    });
    setRating(0);
    setComment('');
    alert('¡Reseña guardada exitosamente!');
  } catch (error: any) {
    if (error.response?.status === 404) {
      alert('La ubicación especificada no existe. Por favor contacta al administrador.');
    } else if (error.response?.status === 401) {
      alert('Por favor inicia sesión para poder agregar una reseña.');
    } else {
      console.error('Error al guardar reseña:', error);
      alert('Error al guardar la reseña. Intenta nuevamente.');
    }
  }
}} className="w-full bg-orange-600 text-white font-semibold py-4">Guardar</Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Link href="/login" className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700">Iniciar sesión</Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}