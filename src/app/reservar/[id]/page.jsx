import ReservationCalendar from "@/components/shared/ReservationCalendar";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";

// Traer cancha directo de MongoDB
async function getCancha(id) {
  try {
    await connectDB();
    const cancha = await Resource.findById(id).lean();

    if (!cancha) return null;

    return {
      ...cancha,
      _id: cancha._id.toString(),
    };
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export default async function ReservarPage({ params }) {
  // Await params antes de usarlo
  const resolvedParams = await params;
  const cancha = await getCancha(resolvedParams.id);

  if (!cancha) {
    notFound();
  }

  return (
    <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">{cancha.name}</h1>
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
        </div>

        <ReservationCalendar cancha={cancha} />
      </div>
    </main>
  );
}
