import { useMemo } from "react";

/**
 * @param {Array} reservas 
 * @param {Function} isSlotValid 
 * @param {Object} cancha 
 * @returns {Array}
 */
export function useAvailableSlots(reservas, isSlotValid, cancha) {
  const availableSlots = useMemo(() => {
    const slots = [];
    const today = new Date();

    const schedule = cancha?.schedule || {};
    const openTime = schedule.openTime || "08:00";
    const closeTime = schedule.closeTime || "23:00";
    const blockedSlots = schedule.blockedSlots || [];
    const availableDays = schedule.availableDays || [0, 1, 2, 3, 4, 5, 6];

    const [openHour] = openTime.split(":").map(Number);
    const [closeHour] = closeTime.split(":").map(Number);

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date(today);
      date.setDate(date.getDate() + dayOffset);
      date.setHours(0, 0, 0, 0);

      const dayOfWeek = date.getDay();

      if (!availableDays.includes(dayOfWeek)) {
        continue;
      }

      for (let hour = openHour; hour < closeHour; hour++) {
        const timeString = `${hour.toString().padStart(2, "0")}:00`;

        const isBlocked = blockedSlots.some(
          (slot) => slot.day === dayOfWeek && slot.time === timeString
        );

        if (isBlocked) {
          continue;
        }

        const start = new Date(date);
        start.setHours(hour, 0, 0, 0);

        const end = new Date(date);
        end.setHours(hour + 1, 0, 0, 0);

        if (isSlotValid(start, end)) {
          slots.push({ start, end });
        }
      }
    }

    return slots;
  }, [reservas, isSlotValid, cancha]);

  return availableSlots;
}
