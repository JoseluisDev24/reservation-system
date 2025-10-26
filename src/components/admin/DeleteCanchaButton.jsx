// src/components/admin/DeleteCanchaButton.jsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Botón para eliminar una cancha
 * Client Component porque necesita:
 * - Estado (para mostrar modal de confirmación)
 * - Eventos (onClick)
 * - Router (para refrescar después de eliminar)
 */
export default function DeleteCanchaButton({ canchaId, canchaName }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /**
   * Maneja la eliminación de la cancha
   * 1. Pide confirmación
   * 2. Llama a la API DELETE
   * 3. Refresca la página para ver los cambios
   */
  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch(`/api/canchas/${canchaId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        alert("✅ Cancha eliminada exitosamente");
        setShowConfirm(false);
        router.refresh(); // Refresca la lista de canchas
      } else {
        alert("❌ Error: " + result.error);
      }
    } catch (error) {
      console.error("Error eliminando cancha:", error);
      alert("❌ Error al eliminar la cancha");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* BOTÓN ELIMINAR */}
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        🗑️ Eliminar
      </button>

      {/* MODAL DE CONFIRMACIÓN */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">
              ⚠️ Confirmar Eliminación
            </h3>
            <p className="text-gray-300 mb-2">
              ¿Estás seguro que querés eliminar esta cancha?
            </p>
            <p className="text-white font-semibold mb-4">"{canchaName}"</p>
            <p className="text-sm text-gray-400 mb-6">
              Esta acción no se puede deshacer. Se eliminará la cancha y su
              imagen.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Eliminando...
                  </>
                ) : (
                  "Sí, Eliminar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
