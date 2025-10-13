// src/components/reservations/ReservationCalendar/hooks/useAvailableSlots.js
import { useMemo } from "react";

/**
 * Hook para generar slots disponibles (usado principalmente en vista mobile)
 * @param {Array} reservas - Array de reservas existentes
 * @param {Function} isSlotValid - Función de validación del hook useSlotValidation
 * @returns {Array} - Array de slots disponibles con { start: Date, end: Date }
 */
export function useAvailableSlots(reservas, isSlotValid) {
  const availableSlots = useMemo(() => {
    const slots = [];
    const today = new Date();

    // Generar slots para los próximos 7 días
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() + day);
      date.setHours(0, 0, 0, 0);

      // Horarios de 8 AM a 11 PM (15 horas)
      for (let hour = 8; hour < 23; hour++) {
        const start = new Date(date);
        start.setHours(hour, 0, 0, 0);

        const end = new Date(date);
        end.setHours(hour + 1, 0, 0, 0);

        // Solo agregar si el slot es válido (disponible y futuro)
        if (isSlotValid(start, end)) {
          slots.push({ start, end });
        }
      }
    }

    return slots;
  }, [reservas, isSlotValid]);

  return availableSlots;
}
