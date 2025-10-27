// src/components/admin/DeleteCanchaButton.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react"; // ← NUEVO

export default function DeleteCanchaButton({ canchaId, canchaName }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    try {
      const response = await fetch(`/api/canchas/${canchaId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
        setShowModal(false);
      } else {
        alert("Error al eliminar la cancha");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar la cancha");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1.5 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
      >
        <Trash2 className="h-4 w-4" />
        Eliminar
      </button>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/20 rounded-full">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Confirmar Eliminación
              </h3>
            </div>

            <p className="text-gray-300 mb-6">
              ¿Estás seguro que querés eliminar la cancha{" "}
              <span className="font-bold text-white">"{canchaName}"</span>? Esta
              acción no se puede deshacer.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold disabled:opacity-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  "Eliminando..."
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
