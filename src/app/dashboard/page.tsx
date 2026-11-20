"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Star } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

function KPICard({ title, value, subtitle, color = "text-orange-600" }: KPICardProps) {
  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </CardTitle>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color.replace("text-", "bg-")}100 ${color}`}>
          <span className="text-[10px]">{title.charAt(0)}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="text-2xl font-bold {color}">{value}</div>
        {subtitle && <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</div>}
      </CardContent>
    </Card>
  );
}

interface LocationRowProps {
  location: any;
}

function LocationRow({ location }: LocationRowProps) {
  const stars = Array(5).fill(0);
  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-4 mb-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex-1">
          <div className="font-semibold text-slate-900 dark:text-white">{location.entityName}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{location.entityType}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{location.locationAddress}</div>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div className="flex items-center gap-1">
            {stars.map((_, i) => (
              <Star
                key={i}
                fill={location.averageRating >= i + 1 ? "currentColor" : "none"}
                stroke="currentColor"
                className="w-4 h-4 text-orange-500"
              />
            ))}
            <span className="text-sm font-medium">{location.averageRating.toFixed(1)}</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold">{location.totalReviews}</span> reseñas
          </div>
          <div className="text-sm mt-1">
            {location.pendingReviews > 0 ? (
              <span className="text-red-600 dark:text-red-400 font-medium">
                {location.pendingReviews} pendientes
              </span>
            ) : (
              <span className="text-green-600 dark:text-green-400 font-medium">
                Todas aprobadas
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <span className="px-2 py-1 rounded text-xs border {location.approvedCount > 0 ? 'border-green-200 text-green-700 bg-green-50' : 'border-red-200 text-red-700 bg-red-50'}">
          {location.approvedCount} aprobadas
        </span>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [summary, setSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Card className="w-full max-w-md p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Acceso Denegado</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-6">
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Solo los administradores pueden acceder al dashboard de KPIs.
            </p>
            <Button onClick={() => (window.location.href = "/")}>
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const [analyticsRes, summaryRes] = await Promise.all([
        api.get("/reviews/analytics", { params }),
        api.get("/reviews/analytics/summary"),
      ]);

      setAnalytics(analyticsRes.data);
      setSummary(summaryRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAnalytics();
  }, [startDate, endDate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Card className="w-full max-w-md p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-6">
            <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categoryDist = analytics?.categoryDistribution || {};

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              Dashboard KPI
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Métricas de calidad de servicio por ubicación
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600 dark:text-slate-400">Desde:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600 dark:text-slate-400">Hasta:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <Button onClick={() => void fetchAnalytics()} className="bg-orange-600 hover:bg-orange-700">
              Aplicar filtros
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            title="Total Reseñas"
            value={analytics?.totalReviews || 0}
            subtitle="Todas las ubicaciones"
            color="text-blue-600"
          />
          <KPICard
            title="Rating Promedio"
            value={analytics?.averageRating?.toFixed(1) || 0}
            subtitle="de 5 estrellas"
            color="text-orange-600"
          />
          <KPICard
            title="Tasa de Aprobación"
            value={`${analytics?.approvalRate || 0}%`}
            subtitle="Reseñas aprobadas / total"
            color="text-green-600"
          />
          <KPICard
            title="Útiles / No útiles"
            value={`${analytics?.totalThumbsUp || 0} / ${analytics?.totalThumbsDown || 0}`}
            subtitle="Votos de utilidad"
            color="text-purple-600"
          />
        </div>

        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 mb-8">
          <CardHeader className="p-4">
            <CardTitle className="text-lg font-semibold">Distribución por Categoría</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {Object.entries(categoryDist).map(([category, count]) => {
                const labelMap: Record<string, string> = {
                  SERVICE: "Servicio",
                  PRODUCT: "Producto",
                  PRICE: "Precio",
                  AMBIENTE: "Ambiente",
                  ENTREGA: "Entrega",
                };
                const label = labelMap[category] || category;
                const total = analytics?.totalReviews || 1;
                const percentage = ((count as number) / total) * 100;

                return (
                  <div key={category} className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">{label}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                      <div
                        className="bg-orange-600 h-4 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader className="p-4">
            <CardTitle className="text-lg font-semibold">Ubicaciones y Reseñas</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {summary.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                No hay ubicaciones con reseñas aún.
              </p>
            ) : (
              <div className="space-y-3">
                {summary.map((loc) => (
                  <LocationRow key={loc.locationId} location={loc} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}