// src/app/admin/canchas/[id]/editar/page.js

import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import CanchaForm from "@/components/admin/CanchaForm";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { Pencil, AlertTriangle } from "lucide-react"; 

/**
 * Página para editar una cancha existente
 *
 * Server Component que:
 * 1. Verifica que el usuario sea admin
 * 2. Busca la cancha por ID
 * 3. Renderiza el formulario en modo "edit" con los datos pre-cargados
 */
export default async function EditarCanchaPage({ params }) {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  const { id } = await params;

  await connectDB();
  const cancha = await Resource.findById(id).lean();

  if (!cancha) {
    notFound();
  }

  // Formatear datos para el formulario
  const canchaData = {
    name: cancha.name,
    type: cancha.type,
    capacity: cancha.capacity,
    pricePerHour: cancha.pricePerHour,
    description: cancha.description || "",
    amenities: cancha.amenities || [],
    available: cancha.available,
    image: cancha.image,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
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
          <span className="text-white">Editar</span>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <Pencil className="h-10 w-10 text-green-500 inline-block mr-2" />
            Editar Cancha
          </h1>
          <p className="text-gray-400">
            Modificá los datos de:{" "}
            <span className="text-white font-semibold">{cancha.name}</span>
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <CanchaForm mode="edit" initialData={canchaData} canchaId={id} />
        </div>

        <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex gap-3 items-start">
            <AlertTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-yellow-400 font-semibold mb-1">Importante</h3>
              <p className="text-sm text-gray-300">
                Si no seleccionás una nueva imagen, se mantendrá la imagen
                actual. Solo subí una nueva imagen si querés cambiarla.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
