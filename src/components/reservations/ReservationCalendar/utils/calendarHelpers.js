export const eventStyleGetter = (event) => {
  if (event.resource?.isSelected) {
    return {
      style: {
        backgroundColor: "#3b82f6",
        borderRadius: "5px",
        opacity: 0.9,
        color: "white",
        border: "2px solid #1d4ed8",
        display: "block",
        fontSize: "0.875rem",
        fontWeight: "600",
      },
    };
  }

  if (event.resource?.isBlocked) {
    return {
      style: {
        backgroundColor: "#ef4444",
        borderRadius: "5px",
        opacity: 0.3,
        color: "white",
        border: "1px solid #dc2626",
        display: "block",
        fontSize: "0.875rem",
        fontWeight: "500",
        cursor: "not-allowed",
      },
    };
  }

  if (event.resource?.isBlockedSlot) {
    return {
      style: {
        backgroundColor: "#f59e0b",
        borderRadius: "5px",
        opacity: 0.5,
        color: "white",
        border: "1px solid #d97706",
        display: "block",
        fontSize: "0.875rem",
        fontWeight: "500",
        cursor: "not-allowed",
      },
    };
  }

  const style = {
    backgroundColor:
      event.resource.status === "confirmed" ? "#10b981" : "#f59e0b",
    borderRadius: "5px",
    opacity: 0.8,
    color: "white",
    border: "0px",
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "500",
  };

  return { style };
};

export const calendarMessages = {
  next: "Siguiente",
  previous: "Anterior",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Reserva",
  noEventsInRange: "No hay reservas en este rango",
  showMore: (total) => `+ Ver más (${total})`,
};

export const calendarConfig = {
  minHour: 8,
  maxHour: 23,
  step: 60,
  timeslots: 1,
  views: ["month", "week", "day"],
  defaultView: "week",
};
