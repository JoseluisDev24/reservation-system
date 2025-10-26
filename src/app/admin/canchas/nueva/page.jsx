// src/app/admin/canchas/nueva/page.js

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CanchaForm from "@/components/admin/CanchaForm";
import Link from "next/link";

/**
 * Página para crear una nueva cancha
 *
 * Server Component que:
 * 1. Verifica que el usuario sea admin
 * 2. Renderiza el formulario en modo "create"
 */
export default async function NuevaCanchaPage() {
  // Verificar autenticación
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* BREADCRUMB (Migas de pan) */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link
            href="/admin"
            className="hover:text-green-500 transition-colors"
          >
            Admin
          </Link>
          <span>/</span>
          <Link
            href="/admin/canchas"
            className="hover:text-green-500 transition-colors"
          >
            Canchas
          </Link>
          <span>/</span>
          <span className="text-white">Nueva</span>
        </div>

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            ➕ Crear Nueva Cancha
          </h1>
          <p className="text-gray-400">
            Completá los datos para agregar una nueva cancha al sistema
          </p>
        </div>

        {/* CARD CON EL FORMULARIO */}
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <CanchaForm mode="create" />
        </div>

        {/* AYUDA */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="text-blue-400 font-semibold mb-1">Consejo</h3>
              <p className="text-sm text-gray-300">
                Asegurate de usar imágenes de buena calidad (mínimo 800x600px)
                para que se vean bien en el catálogo. El sistema las optimizará
                automáticamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
