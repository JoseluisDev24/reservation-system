"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelReservationButton({ reservationId }) {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "¿Estás seguro que querés cancelar esta reserva?\n\n" +
        "Esta acción no se puede deshacer."
    );

    if (!confirmed) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
        }),
      });

      if (response.ok) {
        router.refresh();
        alert("✅ Reserva cancelada exitosamente");
      } else {
        const data = await response.json();
        alert(`❌ Error: ${data.error || "No se pudo cancelar la reserva"}`);
      }
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
      alert("❌ Error de conexión. Intentá de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isLoading}
      className={`
        px-4 py-2 rounded-lg font-medium transition-colors
        ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700 text-white"
        }
      `}
    >
      {isLoading ? "Cancelando..." : "Cancelar Reserva"}
    </button>
  );
}
