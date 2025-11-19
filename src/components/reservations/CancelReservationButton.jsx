"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

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
    const loadingToast = toast.loading("Cancelando reserva...");

    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });

      const result = await response.json();

      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success("Reserva cancelada exitosamente");
        router.refresh();
      } else {
        toast.error(result.error || "Error al cancelar la reserva");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error al cancelar reserva:", error);
      toast.error("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isLoading}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
        isLoading
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md active:scale-95"
      }`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Cancelando...</span>
        </>
      ) : (
        <>
          <X className="h-4 w-4" />
          <span>Cancelar Reserva</span>
        </>
      )}
    </button>
  );
}
