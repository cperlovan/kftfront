"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Image from "next/image";
import { Upload } from "lucide-react";

export default function CreateEntityPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState("BUSINESS");
  const [position, setPosition] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirigir a login si no autenticado (después de render, no durante)
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Subir la foto automáticamente al backend
      const readerPromise = new Promise<string | null>((resolve) => {
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          // Subir al API de fotos - necesitamos el entityId primero
          // Guardamos la dataURL temporalmente y la subimos después en el submit
          resolve(dataUrl);
        };
      });
      
      // Solo leemos el archivo, la subida sucederá en el submit
      // para tener el entityId disponible
    } else {
      setImagePreview(null);
    }
  };

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevenir envíos múltiples
    if (submitting || hasSubmitted) return;

    setError("");
    setSubmitting(true);
    setHasSubmitted(true);

    try {
      const response = await api.post("/entities", { name, type, position });
      const entityId = response.data.id;

      // Subir la foto si fue seleccionada o si hay URL de texto
      if (imageFile) {
        // Convertir el archivo seleccionado a data URL y subir
        const reader = new FileReader();
        reader.onload = () => {
          const photoUrl = reader.result as string;
          api.post(`/entities/${entityId}/photos`, { url: photoUrl }).then(() => {
            router.push("/entities");
          });
        };
        reader.readAsDataURL(imageFile);
      } else if (imageUrl.trim()) {
        // Si no hay archivo pero hay URL de texto, usarla
        await api.post(`/entities/${entityId}/photos`, { url: imageUrl.trim() });
        router.push("/entities");
      } else {
        // Sin foto, crear entidad normalmente
        router.push("/entities");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al crear el lugar");
      setSubmitting(false);
      setHasSubmitted(false);
    } finally {
      if (!hasSubmitted) {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <Card className="shadow-2xl shadow-orange-200/30 dark:shadow-orange-900/20">
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Agregar lugar a KTF
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Cuéntanos sobre este restaurante, automercado, cine o negocio.
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tipo de lugar
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={type === "BUSINESS"}
                      onChange={() => setType("BUSINESS")}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                    />
                    Negocio
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={type === "PERSON"}
                      onChange={() => setType("PERSON")}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                    />
                    Persona
                  </label>
                </div>
              </div>
              <Input
                label="Nombre"
                placeholder="Nombre del lugar o persona"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Posición / Cargo (opcional)"
                placeholder="Ej. Gerente, Dueño, Mesero"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
              <Input
                label="URL de la foto (opcional)"
                placeholder="https://ejemplo.com/foto.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Foto del lugar (opcional)
                </label>
                <div className="flex flex-col items-center gap-3">
                  {imagePreview ? (
                    <div className="relative group">
                      <Image
                        src={imagePreview}
                        alt="Vista previa"
                        width={120}
                        height={120}
                        className="rounded-xl object-cover border-2 border-orange-300 dark:border-orange-600 shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors text-xs"
                        aria-label="Eliminar foto"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById(
                          "entity-image-input"
                        ) as HTMLInputElement;
                        input?.click();
                      }}
                      className="flex items-center justify-center gap-2 w-40 h-40 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors cursor-pointer text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400"
                    >
                      <Upload className="w-6 h-6" />
                      <span className="text-sm font-medium">Seleccionar foto</span>
                    </button>
                  )}
                  <input
                    id="entity-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Foto seleccionada. Se guardará automáticamente al crear el lugar.
                  </p>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-600 text-white font-semibold py-4 hover:bg-orange-700 shadow-lg shadow-orange-600/30 transition-all"
                disabled={submitting}
              >
                {submitting ? "Creando..." : "Crear lugar"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          ← <Link href="/entities" className="text-orange-600 dark:text-orange-400 hover:underline font-medium">Ver todos los lugares</Link>
        </p>
      </div>
    </div>
  );
}
