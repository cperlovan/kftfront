"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, User, LogOut, LayoutDashboard, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Inicio", href: "/", icon: LayoutDashboard },
  { name: "Lugares", href: "/entities", icon: Star },
];

export default function Navbar() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [pathname, setPathname] = useState<string>("/");

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/50 dark:border-slate-800/50 bg-slate-900/90 backdrop-blur-md dark:bg-slate-900/90 transition-all duration-300">
      <div className="flex items-center justify-between px-4 py-3 md:px-8 lg:px-12">
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="Ir al inicio"
        >
          <Image
            src="/logo.jpeg"
            alt="Logo KTF"
            width={40}
            height={40}
            className="rounded-lg group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-orange-600/30 object-cover"
            priority
          />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">
            KTF
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-600/25"
                    : "text-slate-300 hover:bg-slate-800/50 hover:text-white dark:text-slate-300 dark:hover:bg-slate-800",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className={cn("w-4 h-4", active && "text-white")} />
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            );
          })}
          {isAuthenticated && !isLoading ? (
            <>
              <Link href="/perfil" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition-colors">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Perfil</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-lg text-slate-300 hover:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors" aria-label="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors">
                Iniciar sesión
              </Link>
              <Link href="/register" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition-colors">
                Regístrate
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-slate-300 hover:bg-white/10 transition-colors"
            aria-label="Abrir menú"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden border-t border-slate-800/50 bg-slate-900/95 backdrop-blur-md",
          isOpen ? "max-h-[60vh] overflow-y-auto opacity-100 mt-0 transition-all duration-300" : "max-h-0 opacity-0 mt-0 transition-all duration-300 overflow-hidden",
        )}
      >
        <div className="px-4 py-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-orange-600/20 text-orange-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white",
                )}
                onMouseEnter={() => setIsOpen(false)}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
          {isAuthenticated && !isLoading ? (
            <>
              <Link
                href="/perfil"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <User className="w-5 h-5" />
                Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Regístrate
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
