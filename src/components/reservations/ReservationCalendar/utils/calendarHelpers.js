// src/components/reservations/ReservationCalendar/utils/calendarHelpers.js

/**
 * Función que retorna los estilos para cada evento del calendario
 * Usada por react-big-calendar para colorear los eventos
 */
export const eventStyleGetter = (event) => {
  // Estilo especial para el slot seleccionado por el usuario
  if (event.resource?.isSelected) {
    return {
      style: {
        backgroundColor: "#3b82f6", // Azul
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

  // Estilos para reservas existentes según su estado
  const style = {
    backgroundColor:
      event.resource.status === "confirmed" ? "#10b981" : "#f59e0b", // Verde o Amarillo
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

/**
 * Mensajes traducidos para react-big-calendar
 */
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

/**
 * Configuración de horarios del calendario
 */
export const calendarConfig = {
  minHour: 8, // 8 AM
  maxHour: 23, // 11 PM
  step: 60, // Slots de 1 hora
  timeslots: 1,
  views: ["month", "week", "day"],
  defaultView: "week",
};
