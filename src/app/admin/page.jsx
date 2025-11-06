import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Reservation from "@/models/Reservation";
import Resource from "@/models/Resource";
import { Building2, DollarSign, TrendingUp, Calendar } from "lucide-react";
import ReservationsChart from "@/components/admin/ReservationsChart";

export default async function AdminPage() {
  // ========================================
  // 1. AUTENTICACIÓN Y AUTORIZACIÓN
  // ========================================
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  await connectDB();

  // ========================================
  // 2. OBTENER CANCHAS DEL ADMIN (MULTI-TENANT)
  // ========================================
  // Solo traemos las canchas que pertenecen a este admin
  const misCanchas = await Resource.find({
    owner: session.user.id,
  })
    .select("_id name pricePerHour")
    .lean();

  // IDs de mis canchas para filtrar reservas
  const misCanchasIds = misCanchas.map((c) => c._id);

  // ========================================
  // 3. OBTENER RESERVAS DE MIS CANCHAS
  // ========================================
  // Solo traemos reservas de canchas que me pertenecen
  const reservations = await Reservation.find({
    resourceId: { $in: misCanchasIds },
  })
    .populate("resourceId", "name type")
    .sort({ date: -1, startTime: -1 })
    .lean();

  // ========================================
  // 4. CALCULAR ESTADÍSTICAS
  // ========================================

  // 4.1 Total de canchas del admin
  const totalCanchas = misCanchas.length;

  // 4.2 Reservas confirmadas (activas)
  const reservasActivas = reservations.filter(
    (r) => r.status === "confirmed"
  ).length;

  // 4.3 Ingresos del mes actual
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

  // 4.4 Tasa de ocupación (simplificada)
  // Fórmula: (Reservas hoy / Total canchas) * 100
  const reservasHoy = reservations.filter((r) => {
    const fechaReserva = new Date(r.date);
    return (
      r.status === "confirmed" &&
      fechaReserva.toDateString() === hoy.toDateString()
    );
  }).length;

  const tasaOcupacion =
    totalCanchas > 0 ? Math.round((reservasHoy / totalCanchas) * 100) : 0;

  // ========================================
  // 5. AGRUPAR RESERVAS POR DÍA (ÚLTIMOS 7 DÍAS)
  // ========================================
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

  // ========================================
  // 6. PRÓXIMAS 5 RESERVAS
  // ========================================
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

  // ========================================
  // 7. RENDERIZAR UI
  // ========================================
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Bienvenido, {session.user.name}</p>
        </div>

        {/* Stats Cards */}
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

        {/* Gráfico de Reservas - Próximo paso */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Reservas de los últimos 7 días
          </h2>
          <ReservationsChart data={reservasPorDia} />
        </div>

        {/* Próximas Reservas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-medium text-gray-900">
              Próximas Reservas
            </h2>
          </div>

          {proximasReservas.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay reservas próximas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cancha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Horario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Precio
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {proximasReservas.map((reserva) => (
                    <tr
                      key={reserva.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {reserva.userName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {reserva.resource}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {reserva.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {reserva.time}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
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

// ========================================
// COMPONENTE: StatCard
// ========================================
function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
