import { useMemo } from "react";

/**
 * @param {Array} reservas 
 * @param {Object} selectedSlot 
 * @param {Object} cancha 
 * @returns {Array} 
 */
export function useCalendarEvents(reservas, selectedSlot, cancha = null) {
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

    if (cancha?.schedule?.availableDays) {
      const availableDays = cancha.schedule.availableDays;
      const today = new Date();

      for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dayOfWeek = date.getDay();

        if (!availableDays.includes(dayOfWeek)) {
          const start = new Date(date);
          start.setHours(0, 0, 0, 0);
          const end = new Date(date);
          end.setHours(23, 59, 59, 999);

          reservaEvents.push({
            title: "❌ Día no disponible",
            start,
            end,
            resource: {
              status: "blocked",
              isBlocked: true,
            },
          });
        }
      }
    }

    if (
      cancha?.schedule?.blockedSlots &&
      cancha.schedule.blockedSlots.length > 0
    ) {
      const today = new Date();
      const blockedSlots = cancha.schedule.blockedSlots;

      for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dayOfWeek = date.getDay();

        const slotsForDay = blockedSlots.filter(
          (slot) => slot.day === dayOfWeek
        );

        slotsForDay.forEach((slot) => {
          const [hour, minute] = slot.time.split(":").map(Number);

          const start = new Date(date);
          start.setHours(hour, minute, 0, 0);

          const end = new Date(date);
          end.setHours(hour + 1, minute, 0, 0); 

          reservaEvents.push({
            title: "🚫 Horario bloqueado",
            start,
            end,
            resource: {
              status: "blocked-slot",
              isBlockedSlot: true,
            },
          });
        });
      }
    }

    return reservaEvents;
  }, [reservas, selectedSlot, cancha]);

  return events;
}
