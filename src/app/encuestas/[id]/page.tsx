"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Star, List, ArrowLeft, CheckCircle } from "lucide-react";

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
}

interface RespuestaForm {
  [preguntaId: string]: string;
}

export default function ResponderEncuestaPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const encuestaId = params.id as string;

  const [encuesta, setEncuesta] = useState<Encuesta | null>(null);
  const [loading, setLoading] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [respuestas, setRespuestas] = useState<RespuestaForm>({});

  const fetchEncuesta = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/encuestas/${encuestaId}`);
      const data = response.data;
      setEncuesta({
        id: data.id,
        nombreEntidad: data.nombreEntidad || "",
        tipoEntidad: data.tipoEntidad || "PRODUCTO",
        descripcion: data.descripcion || "",
        preguntas: (data.preguntas || []).map((p: any) => ({
          id: p.id,
          texto: p.texto || "",
          tipo: p.tipo || "ESTRELLAS",
          obligatoria: p.obligatoria ?? true,
          opciones: Array.isArray(p.opciones) ? p.opciones : [],
        })),
        respuestas: data.respuestas || [],
        fechaCreacion: data.fechaCreacion || new Date().toISOString(),
        activo: data.activo !== undefined ? data.activo : true,
      });
    } catch {
      setError("Error al cargar la encuesta");
    } finally {
      setLoading(false);
    }
  }, [encuestaId]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchEncuesta();
  }, [isAuthenticated, router, fetchEncuesta]);

  const handleRespuestaChange = (preguntaId: string, valor: string) => {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: valor }));
  };

  const validarRespuestas = (): boolean => {
    if (!encuesta) return false;
    for (const pregunta of encuesta.preguntas) {
      if (pregunta.obligatoria && !respuestas[pregunta.id]?.trim()) {
        setError(`La pregunta "${pregunta.texto}" es obligatoria`);
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleEnviar = async () => {
    if (!encuesta || !user) return;
    if (!validarRespuestas()) return;

    setEnviando(true);
    setError("");

    try {
      const prompts = encuesta.preguntas.map((pregunta) =>
        api.post("/users/responder", {
          userId: user.id,
          encuestaId: encuesta.id,
          preguntaId: pregunta.id,
          respuesta: respuestas[pregunta.id] || "",
          tipoRespuesta: pregunta.tipo,
        })
      );
      await Promise.all(prompts);
      setExito(true);
    } catch {
      setError("Error al enviar las respuestas. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  const getTipoInfo = (tipo: TipoEntidad) => {
    const tipos: Record<TipoEntidad, { label: string; icono: string }> = {
      PRODUCTO: { label: "Producto", icono: "📦" },
      LOCAL: { label: "Local / Negocio", icono: "🏪" },
      PERSONA: { label: "Persona / Atención", icono: "👤" },
      OTRO: { label: "Otro", icono: "❓" },
    };
    return tipos[tipo];
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (exito) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-8">
        <div className="max-w-md mx-auto">
          <Card className="text-center py-12">
            <CardHeader>
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">¡Gracias por responder!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                Tu respuesta ha sido enviada correctamente.
              </p>
              <Button
                onClick={() => router.push("/encuestas")}
                variant="primary"
                className="w-full"
              >
                Volver a encuestas
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!encuesta) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
            Encuesta no encontrada
          </h3>
          <Button onClick={() => router.push("/encuestas")} variant="outline">
            Volver
          </Button>
        </div>
      </div>
    );
  }

  const tipoInfo = getTipoInfo(encuesta.tipoEntidad);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/encuestas">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Volver
            </Button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <Card className="shadow-xl shadow-orange-200/30 dark:shadow-orange-900/20">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400`}>
                {tipoInfo?.icono || "❓"}
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {tipoInfo?.label || "Otro"}
                </span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold leading-tight mb-2">
              {encuesta.nombreEntidad}
            </CardTitle>
            {encuesta.descripcion && (
              <p className="text-slate-600 dark:text-slate-400">
                {encuesta.descripcion}
              </p>
            )}
            <div className="mt-4 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4" />
                <span>{encuesta.preguntas.length} pregunta{encuesta.preguntas.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={(e) => e.preventDefault()}>
              {encuesta.preguntas.map((pregunta) => (
                <div key={pregunta.id} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <label className="block text-slate-900 dark:text-white font-medium text-lg mb-2">
                        {pregunta.texto}
                      </label>
                      {pregunta.obligatoria && (
                        <span className="text-red-500 ml-1">*</span>
                      )}

                      {pregunta.tipo === "ESTRELLAS" && (
                        <div className="flex items-center gap-2 mt-2">
                          {[1, 2, 3, 4, 5].map((estrella) => (
                            <button
                              key={estrella}
                              type="button"
                              onClick={() =>
                                handleRespuestaChange(pregunta.id, estrella.toString())
                              }
                              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                respuestas[pregunta.id] === estrella.toString()
                                  ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 border border-slate-200 dark:border-slate-700"
                              }`}
                            >
                              <Star className="w-5 h-5 fill-current" />
                            </button>
                          ))}
                        </div>
                      )}

                      {pregunta.tipo === "TEXTO" && (
                        <Input
                          label="Tu respuesta"
                          placeholder="Escribe tu respuesta aquí..."
                          value={respuestas[pregunta.id] || ""}
                          onChange={(e) =>
                            handleRespuestaChange(pregunta.id, e.target.value)
                          }
                          className="mt-2"
                        />
                      )}

                      {pregunta.tipo === "MULTIPLE" && (
                        <div className="mt-2 space-y-2">
                          {pregunta.opciones.map((opcion, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() =>
                                handleRespuestaChange(pregunta.id, opcion)
                              }
                              className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-200 border ${
                                respuestas[pregunta.id] === opcion
                                  ? "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-600 dark:border-orange-400"
                                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                              }`}
                            >
                              {opcion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Los campos marcados con * son obligatorios
                </p>
                <Button
                  type="button"
                  onClick={handleEnviar}
                  variant="primary"
                  isLoading={enviando}
                  className="w-full sm:w-auto px-8"
                  disabled={enviando}
                >
                  Enviar respuestas
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}