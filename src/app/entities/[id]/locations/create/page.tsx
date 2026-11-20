"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function EntityLocationCreatePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  
  // Obtener el ID de la entidad de la URL usando useParams (funciona con routes dinámicas [id])
  const routeId = params.id as string;

  const [formData, setFormData] = useState<{
    address: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
  }>({
    address: "",
    latitude: undefined,
    longitude: undefined,
    phone: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "latitude" || name === "longitude"
        ? value === "" || value === undefined
          ? undefined
          : Number(value)
        : value,
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`/entities/${routeId}/locations`, formData);
      setSuccess(true);

      // Resetear formulario después de crear la ubicación
      // para permitir agregar otra ubicación seguida
      setFormData({
        address: "",
        latitude: undefined,
        longitude: undefined,
        phone: undefined,
      });
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al crear la ubicación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 md:p-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Agregar Ubicación a la Entidad
          </h2>

          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 rounded-md p-4 mb-6 animate-slide-in-from-top-fade fade-in-0">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-md p-4 mb-6 animate-slide-in-from-top-fade fade-in-0">
              Ubicación agregada exitosamente
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Dirección *</label
              >
              <Input
                type="text"
                name="address"
                placeholder="Ej: Calle Principal 123"
                value={formData.address}
                onChange={onChange}
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>

            {isAuthenticated && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Teléfono (opcional)</label
                >
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Ej: +54 9 11 1234-5678"
                  value={formData.phone || ""}
                  onChange={onChange}
                  disabled={isLoading}
                  className="w-full"
                />
              </div>
            )}

            {isAuthenticated && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Coordenadas (opcional)</label
                >
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    name="latitude"
                    placeholder="Latitud"
                    value={formData.latitude !== undefined ? String(formData.latitude) : ""}
                    onChange={onChange}
                    disabled={isLoading}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    name="longitude"
                    placeholder="Longitud"
                    value={formData.longitude !== undefined ? String(formData.longitude) : ""}
                    onChange={onChange}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ej: -34.6037, -58.3816
                </p>
              </div>
            )}

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg transition-colors"
              >
                {loading ? "Guardando..." : "Agregar Ubicación"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              href={`/entities/${routeId}`}
              className="text-slate-600 dark:text-slate-400 hover:text-orange-500 transition-colors"
            >
              ← Volver al detalle de la entidad
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
