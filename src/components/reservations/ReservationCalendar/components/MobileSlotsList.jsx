import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function MobileSlotsList({
  availableSlots,
  selectedSlot,
  onSelectSlot,
}) {
  const [expandedDays, setExpandedDays] = useState([]);

  // Agrupar slots por día
  const groupSlotsByDay = () => {
    const grouped = {};

    availableSlots.forEach((slot) => {
      const dayKey = format(slot.start, "yyyy-MM-dd");
      if (!grouped[dayKey]) {
        grouped[dayKey] = {
          date: slot.start,
          slots: [],
        };
      }
      grouped[dayKey].slots.push(slot);
    });

    return Object.values(grouped);
  };

  const groupedDays = groupSlotsByDay();

  // Toggle día expandido/colapsado
  const toggleDay = (dayKey) => {
    setExpandedDays((prev) =>
      prev.includes(dayKey)
        ? prev.filter((d) => d !== dayKey)
        : [...prev, dayKey]
    );
  };

  // Auto-expandir el primer día
  useState(() => {
    if (groupedDays.length > 0) {
      const firstDayKey = format(groupedDays[0].date, "yyyy-MM-dd");
      setExpandedDays([firstDayKey]);
    }
  }, []);

  return (
    <div className="space-y-2">
      {/* Header con total de horarios */}
      <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
        <span className="text-sm font-medium text-blue-900">
          {availableSlots.length} horarios disponibles en {groupedDays.length}{" "}
          {groupedDays.length === 1 ? "día" : "días"}
        </span>
      </div>

      {/* Acordeón de días */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {groupedDays.map((day) => {
          const dayKey = format(day.date, "yyyy-MM-dd");
          const isExpanded = expandedDays.includes(dayKey);
          const hasSelectedSlot = day.slots.some(
            (slot) =>
              selectedSlot &&
              selectedSlot.start.getTime() === slot.start.getTime()
          );

          return (
            <div
              key={dayKey}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              {/* Header del día - clickeable */}
              <button
                onClick={() => toggleDay(dayKey)}
                className={`w-full flex items-center justify-between p-4 transition-colors ${
                  isExpanded
                    ? "bg-blue-50 border-b border-gray-200"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  )}
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">
                      {format(day.date, "EEEE d 'de' MMMM", {
                        locale: es,
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {day.slots.length}{" "}
                      {day.slots.length === 1 ? "horario" : "horarios"}
                    </p>
                  </div>
                </div>
                {hasSelectedSlot && (
                  <div className="text-blue-600 text-xl">✓</div>
                )}
              </button>

              {/* Slots del día - desplegable */}
              {isExpanded && (
                <div className="p-2 space-y-2 bg-gray-50">
                  {day.slots.map((slot, idx) => {
                    const isSelected =
                      selectedSlot &&
                      selectedSlot.start.getTime() === slot.start.getTime();

                    return (
                      <button
                        key={idx}
                        onClick={() => onSelectSlot(slot)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {format(slot.start, "HH:mm", { locale: es })} -{" "}
                              {format(slot.end, "HH:mm", { locale: es })}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {Math.round(
                                (slot.end - slot.start) / (1000 * 60)
                              )}{" "}
                              minutos
                            </p>
                          </div>
                          {isSelected && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-blue-600">
                                Seleccionado
                              </span>
                              <div className="text-blue-600 text-2xl">✓</div>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
