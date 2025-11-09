import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Reservation from "@/models/Reservation";
import Resource from "@/models/Resource";
import { Building2, DollarSign, TrendingUp, Calendar } from "lucide-react";
import ReservationsChart from "@/components/admin/ReservationsChart";

export default async function AdminPage() {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  await connectDB();

  const misCanchas = await Resource.find({
    owner: session.user.id,
  })
    .select("_id name pricePerHour")
    .lean();

  const misCanchasIds = misCanchas.map((c) => c._id);

  const reservations = await Reservation.find({
    resourceId: { $in: misCanchasIds },
  })
    .populate("resourceId", "name type")
    .sort({ date: -1, startTime: -1 })
    .lean();

  const totalCanchas = misCanchas.length;

  const reservasActivas = reservations.filter(
    (r) => r.status === "confirmed"
  ).length;

  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

  const ingresosMes = reservations
    .filter((r) => {
      const fechaReserva = new Date(r.date);
      return (
        r.status === "confirmed" &&
        fechaReserva >= inicioMes &&
        fechaReserva <= finMes
      );
    })
    .reduce((sum, r) => sum + (r.totalPrice || 0), 0);

  const reservasHoy = reservations.filter((r) => {
    const fechaReserva = new Date(r.date);
    return (
      r.status === "confirmed" &&
      fechaReserva.toDateString() === hoy.toDateString()
    );
  }).length;

  const tasaOcupacion =
    totalCanchas > 0 ? Math.round((reservasHoy / totalCanchas) * 100) : 0;

  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    last7Days.push(date);
  }

  const reservasPorDia = last7Days.map((date) => {
    const count = reservations.filter((r) => {
      const reservationDate = new Date(r.date);
      reservationDate.setHours(0, 0, 0, 0);
      return (
        r.status === "confirmed" && reservationDate.getTime() === date.getTime()
      );
    }).length;

    return {
      day: date.toLocaleDateString("es-UY", {
        weekday: "short",
        day: "numeric",
      }),
      count,
    };
  });

  const proximasReservas = reservations
    .filter((r) => {
      const fechaReserva = new Date(r.date);
      return r.status === "confirmed" && fechaReserva >= hoy;
    })
    .slice(0, 5)
    .map((r) => ({
      id: r._id.toString(),
      userName: r.userName || "Sin nombre",
      resource: r.resourceId?.name || "Cancha eliminada",
      date: r.date.toLocaleDateString("es-UY", {
        day: "2-digit",
        month: "short",
      }),
      time: `${r.startTime} - ${r.endTime}`,
      price: r.totalPrice,
    }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 py-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <TrendingUp className="h-10 w-10 text-green-500" />
            Dashboard
          </h1>
          <p className="text-gray-400">Bienvenido, {session.user.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Building2}
            label="Mis Canchas"
            value={totalCanchas}
            color="blue"
          />
          <StatCard
            icon={Calendar}
            label="Reservas Activas"
            value={reservasActivas}
            color="green"
          />
          <StatCard
            icon={DollarSign}
            label="Ingresos del Mes"
            value={`$${ingresosMes.toLocaleString()}`}
            color="purple"
          />
          <StatCard
            icon={TrendingUp}
            label="Ocupación Hoy"
            value={`${tasaOcupacion}%`}
            color="orange"
          />
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Reservas de los últimos 7 días
          </h2>
          <ReservationsChart data={reservasPorDia} />
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">
              Próximas Reservas
            </h2>
          </div>

          {proximasReservas.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No hay reservas próximas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Cancha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Horario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Precio
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {proximasReservas.map((reserva) => (
                    <tr
                      key={reserva.id}
                      className="hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-white">
                        {reserva.userName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {reserva.resource}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {reserva.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {reserva.time}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-500">
                        ${reserva.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    green: "bg-green-500/20 text-green-400 border-green-500/30",
    purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-green-500/50 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-lg border ${colors[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
