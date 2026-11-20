"use client";

import { motion } from "framer-motion";
import {
  Layers,
  Smartphone,
  Monitor,
  Tablet,
  Shield,
  Rocket,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Monitor,
    title: "Diseño para PC",
    description: "Interfaz optimizada para escritorio con navegación fluida y paneles de control completos.",
    color: "bg-blue-500",
  },
  {
    icon: Tablet,
    title: "Tablets",
    description: "Layout adaptable que se ajusta perfectamente a pantallas medianas para una experiencia táctil.",
    color: "bg-indigo-500",
  },
  {
    icon: Smartphone,
    title: "Celulares",
    description: "Versión móvil totalmente responsiva con menú hamburguesa y botones de acceso rápido.",
    color: "bg-purple-500",
  },
  {
    icon: Shield,
    title: "Seguro",
    description: "Autenticación JWT y comunicaciones cifradas con tu backend NestJS en el puerto 3000.",
    color: "bg-green-500",
  },
  {
    icon: Rocket,
    title: "Rápido",
    description: "Next.js con App Router y Turbopack para cargas instantáneas y mejor SEO.",
    color: "bg-orange-500",
  },
  {
    icon: Zap,
    title: "Tiempo real",
    description: "Conecta tu frontend con el API backend mediante Axios y recibe datos al instante.",
    color: "bg-pink-500",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Responsive en todos los dispositivos
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Una sola aplicación que se ve increíble en computadoras, tablets y teléfonos móviles.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                whileHover={{ y: -5 }}
                key={feature.title}
                className={cn(
                  "group p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 transition-all hover:border-blue-300 dark:hover:border-blue-700",
                )}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${feature.color} group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
