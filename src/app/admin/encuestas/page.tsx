"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

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

const TIPOS_ENTIDAD: { value: TipoEntidad; label: string; icono: string }[] = [
  { value: "PRODUCTO", label: "Producto", icono: "📦" },
  { value: "LOCAL", label: "Local / Negocio", icono: "🏪" },
  { value: "PERSONA", label: "Persona / Atención", icono: "👤" },
  { value: "OTRO", label: "Otro", icono: "❓" },
];

export default function EncuestasAdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombreEntidad, setNombreEntidad] = useState("");
  const [tipoEntidad, setTipoEntidad] = useState<TipoEntidad>("PRODUCTO");
  const [descripcion, setDescripcion] = useState("");
  const [preguntas, setPreguntas] = useState<PreguntaEncuesta[]>([
    {
      id: "1",
      texto: "¿Cuál es su nivel de satisfacción general?",
      tipo: "ESTRELLAS",
      obligatoria: true,
      opciones: [],
    },
  ]);
  const [editingPreguntaId, setEditingPreguntaId] = useState<string | null>(null);
  const [nuevaPreguntaTexto, setNuevaPreguntaTexto] = useState("");
  const [nuevaOpcionPorPregunta, setNuevaOpcionPorPregunta] = useState<Record<string, string>>({});


  // Obtener encuestas
  const fetchEncuestas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/encuestas");
      const data = response.data || [];
      const normalizadas: Encuesta[] = data.map((e: any) => ({
        id: e.id || Math.random().toString(36).substring(2, 11),
        nombreEntidad: e.nombreEntidad || e.nombre || "Sin nombre",
        tipoEntidad: e.tipoEntidad || "PRODUCTO",
        descripcion: e.descripcion || "",
        preguntas: (e.preguntas || []).map((p: any) => ({
          ...p,
          opciones: Array.isArray(p.opciones) ? p.opciones : [],
        })),
        respuestas: e.respuestas || [],
        fechaCreacion: e.fechaCreacion || new Date().toISOString(),
        activo: e.activo !== undefined ? e.activo : true,
      }));
      setEncuestas(normalizadas);
    } catch {
      setError("Error al cargar encuestas");
      setEncuestas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Validación de admin en useEffect
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || user?.role !== "ADMIN") {
      router.push("/");
      return;
    }
    fetchEncuestas();
  }, [isAuthenticated, router, fetchEncuestas, isLoading, user]);

  const agregarPregunta = () => {
    const id = Date.now().toString();
    setPreguntas((prev) => [
      ...prev,
      {
        id,
        texto: nuevaPreguntaTexto.trim() || `Pregunta ${prev.length + 1}`,
        tipo: "ESTRELLAS",
        obligatoria: true,
        opciones: [],
      },
    ]);
    setNuevaPreguntaTexto("");
  };

  const eliminarPregunta = (id: string) => {
    setPreguntas((prev) => prev.filter((p) => p.id !== id));
  };

  const cambiarTipoPregunta = (id: string, tipo: "ESTRELLAS" | "TEXTO" | "MULTIPLE") => {
    setPreguntas((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            tipo,
            opciones: tipo === "MULTIPLE" ? p.opciones : [],
          };
        }
        return p;
      })
    );
  };

  const cambiarObligatoria = (id: string) => {
    setPreguntas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, obligatoria: !p.obligatoria } : p))
    );
  };

  // Agregar opción a pregunta múltiple
  const agregarOpcion = (preguntaId: string) => {
    const texto = (nuevaOpcionPorPregunta[preguntaId] ?? "").trim();
    if (!texto) return;

    setPreguntas((prev) =>
      prev.map((p) => {
        if (p.id === preguntaId && p.tipo === "MULTIPLE") {
          return {
            ...p,
            opciones: [...p.opciones, texto],
          };
        }
        return p;
      })
    );

    setNuevaOpcionPorPregunta((prev) => ({ ...prev, [preguntaId]: "" }));
  };

  // Eliminar opción de pregunta múltiple
  const eliminarOpcion = (preguntaId: string, opcionIndex: number) => {
    setPreguntas((prev) =>
      prev.map((p) => {
        if (p.id === preguntaId && p.tipo === "MULTIPLE") {
          return {
            ...p,
            opciones: p.opciones.filter((_, i) => i !== opcionIndex),
          };
        }
        return p;
      })
    );
  };

  // Editar opción de pregunta múltiple
  const editarOpcion = (preguntaId: string, opcionIndex: number, nuevoTexto: string) => {
    setPreguntas((prev) =>
      prev.map((p) => {
        if (p.id === preguntaId && p.tipo === "MULTIPLE") {
          const opciones = [...p.opciones];
          opciones[opcionIndex] = nuevoTexto;
          return { ...p, opciones };
        }
        return p;
      })
    );
  };

  const crearEncuesta = async () => {
    if (!nombreEntidad.trim()) {
      setError("Ingrese el nombre de la entidad a evaluar");
      return;
    }

    const preguntasLimpias = preguntas.map((p) => ({
      ...p,
      texto: p.texto.trim(),
      opciones: p.tipo === "MULTIPLE" ? p.opciones.map((o) => o.trim()).filter(Boolean) : [],
    }));

    const nuevaEncuesta: Encuesta = {
      id: Date.now().toString(),
      nombreEntidad: nombreEntidad.trim(),
      tipoEntidad,
      descripcion: descripcion.trim(),
      preguntas: preguntasLimpias,
      respuestas: [],
      fechaCreacion: new Date().toISOString(),
      activo: true,
    };

    setGuardando(true);
    try {
      await api.post("/encuestas", nuevaEncuesta);
    } catch {
      console.log("Guardando encuesta localmente (backend no disponible)");
    } finally {
      setGuardando(false);
    }

    setEncuestas((prev) => [nuevaEncuesta, ...prev]);
    setMostrarFormulario(false);
    setNombreEntidad("");
    setDescripcion("");
    setPreguntas([
      {
        id: "1",
        texto: "¿Cuál es su nivel de satisfacción general?",
        tipo: "ESTRELLAS",
        obligatoria: true,
        opciones: [],
      },
    ]);
    setNuevaOpcionPorPregunta({});
    setError("");
  };

  const calcularPromedio = (encuesta: Encuesta): number => {
    if (encuesta.respuestas.length === 0) return 0;
    const suma = encuesta.respuestas.reduce((a, b) => a + b, 0);
    return Math.round((suma / encuesta.respuestas.length) * 10) / 10;
  };

  const getEstrellas = (promedio: number) => {
    const arr = [];
    for (let i = 1; i <= 5; i++) {
      arr.push(i <= Math.round(promedio));
    }
    return arr;
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            📊 Sistema de Encuestas
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Mide la calidad de productos, locales, personas y más
          </p>
        </div>
        <Button
          onClick={() => {
            setError("");
            setMostrarFormulario(!mostrarFormulario);
          }}
          variant="primary"
          size="lg"
        >
          {mostrarFormulario ? "❌ Cancelar" : "+ Nueva Encuesta"}
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {mostrarFormulario && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Crear Nueva Encuesta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nombre de la entidad a evaluar"
                placeholder="Ej: Café Express, iPhone 15, Juan Pérez"
                value={nombreEntidad}
                onChange={(e) => setNombreEntidad(e.target.value)}
              />
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tipo de entidad
                </label>
                <div className="flex flex-wrap gap-2">
                  {TIPOS_ENTIDAD.map((t) => (
                    <Button
                      key={t.value}
                      variant={tipoEntidad === t.value ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setTipoEntidad(t.value)}
                    >
                      {t.icono} {t.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                placeholder="Ej: Evaluar la calidad del servicio al cliente"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                rows={3}
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Preguntas ({preguntas.length})
                </h3>
                <div className="flex items-center gap-2">
                  <textarea
                    placeholder="Nueva pregunta..."
                    value={nuevaPreguntaTexto}
                    onChange={(e) => setNuevaPreguntaTexto(e.target.value)}
                    className="w-64 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    rows={2}
                  />
                  <Button variant="outline" size="sm" onClick={agregarPregunta}>
                    + Agregar
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {preguntas.map((pregunta) => (
                  <Card key={pregunta.id} className="border-slate-100 dark:border-slate-800">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <textarea
                          placeholder="Texto de la pregunta"
                          value={pregunta.texto}
                          onChange={(e) =>
                            setPreguntas((prev) =>
                              prev.map((p) =>
                                p.id === pregunta.id ? { ...p, texto: e.target.value } : p
                              )
                            )
                          }
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          rows={2}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => eliminarPregunta(pregunta.id)}
                          disabled={preguntas.length === 1}
                        >
                          ×
                        </Button>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm mb-3">
                        <span className="text-slate-500">
                          {pregunta.tipo === "ESTRELLAS"
                            ? "⭐ Calificación"
                            : pregunta.tipo === "TEXTO"
                            ? "📝 Texto"
                            : "🔘 Opción Múltiple"}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            cambiarTipoPregunta(
                              pregunta.id,
                              pregunta.tipo === "ESTRELLAS"
                                ? "TEXTO"
                                : pregunta.tipo === "TEXTO"
                                ? "MULTIPLE"
                                : "ESTRELLAS"
                            )
                          }
                        >
                          Cambiar tipo
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cambiarObligatoria(pregunta.id)}
                        >
                          {pregunta.obligatoria ? "Obligatoria" : "Opcional"}
                        </Button>
                      </div>

                      {pregunta.tipo === "MULTIPLE" && (
                        <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Nueva opción de respuesta..."
                              value={nuevaOpcionPorPregunta[pregunta.id] ?? ""}
                              onChange={(e) =>
                                setNuevaOpcionPorPregunta((prev) => ({
                                  ...prev,
                                  [pregunta.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  agregarOpcion(pregunta.id);
                                }
                              }}
                              className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => agregarOpcion(pregunta.id)}
                            >
                              + Agregar
                            </Button>
                          </div>

                          <div className="space-y-1">
                            {pregunta.opciones.map((opcion, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={opcion}
                                  onChange={(e) =>
                                    editarOpcion(pregunta.id, index, e.target.value)
                                  }
                                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => eliminarOpcion(pregunta.id, index)}
                                >
                                  ×
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Button
              onClick={crearEncuesta}
              variant="primary"
              className="w-full py-3"
              isLoading={guardando}
            >
              💾 Guardar Encuesta
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4 space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {encuestas.length}
                </span>
                <span className="text-slate-500 dark:text-slate-400">Encuestas creadas</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {encuestas.reduce((a, b) => a + b.respuestas.length, 0)}
                </span>
                <span className="text-slate-500 dark:text-slate-400">Calificaciones recibidas</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Por tipo de entidad
            </h3>
            {TIPOS_ENTIDAD.map((t) => {
              const count = encuestas.filter((e) => e.tipoEntidad === t.value).length;
              return (
                <div key={t.value} className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    {t.icono} {t.label}
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:w-3/4 space-y-4">
          {encuestas.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                No hay encuestas creadas
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Crea tu primera encuesta para empezar a medir la calidad
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {encuestas.map((encuesta) => {
                const promedio = calcularPromedio(encuesta);
                const tipoInfo = TIPOS_ENTIDAD.find((t) => t.value === encuesta.tipoEntidad);
                return (
                  <Card
                    key={encuesta.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <CardTitle className="text-sm font-semibold truncate">
                            {encuesta.nombreEntidad}
                          </CardTitle>
                          <span className="inline-block mt-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">
                            {tipoInfo?.icono} {tipoInfo?.label}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 shrink-0">
                          {new Date(encuesta.fechaCreacion).toLocaleDateString("es-ES")}
                        </span>
                      </div>
                      {encuesta.descripcion && (
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                          {encuesta.descripcion}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                            {promedio.toFixed(1)}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 text-sm">/ 5</span>
                        </div>
                        <div className="flex gap-1">
                          {getEstrellas(promedio).map((llena, i) => (
                            <span
                              key={i}
                              className={
                                llena ? "text-orange-400" : "text-slate-200 dark:text-slate-700"
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {encuesta.respuestas.length} respuesta
                          {encuesta.respuestas.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            alert(
                              `Encuesta: ${encuesta.nombreEntidad}\nTipo: ${tipoInfo?.label}\nPreguntas: ${encuesta.preguntas.length}\nRespuestas: ${encuesta.respuestas.length}`
                            );
                          }}
                        >
                          📋 Ver detalles
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEncuestas((prev) => prev.filter((e) => e.id !== encuesta.id));
                          }}
                        >
                          🗑️ Eliminar
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {encuesta.preguntas.map((p) => (
                          <span
                            key={p.id}
                            className={`text-xs font-medium px-2 py-1 rounded ${
                              p.tipo === "ESTRELLAS"
                                ? "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                                : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            }`}
                          >
                            {p.texto.length > 20 ? p.texto.substring(0, 20) + "..." : p.texto}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}