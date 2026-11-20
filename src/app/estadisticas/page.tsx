"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Star, Store, User, Building2 } from "lucide-react";

interface EntityStats {
  id: string;
  name: string;
  type: string;
  totalReviews: number;
  averageRating: number;
  totalApproved: number;
  totalPending: number;
  approvalRate: number;
}

export default function EstadisticasPage() {
  const [entities, setEntities] = useState<EntityStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStats();
  }, [search]);

  async function fetchStats() {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      if (search) params.search = search;

      const response = await api.get("/entities", { params });
      const allEntities = response.data || [];

      const stats: EntityStats[] = allEntities.map((e: any) => {
        const allReviews =
          e.locations?.flatMap((loc: any) => loc.reviews || []) || [];
        const totalReviews = allReviews.length;
        const averageRating =
          totalReviews > 0
            ? allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
            totalReviews
            : 0;
        const totalApproved = allReviews.filter((r: any) => r.isApproved).length;
        const totalPending = totalReviews - totalApproved;
        const approvalRate =
          totalReviews > 0 ? (totalApproved / totalReviews) * 100 : 0;

        return {
          id: e.id,
          name: e.name || "Sin nombre",
          type: e.type || "DESCONOCIDO",
          totalReviews,
          averageRating: Math.round(averageRating * 100) / 100,
          totalApproved,
          totalPending,
          approvalRate: Math.round(approvalRate * 100) / 100,
        };
      });

      setEntities(stats);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  }

  const typeIcon = (type: string) => {
    switch (type) {
      case "BUSINESS":
        return <Building2 className="w-5 h-5" />;
      case "PERSON":
        return <User className="w-5 h-5" />;
      default:
        return <Store className="w-5 h-5" />;
    }
  };

  const typeBadgeStyle = (type: string) => {
    switch (type) {
      case "BUSINESS":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case "PERSON":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  const getApprovalColor = (rate: number) => {
    if (rate >= 70) return "text-green-600 dark:text-green-400";
    if (rate >= 40) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const totalReviewsGlobal = entities.reduce((sum, e) => sum + e.totalReviews, 0);
  const averageRatingGlobal =
    entities.length > 0
      ? (
        entities.reduce((sum, e) => sum + e.averageRating, 0) / entities.length
      ).toFixed(1)
      : "0.0";
  const approvalRateGlobal =
    entities.length > 0
      ? (
        entities.reduce((sum, e) => sum + e.approvalRate, 0) / entities.length
      ).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              Estadísticas de Calidad
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Consulta el rating y aceptación de lugares, productos y personas
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <Input
              label="Buscar"
              placeholder="Buscar lugar, producto o persona..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Total Entidades
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {entities.length}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Total Reseñas
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {totalReviewsGlobal}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <Star className="w-5 h-5 fill-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Rating Promedio Global
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {averageRatingGlobal}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                  <Star className="w-5 h-5 fill-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Tasa de Aprobación Global
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {approvalRateGlobal}%
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <User className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">
                Cargando estadísticas...
              </p>
            </div>
          ) : entities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">
                No se encontraron entidades{search ? ` con "${search}"` : ""}.
              </p>
            </div>
          ) : (
            entities.map((e) => (
              <Card
                key={e.id}
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
              >
                <CardHeader className="p-4 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeBadgeStyle(e.type)}`}
                    >
                      {typeIcon(e.type)}
                    </div>
                    <div>
                      <CardTitle className="font-semibold text-slate-900 dark:text-white">
                        {e.name}
                      </CardTitle>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {e.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-slate-900 dark:text-white">
                      {e.averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center gap-1 text-orange-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          fill={e.averageRating >= s ? "currentColor" : "none"}
                          stroke="currentColor"
                          className="w-3 h-3"
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {e.totalReviews}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        reseñas
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {e.totalApproved}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        aprobadas
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {e.totalPending}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        pendientes
                      </div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold ${getApprovalColor(e.approvalRate)}`}
                      >
                        {e.approvalRate}%
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        aceptación
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${e.approvalRate}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>{e.totalPending} pendientes de revisión</span>
                      <span>{e.totalApproved} aprobadas</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4">
                  <Link href={`/entities/${e.id}`} className="w-full">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                      Ver detalle y reseñas
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}