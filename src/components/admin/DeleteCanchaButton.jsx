"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function DeleteCanchaButton({ canchaId, canchaName }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `¿Estás seguro que querés eliminar "${canchaName}"?\n\nEsta acción no se puede deshacer y se perderán todas las reservas asociadas.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    const loadingToast = toast.loading("Eliminando cancha...");

    try {
      const response = await fetch(`/api/canchas/${canchaId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success("Cancha eliminada exitosamente");
        router.refresh();
      } else {
        toast.error(result.error || "Error al eliminar la cancha");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error al eliminar cancha:", error);
      toast.error("Error de conexión al eliminar la cancha");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold min-w-[100px]"
    >
      {isDeleting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="hidden sm:inline">Eliminando...</span>
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Eliminar</span>
        </>
      )}
    </button>
  );
}
