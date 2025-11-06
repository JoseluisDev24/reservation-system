import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Reservation from "@/models/Reservation";
import Resource from "@/models/Resource"; // ⭐ AGREGADO
import { Calendar, Clock, MapPin, DollarSign } from "lucide-react";

export default async function MisReservasPage() {
  // ========================================
  // 1. VERIFICAR AUTENTICACIÓN
  // ========================================
  const session = await auth();

  // Si no está logueado, redirigir a login
  if (!session) {
    redirect("/api/auth/signin");
  }

  // ========================================
  // 2. BUSCAR RESERVAS DEL USUARIO
  // ========================================
  await connectDB();

  const reservations = await Reservation.find({
    userId: session.user.id, // ⭐ Filtrar por el usuario logueado
  })
    .populate("resourceId", "name type image")
    .sort({ date: -1 })
    .lean();

  // Serializar para Next.js
  const reservationsData = reservations.map((r) => ({
    id: r._id.toString(),
    resource: r.resourceId
      ? {
          name: r.resourceId.name,
          type: r.resourceId.type,
          image: r.resourceId.image,
        }
      : { name: "Cancha eliminada", type: "", image: "" },
    date: r.date.toLocaleDateString("es-UY", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    startTime: r.startTime,
    endTime: r.endTime,
    status: r.status,
    totalPrice: r.totalPrice,
    confirmationCode: r.confirmationCode,
  }));

  // ========================================
  // 3. RENDERIZAR
  // ========================================
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Mis Reservas
          </h1>
          <p className="text-gray-600">
            Hola, {session.user.name}! Aquí están tus reservas.
          </p>
        </div>

        {/* Lista de Reservas */}
        {reservationsData.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tenés reservas todavía
            </h3>
            <p className="text-gray-500 mb-6">
              Reservá una cancha para empezar a jugar
            </p>
            <Link
              href="/canchas"
              className="inline-block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Ver Canchas Disponibles
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reservationsData.map((reserva) => (
              <div
                key={reserva.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  {/* Info de la reserva */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {reserva.resource.name}
                      </h3>
                      <StatusBadge status={reserva.status} />
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{reserva.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {reserva.startTime} - {reserva.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium text-gray-900">
                          ${reserva.totalPrice}
                        </span>
                      </div>
                      {reserva.confirmationCode && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {reserva.confirmationCode}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Imagen de la cancha */}
                  {reserva.resource.image && (
                    <img
                      src={reserva.resource.image}
                      alt={reserva.resource.name}
                      className="w-24 h-24 rounded-lg object-cover ml-4"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Badge de estado
function StatusBadge({ status }) {
  const styles = {
    confirmed: "bg-green-50 text-green-700 ring-green-600/20",
    pending: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
    cancelled: "bg-red-50 text-red-700 ring-red-600/20",
  };

  const labels = {
    confirmed: "Confirmada",
    pending: "Pendiente",
    cancelled: "Cancelada",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
