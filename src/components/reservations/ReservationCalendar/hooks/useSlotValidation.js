// src/components/reservations/ReservationCalendar/hooks/useSlotValidation.js

/**
 * Hook para validar disponibilidad de slots
 * Centraliza la lógica de validación que antes estaba duplicada
 */
export function useSlotValidation(reservas) {
  /**
   * Verifica si un slot se solapa con alguna reserva existente
   * @param {Date} start - Fecha/hora de inicio del slot
   * @param {Date} end - Fecha/hora de fin del slot
   * @returns {boolean} - true si está ocupado, false si está disponible
   */
  const isSlotOccupied = (start, end) => {
    return reservas.some((reserva) => {
      const reservaStart = new Date(reserva.startDateTime);
      const reservaEnd = new Date(reserva.endDateTime);

      // Lógica de solapamiento:
      // Un slot se solapa si:
      // 1. Su inicio está dentro de una reserva existente, O
      // 2. Su fin está dentro de una reserva existente
      return (
        (start >= reservaStart && start < reservaEnd) ||
        (end > reservaStart && end <= reservaEnd)
      );
    });
  };

  /**
   * Valida si un slot es seleccionable (disponible y futuro)
   * @param {Date} start - Fecha/hora de inicio del slot
   * @param {Date} end - Fecha/hora de fin del slot
   * @returns {boolean} - true si es válido, false si no
   */
  const isSlotValid = (start, end) => {
    const isOccupied = isSlotOccupied(start, end);
    const isFuture = start > new Date();

    return !isOccupied && isFuture;
  };

  return {
    isSlotOccupied,
    isSlotValid,
  };
}
