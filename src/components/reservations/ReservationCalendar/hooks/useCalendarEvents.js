import { useMemo } from "react";

/**
 * @param {Array} reservas
 * @param {Object} selectedSlot
 * @returns {Array}
 */
export function useCalendarEvents(reservas, selectedSlot) {
  const events = useMemo(() => {
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
