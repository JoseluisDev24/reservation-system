import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import DeleteCanchaButton from "@/components/admin/DeleteCanchaButton";
import { Pencil, Plus, Building2, CheckCircle, XCircle } from "lucide-react";
import mongoose from "mongoose";

export default async function CanchasAdminPage() {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  await connectDB();

  const ownerObjectId = new mongoose.Types.ObjectId(session.user.id);
  const ownerString = session.user.id;

  const canchas = await Resource.find({
    $or: [{ owner: ownerObjectId }, { owner: ownerString }],
  })
    .sort({ createdAt: -1 })
    .lean();

  const canchasFormateadas = canchas.map((cancha) => ({
    ...cancha,
    _id: cancha._id.toString(),
    createdAt: cancha.createdAt.toISOString(),
    updatedAt: cancha.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 py-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Building2 className="h-10 w-10 text-green-500" />
              Gestión de Canchas
            </h1>
            <p className="text-gray-400">
              Administrá todas las canchas de tu complejo deportivo
            </p>
          </div>
          <Link
            href="/admin/canchas/nueva"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Nueva Cancha
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de canchas</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {canchasFormateadas.length}
                </p>
              </div>
              <Building2 className="h-10 w-10 text-gray-600" />
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
              <CheckCircle className="h-10 w-10 text-green-500" />
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
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
          </div>
        </div>

        {canchasFormateadas.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
            <Building2 className="h-20 w-20 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              No hay canchas todavía
            </h3>
            <p className="text-gray-400 mb-6">
              Empezá creando tu primera cancha para gestionar reservas
            </p>
            <Link
              href="/admin/canchas/nueva"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Crear Primera Cancha
            </Link>
          </div>
        ) : (
          <>
            <div className="md:hidden space-y-4">
              {canchasFormateadas.map((cancha) => (
                <div
                  key={cancha._id}
                  className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-green-500/50 transition-colors"
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={cancha.image}
                      alt={cancha.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      {cancha.available ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold shadow-lg">
                          <CheckCircle className="h-3 w-3" />
                          Activa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold shadow-lg">
                          <XCircle className="h-3 w-3" />
                          Inactiva
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {cancha.name}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                        {cancha.type}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-900/50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Capacidad</p>
                        <p className="text-lg font-bold text-white">
                          {cancha.capacity}
                        </p>
                        <p className="text-xs text-gray-500">personas</p>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Precio</p>
                        <p className="text-lg font-bold text-green-500">
                          ${cancha.pricePerHour}
                        </p>
                        <p className="text-xs text-gray-500">UYU/hora</p>
                      </div>
                    </div>

                    {cancha.amenities.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1.5">
                          {cancha.amenities.slice(0, 3).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                            >
                              {amenity}
                            </span>
                          ))}
                          {cancha.amenities.length > 3 && (
                            <span className="text-xs text-gray-400 px-2 py-1">
                              +{cancha.amenities.length - 3} más
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link
                        href={`/admin/canchas/${cancha._id}/editar`}
                        className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                      >
                        <Pencil className="h-4 w-4" />
                        Editar
                      </Link>
                      <DeleteCanchaButton
                        canchaId={cancha._id}
                        canchaName={cancha.name}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              <div className="grid grid-cols-12 gap-3 p-4 bg-gray-900 border-b border-gray-700 font-semibold text-gray-300 text-sm">
                <div className="col-span-1 text-center">Imagen</div>
                <div className="col-span-2">Nombre</div>
                <div className="col-span-2">Tipo</div>
                <div className="col-span-1 text-center">Capacidad</div>
                <div className="col-span-2 text-center">Precio/Hora</div>
                <div className="col-span-2 text-center">Estado</div>
                <div className="col-span-2 text-center">Acciones</div>
              </div>

              <div className="divide-y divide-gray-700">
                {canchasFormateadas.map((cancha) => (
                  <div
                    key={cancha._id}
                    className="grid grid-cols-12 gap-3 p-4 hover:bg-gray-750 transition-colors items-center"
                  >
                    <div className="col-span-1 flex justify-center">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-700">
                        <Image
                          src={cancha.image}
                          alt={cancha.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="col-span-2">
                      <p
                        className="font-semibold text-white text-sm truncate"
                        title={cancha.name}
                      >
                        {cancha.name}
                      </p>
                      {cancha.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {cancha.amenities.slice(0, 2).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded"
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

                    <div className="col-span-2">
                      <span className="inline-flex px-2.5 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                        {cancha.type}
                      </span>
                    </div>

                    <div className="col-span-1 text-center">
                      <p className="text-white font-semibold text-sm">
                        {cancha.capacity}
                      </p>
                      <p className="text-xs text-gray-400">pers.</p>
                    </div>

                    <div className="col-span-2 text-center">
                      <p className="text-green-500 font-bold">
                        ${cancha.pricePerHour}
                      </p>
                      <p className="text-xs text-gray-400">UYU/h</p>
                    </div>

                    <div className="col-span-2 flex justify-center">
                      {cancha.available ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-semibold">
                          <CheckCircle className="h-3 w-3" />
                          Activa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-500 rounded-full text-xs font-semibold">
                          <XCircle className="h-3 w-3" />
                          Inactiva
                        </span>
                      )}
                    </div>

                    <div className="col-span-2 flex justify-center items-center gap-1.5">
                      <Link
                        href={`/admin/canchas/${cancha._id}/editar`}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs font-medium"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                      </Link>
                      <DeleteCanchaButton
                        canchaId={cancha._id}
                        canchaName={cancha.name}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
