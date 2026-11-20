"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Monitor, Zap, ShieldCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Sistema operativo
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
            >
              Construye aplicaciones{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
                modernas y escalables
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg"
            >
              El frontend de KFT está desarrollado con Next.js, Tailwind CSS y un diseño completamente responsivo que se adapta a PC, tablets y celulares.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/dashboard"
                className="group relative flex-1 sm:flex-none px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold text-center hover:bg-blue-700 shadow-lg shadow-blue-600/25 transition-all hover:shadow-blue-600/35 hover:-translate-y-1"
              >
                <ArrowRight className="w-5 h-5 mr-2" /> Comenzar ahora
              </Link>
              <Link
                href="#features"
                className="flex-1 sm:flex-none px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-center font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              >
                <Play className="w-5 h-5 mr-2" /> Ver demo
              </Link>
            </motion.div>
          </div>
          <div className="relative flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative w-full max-w-md"
            >
              <div className="relative rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-slate-100 dark:bg-slate-700 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                      <Monitor className="w-6 h-6 text-blue-500 mb-2" />
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">10K+</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Usuarios activos</div>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                      <Zap className="w-6 h-6 text-indigo-500 mb-2" />
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">99.9%</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Disponibilidad</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200/30 dark:border-blue-800/30">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">Seguro por diseño</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Autenticación JWT integrada</div>
                      </div>
                    </div>
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}