import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Reservation from "@/models/Reservation";
import Resource from "@/models/Resource";
import { Calendar, Users, Clock, CheckCircle2, XCircle } from "lucide-react";

export default async function AdminPage() {
  // Verificar sesión y role (doble seguridad)
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  // Conectar a MongoDB y traer reservas
  await connectDB();

  const reservations = await Reservation.find()
    .populate("resourceId", "name type")
    .sort({ date: -1, startTime: -1 })
    .lean();

  // Convertir a formato serializable
  const reservationsData = reservations.map((reservation) => ({
    id: reservation._id.toString(),
    userName: reservation.userName,
    userEmail: reservation.userEmail,
    userPhone: reservation.userPhone,
    resource: reservation.resourceId
      ? {
          name: reservation.resourceId.name,
          type: reservation.resourceId.type,
        }
      : null,
    date: reservation.date.toISOString().split("T")[0],
    startTime: reservation.startTime,
    endTime: reservation.endTime,
    status: reservation.status,
    totalPrice: reservation.totalPrice,
    confirmationCode: reservation.confirmationCode,
  }));

  // Estadísticas simples
  const stats = {
    total: reservationsData.length,
    confirmed: reservationsData.filter((r) => r.status === "confirmed").length,
    pending: reservationsData.filter((r) => r.status === "pending").length,
    cancelled: reservationsData.filter((r) => r.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">Gestiona las reservas de tu sistema</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Calendar}
            label="Total Reservas"
            value={stats.total}
            color="blue"
          />
          <StatCard
            icon={CheckCircle2}
            label="Confirmadas"
            value={stats.confirmed}
            color="green"
          />
          <StatCard
            icon={Clock}
            label="Pendientes"
            value={stats.pending}
            color="yellow"
          />
          <StatCard
            icon={XCircle}
            label="Canceladas"
            value={stats.cancelled}
            color="red"
          />
        </div>

        {/* Tabla de reservas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-medium text-gray-900">
              Reservas Recientes
            </h2>
          </div>

          {reservationsData.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay reservas todavía</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cancha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reservationsData.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.userEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {reservation.resource?.name || "Cancha eliminada"}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {reservation.resource?.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(reservation.date).toLocaleDateString(
                          "es-UY",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reservation.startTime} - {reservation.endTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={reservation.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${reservation.totalPrice}
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

// Componente de estadística
function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
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
