"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function EncuestasAdminPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [encuestas, setEncuestas] = useState<any[]>([]);
  const [nuevaPregunta, setNuevaPregunta] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthenticated || user?.role !== "ADMIN") {
    router.push("/");
    return null;
  }

  useEffect(() => {
    fetchEncuestas();
  }, []);

  async function fetchEncuestas() {
    try {
      const response = await api.get("/entities");
      const todas = response.data || [];
      setEncuestas(todas.filter((e: any) => e.type === "ENCUESTA"));
    } catch (err) {
      setError("Error al cargar encuestas");
    }
  }

  async function crearEncuesta() {
    if (!nuevaPregunta.trim()) {
      setError("Ingresa una pregunta");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/entities", {
        name: nuevaPregunta.trim(),
        type: "ENCUESTA",
        position: "Pregunta para usuarios",
      });
      setNuevaPregunta("");
      setError("");
      await fetchEncuestas();
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al crear encuesta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              Encuestas del Admin
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Crea preguntas para los usuarios y mide la aceptación
            </p>
          </div>
          <Link
            href="/entities/create"
            className="mt-4 lg:mt-0 bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors inline-flex items-center gap-2"
          >
            Crear Lugar
          </Link>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Crear Nueva Encuesta</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                crearEncuesta();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Pregunta de la encuesta
                </label>
                <Input
                  type="text"
                  placeholder="Ej: ¿Qué tan satisfecho estás con el servicio de delivery?"
                  value={nuevaPregunta}
                  onChange={(e) => setNuevaPregunta(e.target.value)}
                  className="w-full"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Los usuarios podrán calificar del 1 al 5 y dejar comentarios
              </p>
              <Button
                type="submit"
                disabled={loading || !nuevaPregunta.trim()}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3"
              >
                {loading ? "Creando..." : "Crear Encuesta"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de encuestas existentes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Encuestas Activas</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {encuestas.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                No hay encuestas creadas aún.
              </p>
            ) : (
              <div className="space-y-4">
                {encuestas.map((encuesta) => {
                  // Recopilar todas las reviews de todas las locations de la encuesta
                  const allReviews = encuesta.locations?.flatMap(
                    (loc: any) => loc.reviews || []
                  ) || [];
                  const total = allReviews.length;
                  const suma = allReviews.reduce((acc: number, r: any) => acc + r.rating, 0);
                  const aceptacion = total > 0 ? Math.round((suma / total / 5) * 100) : 0;

                  return (
                    <Card
                      key={encuesta.id}
                      className="p-4 hover:shadow-md transition-shadow cursor-pointer border"
                      onClick={() => router.push(`/entities/${encuesta.id}`)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {encuesta.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {total} respuesta{total !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold {aceptacion >= 70 ? "text-green-600" : aceptacion >= 40 ? "text-orange-600" : "text-red-600"}>
                            {aceptacion}%
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Aceptación
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-3">
                        <div
                          className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${aceptacion}%` }}
                        ></div>
                      </div>
                      <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span>Respuestas: {total}</span>
                        <span>Ver detalles →</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}