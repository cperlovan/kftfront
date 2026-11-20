"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Credenciales inválidas");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-orange-50 dark:bg-slate-950 px-4">
      <Card className="w-full max-w-md shadow-2xl shadow-orange-200/30 dark:shadow-orange-900/20">
        <CardHeader className="pb-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/30">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bienvenido a KTF</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              ¿Cómo te fue? Inicia sesión para calificar lugares.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
            />
            <Button
              type="submit"
              className="w-full bg-orange-600 text-white font-semibold py-4 hover:bg-orange-700 shadow-lg shadow-orange-600/30 transition-all"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <ArrowRight className="w-4 h-4 mr-2 animate-spin" />
                  Iniciando...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" /> Iniciar sesión
                </>
              )}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-orange-600 dark:text-orange-400 font-medium hover:underline"
            >
              Regístrate gratis
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
