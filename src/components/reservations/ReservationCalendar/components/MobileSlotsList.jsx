// src/components/reservations/ReservationCalendar/components/MobileSlotsList.jsx
import { format } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Lista de horarios disponibles para vista mobile
 * Muestra botones en lugar del calendario completo
 */
export default function MobileSlotsList({
  availableSlots,
  selectedSlot,
  onSelectSlot,
}) {
  return (
    <div className="space-y-4">
      {/* Contador de slots disponibles */}
      <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
        <span className="text-sm font-medium text-blue-900">
          {availableSlots.length} horarios disponibles
        </span>
      </div>

      {/* Lista scrolleable de slots */}
      <div className="max-h-[500px] overflow-y-auto space-y-2">
        {availableSlots.slice(0, 20).map((slot, idx) => {
          const isSelected =
            selectedSlot &&
            selectedSlot.start.getTime() === slot.start.getTime();

          return (
            <button
              key={idx}
              onClick={() => onSelectSlot(slot)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-blue-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {format(slot.start, "EEEE d 'de' MMMM", {
                      locale: es,
                    })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {format(slot.start, "HH:mm", { locale: es })} -{" "}
                    {format(slot.end, "HH:mm", { locale: es })}
                  </p>
                </div>
                {isSelected && <div className="text-blue-600 text-2xl">✓</div>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
