import ReservationCalendar from "@/components/reservations/ReservationCalendar";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import Reservation from "@/models/Reservation";

async function getCancha(id) {
  try {
    await connectDB();
    const cancha = await Resource.findById(id).lean();

    if (!cancha) return null;

    return {
      ...cancha,
      _id: cancha._id.toString(),
      createdAt: cancha.createdAt?.toISOString(),
      updatedAt: cancha.updatedAt?.toISOString(),
      schedule: cancha.schedule
        ? {
            openTime: cancha.schedule.openTime || "08:00",
            closeTime: cancha.schedule.closeTime || "23:00",
            slotDuration: cancha.schedule.slotDuration || 60,
            availableDays: cancha.schedule.availableDays || [
              0, 1, 2, 3, 4, 5, 6,
            ],
            blockedSlots: (cancha.schedule.blockedSlots || []).map((slot) => ({
              day: slot.day,
              time: slot.time,
            })),
          }
        : {
            openTime: "08:00",
            closeTime: "23:00",
            slotDuration: 60,
            availableDays: [0, 1, 2, 3, 4, 5, 6],
            blockedSlots: [],
          },
    };
  } catch (error) {
    console.error("Error al traer cancha:", error);
    return null;
  }
}

async function getReservas(canchaId) {
  try {
    await connectDB();
    const reservas = await Reservation.find({
      resourceId: canchaId,
      status: { $ne: "cancelled" },
    })
      .lean()
      .sort({ date: 1, startTime: 1 });

    return reservas.map((reserva) => {
      const [startHour, startMin] = reserva.startTime.split(":");
      const [endHour, endMin] = reserva.endTime.split(":");

      const startDate = new Date(reserva.date);
      startDate.setHours(parseInt(startHour), parseInt(startMin), 0, 0);

      const endDate = new Date(reserva.date);
      endDate.setHours(parseInt(endHour), parseInt(endMin), 0, 0);

      return {
        ...reserva,
        _id: reserva._id.toString(),
        resourceId: reserva.resourceId.toString(),
        date: reserva.date.toISOString(),
        startDateTime: startDate.toISOString(),
        endDateTime: endDate.toISOString(),
      };
    });
  } catch (error) {
    console.error("Error al traer reservas:", error);
    return [];
  }
}

export default async function ReservarPage({ params }) {
  const { id } = await params;

  const [cancha, reservas] = await Promise.all([
    getCancha(id),
    getReservas(id),
  ]);

  if (!cancha) {
    notFound();
  }

  return (
    <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">{cancha.name}</h1>
          <p className="text-gray-600 mb-6">{cancha.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
            <div>
              <span className="font-semibold">Tipo:</span> {cancha.type}
            </div>
            <div>
              <span className="font-semibold">Capacidad:</span>{" "}
              {cancha.capacity} personas
            </div>
            <div>
              <span className="font-semibold">Precio:</span> $
              {cancha.pricePerHour}/hora
            </div>
          </div>

          {cancha.amenities && cancha.amenities.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Comodidades
              </h3>
              <div className="flex flex-wrap gap-2">
                {cancha.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <ReservationCalendar cancha={cancha} reservas={reservas} />
      </div>
    </main>
  );
}
