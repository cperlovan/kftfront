"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(email, password, name || undefined);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al registrar");
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
              <User className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Crear cuenta KTF</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Únete a la comunidad y comparte tus experiencias.
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
              label="Nombre completo"
              type="text"
              placeholder="Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="•••••••• (mínimo 6 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full bg-orange-600 text-white font-semibold py-4 hover:bg-orange-700 shadow-lg shadow-orange-600/30 transition-all"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <ArrowRight className="w-4 h-4 mr-2 animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" /> Crear cuenta
                </>
              )}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-orange-600 dark:text-orange-400 font-medium hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
