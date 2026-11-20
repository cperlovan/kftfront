"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { User } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { User as UserIcon, Mail, LogOut, ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const response = await api.get("/auth/profile");
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="p-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400">
            Volver al inicio
          </Link>
        </div>

        <Card className="shadow-xl shadow-orange-200/30 dark:shadow-orange-900/20">
          <CardHeader className="flex flex-col items-center text-center pb-8">
            <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
              <UserIcon className="w-10 h-10 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {profile?.name || profile?.email || "Usuario"}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {profile?.email}
            </p>
            <span className={cn(
              "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
              profile?.role === "ADMIN" ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" : ""
            )}>
              {profile?.role === "ADMIN" ? "Administrador" : "Usuario"}
            </span>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-slate-400" />
              <span className="text-slate-600 dark:text-slate-400">Correo electrónico</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 text-slate-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M12 12a3 3 0 100-6 3 3 0 000 6zM12 12a4 4 0 100-8 4 4 0 000 8z" /></svg>
              </div>
              <span className="text-slate-600 dark:text-slate-400">ID de usuario</span>
            </div>
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <Button
                onClick={logout}
                className="w-full bg-red-600 text-white font-semibold py-3 hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  function cn(...classes: (string | undefined | null | boolean)[]) {
    return classes.filter(Boolean).join(" ");
  }
}
