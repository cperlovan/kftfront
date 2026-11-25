"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { List, Clock, ShieldCheck } from "lucide-react";

type TipoEntidad = "PRODUCTO" | "LOCAL" | "PERSONA" | "OTRO";

interface PreguntaEncuesta {
  id: string;
  texto: string;
  tipo: "ESTRELLAS" | "TEXTO" | "MULTIPLE";
  obligatoria: boolean;
  opciones: string[];
}

interface Encuesta {
  id: string;
  nombreEntidad: string;
  tipoEntidad: TipoEntidad;
  descripcion: string;
  preguntas: PreguntaEncuesta[];
  respuestas: number[];
  fechaCreacion: string;
  activo: boolean;
  _count?: { respuestas: number };
}

const TIPOS_ENTIDAD: { value: TipoEntidad; label: string; icono: string }[] = [
  { value: "PRODUCTO", label: "Producto", icono: "📦" },
  { value: "LOCAL", label: "Local / Negocio", icono: "🏪" },
  { value: "PERSONA", label: "Persona / Atención", icono: "👤" },
  { value: "OTRO", label: "Otro", icono: "❓" },
];

export default function EncuestasPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEncuestas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/encuestas");
      const data = response.data || [];
      const normalizadas: Encuesta[] = data
        .filter((e: any) => e.activo !== false)
        .map((e: any) => ({
          id: e.id,
          nombreEntidad: e.nombreEntidad || "Sin nombre",
          tipoEntidad: e.tipoEntidad || "PRODUCTO",
          descripcion: e.descripcion || "",
          preguntas: (e.preguntas || []).map((p: any) => ({
            ...p,
            opciones: Array.isArray(p.opciones) ? p.opciones : [],
          })),
          respuestas: e.respuestas || [],
          fechaCreacion: e.fechaCreacion || new Date().toISOString(),
          activo: e.activo !== undefined ? e.activo : true,
          _count: { respuestas: e._count?.respuestas ?? 0 },
        }));
      setEncuestas(normalizadas);
    } catch {
      setError("Error al cargar las encuestas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchEncuestas();
  }, [isAuthenticated, router, fetchEncuestas]);

  const getTipoInfo = (tipo: TipoEntidad) =>
    TIPOS_ENTIDAD.find((t) => t.value === tipo);

  const getPromedio = (encuesta: Encuesta): number => {
    if (encuesta.respuestas.length === 0) return 0;
    const suma = encuesta.respuestas.reduce((a, b) => a + b, 0);
    return Math.round((suma / encuesta.respuestas.length) * 10) / 10;
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            📋 Encuestas Disponibles
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Califica productos, locales, personas y más. Tu opinión importa.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {encuestas.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
            No hay encuestas disponibles
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Vuelve pronto para encontrar nuevas encuestas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {encuestas.map((encuesta) => {
            const tipoInfo = getTipoInfo(encuesta.tipoEntidad);
            const promedio = getPromedio(encuesta);
            const yaRespondio = encuesta.respuestas.length > 0;

            return (
              <Card key={encuesta.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tipoInfo ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
                      {tipoInfo?.icono || "❓"}
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {tipoInfo?.label || "Otro"}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold leading-tight mb-1">
                    {encuesta.nombreEntidad}
                  </CardTitle>
                  {encuesta.descripcion && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {encuesta.descripcion}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <List className="w-4 h-4" />
                      <span>{encuesta.preguntas.length} pregunta{encuesta.preguntas.length !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span>{encuesta.preguntas.length > 0 ? "~2 min" : "&lt;1 min"}</span>
                    </div>
                  </div>

                  {yaRespondio ? (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          Ya respondiste
                        </span>
                      </div>
                      {promedio > 0 && (
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          Promedio: {promedio.toFixed(1)}/5
                        </span>
                      )}
                    </div>
                  ) : (
                    <Button
                      onClick={() => router.push(`/encuestas/${encuesta.id}`)}
                      variant="primary"
                      size="sm"
                      className="w-full"
                      disabled={yaRespondio}
                    >
                      Responder encuesta
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}