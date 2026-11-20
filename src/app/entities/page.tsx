"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Entity } from "@/lib/types";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Star, MapPin, Store, User as UserIcon, Search, BarChart2, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";

export default function EntitiesPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEntities();
  }, []);

  async function fetchEntities() {
    try {
      const response = await api.get("/entities");
      setEntities(response.data || []);
    } catch (error) {
      console.error("Error fetching entities:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredEntities = entities.filter(
    (e) =>
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.type.toLowerCase().includes(search.toLowerCase())
  );

  const [showAll, setShowAll] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Todos los lugares
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Explora y califica restaurantes, automercados, cines y más.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              label="Buscar"
              placeholder="Buscar lugares..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              className="w-full sm:w-64"
            />
            {isAuthenticated && (
              <>
                <Button
                  onClick={() => router.push("/entities/create")}
                  className="bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-600/30"
                >
                  <Store className="w-4 h-4 mr-2" /> Agregar lugar
                </Button>
                {(user?.role ?? '').toString() === 'ADMIN' && (
                  <Link href="/admin/encuestas">
                    <Button
                      className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-700/30"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" /> Encuestas
                    </Button>
                  </Link>
                )}
                <Link href="/estadisticas">
                  <Button
                    className="bg-slate-600 text-white hover:bg-slate-700 shadow-lg shadow-slate-600/30"
                  >
                    <BarChart2 className="w-4 h-4 mr-2" /> Ver Estadísticas
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredEntities.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 dark:text-slate-400">
              No se encontraron lugares con "{search}".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntities.map((entity) => (
              <Card
                key={entity.id}
                className="hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="h-48 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden mb-4 relative">
                    {entity.photos?.[0] ? (
                      <img
                        src={entity.photos[0].url}
                        alt={entity.name || "Lugar"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Store className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-orange-600 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">
                      {entity.type === "BUSINESS" ? "Negocio" : "Persona"}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {entity.name || "Sin nombre"}
                    </h3>
                    {entity.position && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                        {entity.position}
                      </p>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={cn(
                              "w-4 h-4",
                              entity.reviews?.[0]?.rating >= star
                                ? "text-orange-400 fill-orange-400"
                                : "text-slate-300 dark:text-slate-600"
                            )}
                          >
                            <Star
                              fill={
                                entity.reviews?.[0]?.rating >= star
                                  ? "currentColor"
                                  : "none"
                              }
                              stroke={
                                entity.reviews?.[0]?.rating < star
                                  ? "currentColor"
                                  : "none"
                            }
                          />
                        </span>
                        ))}
                      </div>
                      {entity.locations?.[0] && (
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <MapPin className="w-3 h-3" />
                          {entity.locations[0].address}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {entity.reviews?.length || 0} reseña
                        {entity.reviews?.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {/* Mostrar todas las ubicaciones (sucursales) */}
                    {entity.locations && entity.locations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                          {entity.locations.length} sucursal{entity.locations.length !== 1 ? "es" : ""}
                        </p>
                        {/* Mostrar solo 3 por defecto, o todas si showAll es true */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {entity.locations.slice(0, showAll ? entity.locations.length : 3).map((loc) => (
                            <Link
                              key={loc.id}
                              href={`/reviews/location/${loc.id}`}
                              className="block"
                            >
                              <div
                                className="p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              >
                                <strong>{loc.address || "Sin dirección"}</strong>
                                {loc.phone && (
                                  <div className="mt-1">
                                    <span className="text-orange-500">📞</span> {loc.phone}
                                  </div>
                                )}
                                {loc.latitude && loc.longitude && (
                                  <div className="mt-1 text-gray-400 dark:text-gray-500">
                                    📍 {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                                  </div>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                        {entity.locations.length > 3 && (
                          <Button
                            onClick={() => setShowAll(!showAll)}
                            className="mt-2 w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-lg transition-colors text-sm"
                            style={{ textAlign: 'center' }}
                          >
                            {showAll ? 'Ver menos sucursales' : 'Ver todas las sucursales'}
                          </Button>
                        )}
                      </div>
                    )}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/entities/${entity.id}/locations/create`);
                      }}
                      className="mt-3 w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-lg transition-colors text-sm"
                    >
                      Agregar ubicación
                    </Button>
                  </div>
                </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}