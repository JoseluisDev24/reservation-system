"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function MisReservasPage() {
  // Estados
  const [email, setEmail] = useState("");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  /**
   * Buscar reservas por email
   */
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Por favor ingresá tu email");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Llamar al endpoint con query param ?email=...
      const response = await fetch(
        `/api/reservations?email=${encodeURIComponent(email)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al buscar reservas");
      }

      setReservations(data.reservations || []);
      setSearched(true);
    } catch (err) {
      setError(err.message);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancelar una reserva
   */
  const handleCancelReservation = async (reservationId) => {
    if (!confirm("¿Estás seguro de que querés cancelar esta reserva?")) {
      return;
    }

    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al cancelar la reserva");
      }

      // Actualizar la lista: cambiar el status localmente
      setReservations(
        reservations.map((r) =>
          r._id === reservationId ? { ...r, status: "cancelled" } : r
        )
      );

      alert("✅ Reserva cancelada exitosamente");
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    }
  };

  /**
   * Obtener color del badge según status
   */
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  /**
   * Traducir status al español
   */
  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Confirmada";
      case "pending":
        return "Pendiente";
      case "cancelled":
        return "Cancelada";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
          <p className="text-gray-600 mt-2">
            Consultá el estado de tus reservas y cancelá si es necesario
          </p>
        </div>

        {/* Formulario de búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email con el que reservaste
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@ejemplo.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Buscando..." : "Buscar mis reservas"}
            </button>
          </form>
        </div>

        {/* Lista de reservas */}
        {searched && (
          <div>
            {reservations.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">
                  No se encontraron reservas con ese email
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-700 font-medium mb-4">
                  {reservations.length} reserva
                  {reservations.length !== 1 ? "s" : ""} encontrada
                  {reservations.length !== 1 ? "s" : ""}
                </p>

                {reservations.map((reservation) => (
                  <div
                    key={reservation._id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Información de la reserva */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {reservation.resourceId?.name || "Cancha"}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              reservation.status
                            )}`}
                          >
                            {getStatusText(reservation.status)}
                          </span>
                        </div>

                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <strong>Código:</strong>{" "}
                            {reservation.confirmationCode}
                          </p>
                          <p>
                            <strong>Fecha:</strong>{" "}
                            {format(
                              new Date(reservation.startDateTime),
                              "PPP",
                              { locale: es }
                            )}
                          </p>
                          <p>
                            <strong>Horario:</strong>{" "}
                            {format(
                              new Date(reservation.startDateTime),
                              "HH:mm"
                            )}{" "}
                            -{" "}
                            {format(new Date(reservation.endDateTime), "HH:mm")}
                          </p>
                          <p>
                            <strong>Precio:</strong> ${reservation.totalPrice}
                          </p>
                        </div>
                      </div>

                      {/* Botón de cancelar (solo si no está cancelada) */}
                      {reservation.status !== "cancelled" && (
                        <button
                          onClick={() =>
                            handleCancelReservation(reservation._id)
                          }
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                          Cancelar reserva
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
