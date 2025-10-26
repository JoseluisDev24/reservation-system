// src/app/admin/canchas/page.js

import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth"; // ← CAMBIO AQUÍ
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import DeleteCanchaButton from "@/components/admin/DeleteCanchaButton";

export default async function CanchasAdminPage() {
  // 1. VERIFICAR QUE EL USUARIO SEA ADMIN
  const session = await auth(); // ← CAMBIO AQUÍ (antes era getServerSession)

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  // 2. OBTENER TODAS LAS CANCHAS DE LA BASE DE DATOS
  await connectDB();
  const canchas = await Resource.find({}).sort({ createdAt: -1 }).lean();

  // 3. CONVERTIR _id DE MONGODB A STRING
  const canchasFormateadas = canchas.map((cancha) => ({
    ...cancha,
    _id: cancha._id.toString(),
    createdAt: cancha.createdAt.toISOString(),
    updatedAt: cancha.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              🏟️ Gestión de Canchas
            </h1>
            <p className="text-gray-400">
              Administrá todas las canchas de tu complejo deportivo
            </p>
          </div>
          <Link
            href="/admin/canchas/nueva"
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
          >
            <span className="mr-2">➕</span>
            Nueva Cancha
          </Link>
        </div>

        {/* ESTADÍSTICAS RÁPIDAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de canchas</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {canchasFormateadas.length}
                </p>
              </div>
              <div className="text-4xl">🏟️</div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Disponibles</p>
                <p className="text-3xl font-bold text-green-500 mt-1">
                  {canchasFormateadas.filter((c) => c.available).length}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">No disponibles</p>
                <p className="text-3xl font-bold text-red-500 mt-1">
                  {canchasFormateadas.filter((c) => !c.available).length}
                </p>
              </div>
              <div className="text-4xl">❌</div>
            </div>
          </div>
        </div>

        {/* TABLA DE CANCHAS */}
        {canchasFormateadas.length === 0 ? (
          // SI NO HAY CANCHAS
          <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
            <div className="text-6xl mb-4">🏟️</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No hay canchas todavía
            </h3>
            <p className="text-gray-400 mb-6">
              Empezá creando tu primera cancha para gestionar reservas
            </p>
            <Link
              href="/admin/canchas/nueva"
              className="inline-flex items-center px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
            >
              <span className="mr-2">➕</span>
              Crear Primera Cancha
            </Link>
          </div>
        ) : (
          // SI HAY CANCHAS
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            {/* HEADER DE LA TABLA - Solo en desktop */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-gray-900 border-b border-gray-700 font-semibold text-gray-300">
              <div className="col-span-1 text-center">Imagen</div>
              <div className="col-span-3">Nombre</div>
              <div className="col-span-2">Tipo</div>
              <div className="col-span-1 text-center">Capacidad</div>
              <div className="col-span-2 text-center">Precio/Hora</div>
              <div className="col-span-1 text-center">Estado</div>
              <div className="col-span-2 text-center">Acciones</div>
            </div>

            {/* FILAS DE LA TABLA */}
            <div className="divide-y divide-gray-700">
              {canchasFormateadas.map((cancha) => (
                <div
                  key={cancha._id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 hover:bg-gray-750 transition-colors"
                >
                  {/* IMAGEN */}
                  <div className="col-span-1 flex justify-center items-center">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-700">
                      <Image
                        src={cancha.image}
                        alt={cancha.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* NOMBRE */}
                  <div className="col-span-3 flex flex-col justify-center">
                    <p className="font-semibold text-white">{cancha.name}</p>
                    {cancha.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {cancha.amenities.slice(0, 2).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                        {cancha.amenities.length > 2 && (
                          <span className="text-xs text-gray-400">
                            +{cancha.amenities.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* TIPO */}
                  <div className="col-span-2 flex items-center">
                    <span className="inline-flex items-center px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                      {cancha.type}
                    </span>
                  </div>

                  {/* CAPACIDAD */}
                  <div className="col-span-1 flex flex-col justify-center items-center">
                    <p className="text-white font-semibold">
                      {cancha.capacity}
                    </p>
                    <p className="text-xs text-gray-400">personas</p>
                  </div>

                  {/* PRECIO */}
                  <div className="col-span-2 flex flex-col justify-center items-center">
                    <p className="text-green-500 font-bold text-lg">
                      ${cancha.pricePerHour}
                    </p>
                    <p className="text-xs text-gray-400">UYU/hora</p>
                  </div>

                  {/* ESTADO */}
                  <div className="col-span-1 flex justify-center items-center">
                    {cancha.available ? (
                      <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-semibold">
                        ✓ Activa
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-sm font-semibold">
                        ✕ Inactiva
                      </span>
                    )}
                  </div>

                  {/* ACCIONES */}
                  <div className="col-span-2 flex justify-center items-center gap-2">
                    {/* Botón EDITAR */}
                    <Link
                      href={`/admin/canchas/${cancha._id}/editar`}
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                    >
                      ✏️ Editar
                    </Link>

                    {/* Botón ELIMINAR (Client Component) */}
                    <DeleteCanchaButton
                      canchaId={cancha._id}
                      canchaName={cancha.name}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
