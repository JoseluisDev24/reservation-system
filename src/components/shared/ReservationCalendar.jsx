"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Configurar el calendario en español
const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function ReservationCalendar({ cancha }) {
  const [selectedDate, setSelectedDate] = useState(null);

  // Eventos de ejemplo (después vienen de la API)
  const events = [
    {
      title: "Reservado",
      start: new Date(2025, 9, 7, 14, 0), // 7 Oct 2025, 14:00
      end: new Date(2025, 9, 7, 15, 0), // 7 Oct 2025, 15:00
    },
  ];

  const handleSelectSlot = (slotInfo) => {
    console.log("Slot seleccionado:", slotInfo);
    setSelectedDate(slotInfo.start);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Seleccionar fecha y hora</h2>

      <div style={{ height: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          culture="es"
          onSelectSlot={handleSelectSlot}
          selectable
          defaultView="week"
          min={new Date(2025, 0, 1, 8, 0)} // Horario mín: 8:00 AM
          max={new Date(2025, 0, 1, 23, 0)} // Horario máx: 11:00 PM
          step={60} // Bloques de 1 hora
          timeslots={1}
        />
      </div>

      {selectedDate && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="font-semibold text-green-800">
            Fecha seleccionada: {format(selectedDate, "PPP p", { locale: es })}
          </p>
        </div>
      )}
    </div>
  );
}
