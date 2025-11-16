export function useSlotValidation(reservas) {
  /**
   * @param {Date} start
   * @param {Date} end
   * @returns {boolean}
   */
  const isSlotOccupied = (start, end) => {
    return reservas.some((reserva) => {
      const reservaStart = new Date(reserva.startDateTime);
      const reservaEnd = new Date(reserva.endDateTime);

      return (
        (start >= reservaStart && start < reservaEnd) ||
        (end > reservaStart && end <= reservaEnd)
      );
    });
  };

  /**
   * @param {Date} start
   * @param {Date} end
   * @returns {boolean}
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
