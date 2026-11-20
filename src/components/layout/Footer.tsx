"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const footerLinks = [
  { name: "Inicio", href: "/" },
  { name: "Productos", href: "/productos" },
  { name: "Usuarios", href: "/usuarios" },
  { name: "Precios", href: "/precios" },
  { name: "Contacto", href: "/contacto" },
];

const companyLinks = [
  { name: "Nosotros", href: "/nosotros" },
  { name: "Términos", href: "/terminos" },
  { name: "Privacidad", href: "/privacidad" },
  { name: "Soporte", href: "/soporte" },
];

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number>(0);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-slate-950 border-t border-slate-900 dark:bg-black">
      <div className="px-4 py-12 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.jpeg"
                alt="Logo KTF"
                width={32}
                height={32}
                className="rounded-lg object-cover"
                priority
              />
              <span className="text-xl font-bold text-white">KFT</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Soluciones tecnológicas modernas para tu negocio. Diseño responsivo, escalable y seguro.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-6">Producto</h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-6">Empresa</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-6">Mantente conectado</h3>
            <p className="text-sm text-slate-400 mb-6">
              Suscríbete para recibir novedades y actualizaciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xs">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <button className="px-5 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                Suscribirse
              </button>
            </div>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-.729-1.11-.895-1.11-1.318 0-.424.21-.606.255-.644.887-.156 1.157-.769 1.157-.769-1.29-.227-.64-.318-.64-.318 1.025-.076 1.794 1.206 1.794 1.206 1.07 1.783 2.745 1.27 3.414.977.245-1.893.742-3.187 1.404-3.86-3.607-.435-7.415-1.806-7.415-8.206 0-1.812.647-3.473 1.739-4.7-.178-.443-.777-2.237.02-4.665 0 0 1.412-.454 4.639 1.657a11.63 11.63 0 016.296 0c3.214-2.112 4.639-1.657 4.639-1.657.796 2.428.198 4.222.02 4.665 1.092 1.227 1.739 2.887 1.739 4.7 0 6.383-3.807 7.765-7.413 8.205a10.2 10.2 0 012.632.283c1.307 0 2.537-.259 3.706-.727.708.43 1.472.683 2.232.683 4.513 0 8.17-3.68 8.17-8.206 0-5.529-4.479-10.02-10.019-10.02" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {currentYear} KFT. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/terminos" className="hover:text-slate-300 hover:underline transition-colors">Términos</Link>
            <Link href="/privacidad" className="hover:text-slate-300 hover:underline transition-colors">Privacidad</Link>
            <Link href="/soporte" className="hover:text-slate-300 hover:underline transition-colors">Soporte</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
