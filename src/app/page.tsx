"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Entity } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RatingBadge } from "@/components/ui/StarRating";
import { ArrowRight, Star, MapPin, Store, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 dark:text-slate-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-900 dark:to-orange-900/20 py-16 lg:py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-[120px] dark:bg-orange-900/20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-100/20 rounded-full blur-[120px] dark:bg-orange-900/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center lg:text-left lg:max-w-2xl">
            <div className="flex items-center justify-center lg:justify-start gap-5 mb-10">
              <Image
                src="/logo.jpeg"
                alt="Logo KTF"
                width={400}
                height={400}
                className="rounded-3xl object-cover shadow-2xl shadow-orange-600/40"
                priority
              />
              <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 leading-tight">KTF</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 text-sm font-semibold shadow-lg shadow-orange-200/30">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              ¿Cómo te fue?
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              Descubre, califica y comparte
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500">
                tu experiencia
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-lg leading-relaxed">
              ¿Fuiste a un restaurante, automercado, cine o cualquier lugar?
              Cuéntanos cómo te fue. Califica del 1 al 5: ¿fue una{" "}
              <span className="font-bold text-orange-600 dark:text-orange-400">
                raya
              </span>{" "}
              o estuvo{" "}
              <span className="font-bold text-green-600 dark:text-green-400">
                fino
              </span>
              ?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {isAuthenticated ? (
                <Link
                  href="/entities/create"
                  className="px-8 py-4 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 shadow-lg shadow-orange-600/30 transition-all hover:-translate-y-1 hover:shadow-orange-600/40"
                >
                  <ArrowRight className="w-5 h-5 mr-2" /> Calificar un lugar
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-8 py-4 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 shadow-lg shadow-orange-600/30 transition-all hover:-translate-y-1"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/register"
                    className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Regístrate gratis
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:absolute lg:right-0 lg:w-1/2 lg:h-full flex items-end justify-end">
            <div className="relative w-full max-w-md mb-8">
              <Image
                src="/logo.jpeg"
                alt="KTF Logo"
                className="rounded-2xl shadow-2xl border-4 border-white dark:border-slate-800 relative z-10"
                width={400}
                height={400}
                priority
              />
              <div className="absolute -bottom-6 -left-6 bg-orange-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-orange-600/30 flex items-center gap-3">
                <Star className="w-6 h-6 fill-current" />
                <span className="font-bold text-xl">5/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Lugares populares
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Descubre los mejores lugares según la comunidad KTF
              </p>
            </div>
            {isAuthenticated && (
              <Link
                href="/entities"
                className="text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
              >
                Ver todos <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : entities.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 dark:text-slate-400">
                No hay lugares todavía. Sé el primero en calificar uno.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {entities.slice(0, 6).map((entity) => (
                <Link key={entity.id} href={`/entities/${entity.id}`} className="group block">
                  <Card className="hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="h-48 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden mb-4 relative">
                      {entity.photos?.[0] ? (
                        <Image src={entity.photos[0].url} alt={entity.name || "Lugar"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" fill />
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
                            <span key={star} className={cn("w-4 h-4", entity.reviews?.[0]?.rating >= star ? "text-orange-400 fill-orange-400" : "text-slate-300 dark:text-slate-600")}>
                              <Star fill={entity.reviews?.[0]?.rating >= star ? "currentColor" : "none"} stroke={entity.reviews?.[0]?.rating < star ? "currentColor" : "none"} />
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
                          {entity.reviews?.length || 0} reseña{entity.reviews?.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-orange-600 dark:bg-orange-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Ya probaste algún lugar?</h2>
          <p className="text-orange-100 mb-8 text-lg">
            Comparte tu experiencia y ayuda a otros a saber si estuvo fino o fue una raya.
          </p>
          {isAuthenticated ? (
            <Link
              href="/entities/create"
              className="inline-block px-8 py-4 bg-white text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-colors shadow-2xl shadow-white/20"
            >
              Agregar mi reseña
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-block px-8 py-4 bg-white text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-colors shadow-2xl shadow-white/20"
            >
              Iniciar sesión para calificar
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
