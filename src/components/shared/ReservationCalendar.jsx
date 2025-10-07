"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useMemo, useState } from "react";

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function ReservationCalendar({ canchaName, reservas = [] }) {
  const [selectedSlot, setSelectedSlot] = useState(null);

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

  const eventStyleGetter = (event) => {
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

    const style = {
      backgroundColor:
        event.resource.status === "confirmed" ? "#055b29" : "#f59e0b",
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

  const handleSelectSlot = (slotInfo) => {
    console.log("Slot seleccionado:", slotInfo);
    setSelectedSlot({
      start: slotInfo.start,
      end: slotInfo.end,
    });
  };

  const handleSelectEvent = (event) => {
    console.log("Evento clickeado:", event);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Seleccionar fecha y hora
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Hacé clic en un horario para reservar
        </p>
      </div>

      <div style={{ height: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          culture="es"
          messages={{
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
          }}
          views={["month", "week", "day"]}
          defaultView="week"
          step={60}
          timeslots={1}
          min={new Date(2025, 0, 1, 8, 0, 0)} 
          max={new Date(2025, 0, 1, 23, 0, 0)}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
        />
      </div>

      {selectedSlot && (
        <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-400 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-blue-900">
                Horario seleccionado:{" "}
                {format(selectedSlot.start, "PPP p", { locale: es })}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Duración: {format(selectedSlot.start, "HH:mm", { locale: es })}{" "}
                - {format(selectedSlot.end, "HH:mm", { locale: es })}
              </p>
            </div>
            <button
              onClick={() => setSelectedSlot(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Reservar
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-900 rounded"></div>
          <span>
            Confirmadas (
            {events.filter((e) => e.resource?.status === "confirmed").length})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-500 rounded"></div>
          <span>
            Pendientes (
            {events.filter((e) => e.resource?.status === "pending").length})
          </span>
        </div>
        {selectedSlot && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded border-2 border-blue-700"></div>
            <span className="font-semibold text-blue-700">Tu selección</span>
          </div>
        )}
      </div>
    </div>
  );
}
