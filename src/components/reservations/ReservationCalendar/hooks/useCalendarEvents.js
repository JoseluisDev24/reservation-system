// src/components/reservations/ReservationCalendar/hooks/useCalendarEvents.js
import { useMemo } from "react";

/**
 * Hook para convertir reservas de MongoDB al formato de react-big-calendar
 * @param {Array} reservas - Array de reservas desde el backend
 * @param {Object} selectedSlot - Slot seleccionado por el usuario (puede ser null)
 * @returns {Array} - Array de eventos formateados para el calendario
 */
export function useCalendarEvents(reservas, selectedSlot) {
  const events = useMemo(() => {
    // Convertir reservas existentes a formato de eventos
    const reservaEvents = reservas.map((reserva) => ({
      title: `${reserva.userName || "Reservado"}`,
      start: new Date(reserva.startDateTime),
      end: new Date(reserva.endDateTime),
      resource: {
        status: reserva.status,
        email: reserva.userEmail,
        phone: reserva.userPhone,
      },
    }));

    // Si hay un slot seleccionado, agregarlo como evento temporal
    if (selectedSlot) {
      reservaEvents.push({
        title: "✓ Horario seleccionado",
        start: selectedSlot.start,
        end: selectedSlot.end,
        resource: {
          status: "selected",
          isSelected: true,
        },
      });
    }

    return reservaEvents;
  }, [reservas, selectedSlot]);

  return events;
}
