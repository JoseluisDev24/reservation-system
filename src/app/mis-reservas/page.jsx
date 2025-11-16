import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Reservation from "@/models/Reservation";
import Image from "next/image";
import { Calendar, Clock, MapPin, DollarSign, Ticket } from "lucide-react";
import CancelReservationButton from "@/components/reservations/CancelReservationButton";

export default async function MisReservasPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  await connectDB();

  const reservations = await Reservation.find({
    userId: session.user.id,
  })
    .populate("resourceId", "name type image")
    .sort({ date: -1 })
    .lean();

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

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Mis Reservas
          </h1>
          <p className="text-gray-600">
            Hola, {session.user.name}! Aquí están tus reservas.
          </p>
        </div>

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
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
              >
                {/* Header con imagen y nombre */}
                <div className="flex items-start gap-4 p-4 sm:p-6">
                  {/* Imagen - más pequeña y redondeada */}
                  {reserva.resource.image && (
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 border-gray-100">
                      <Image
                        src={reserva.resource.image}
                        alt={reserva.resource.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Info principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                        {reserva.resource.name}
                      </h3>
                      <StatusBadge status={reserva.status} />
                    </div>

                    {/* Detalles de la reserva */}
                    <div className="space-y-1.5 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{reserva.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>
                          {reserva.startTime} - {reserva.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="font-semibold text-green-600">
                          ${reserva.totalPrice}
                        </span>
                      </div>
                      {reserva.confirmationCode && (
                        <div className="flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {reserva.confirmationCode}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer con botón de cancelar */}
                {reserva.status === "confirmed" && (
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <span className="text-sm text-gray-600">
                        ¿Cambió tus planes?
                      </span>
                      <CancelReservationButton reservationId={reserva.id} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

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
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${styles[status]} flex-shrink-0`}
    >
      {labels[status]}
    </span>
  );
}
