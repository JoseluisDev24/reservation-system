// src/components/reservations/ReservationCalendar/components/SelectedSlotBanner.jsx
import { format } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Banner azul que muestra el horario seleccionado
 * Aparece cuando el usuario selecciona un slot
 */
export default function SelectedSlotBanner({
  selectedSlot,
  onCancel,
  onConfirm,
}) {
  if (!selectedSlot) return null;

  return (
    <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-400 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Información del slot */}
        <div>
          <p className="font-semibold text-blue-900">
            Horario seleccionado:{" "}
            {format(selectedSlot.start, "PPP", { locale: es })}
          </p>
          <p className="text-sm text-blue-700 mt-1">
            {format(selectedSlot.start, "HH:mm", { locale: es })} -{" "}
            {format(selectedSlot.end, "HH:mm", { locale: es })}
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
