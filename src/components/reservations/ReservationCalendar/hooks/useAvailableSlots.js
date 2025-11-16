import { useMemo } from "react";

/**
 * @param {Array} reservas
 * @param {Function} isSlotValid
 * @returns {Array}
 */
export function useAvailableSlots(reservas, isSlotValid) {
  const availableSlots = useMemo(() => {
    const slots = [];
    const today = new Date();

    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() + day);
      date.setHours(0, 0, 0, 0);

      for (let hour = 8; hour < 23; hour++) {
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
  }, [reservas, isSlotValid]);

  return availableSlots;
}
