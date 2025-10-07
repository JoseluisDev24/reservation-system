"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useMemo, useState, useEffect } from "react";

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
  const [currentView, setCurrentView] = useState("week");
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Generar slots disponibles para mobile
  const availableSlots = useMemo(() => {
    const slots = [];
    const today = new Date();

    // Próximos 7 días
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() + day);
      date.setHours(0, 0, 0, 0);

      // Horarios de 8 AM a 11 PM
      for (let hour = 8; hour < 23; hour++) {
        const start = new Date(date);
        start.setHours(hour, 0, 0, 0);
        const end = new Date(date);
        end.setHours(hour + 1, 0, 0, 0);

        // Verificar si está ocupado
        const isOccupied = reservas.some((reserva) => {
          const reservaStart = new Date(reserva.startDateTime);
          const reservaEnd = new Date(reserva.endDateTime);
          return (
            (start >= reservaStart && start < reservaEnd) ||
            (end > reservaStart && end <= reservaEnd)
          );
        });

        if (!isOccupied && start > new Date()) {
          slots.push({ start, end });
        }
      }
    }

    return slots;
  }, [reservas]);

  // Convertir reservas a formato de eventos para el calendario
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

    // Agregar el slot seleccionado como evento temporal
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
    // Estilo especial para el slot seleccionado
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

    // Estilos normales para reservas existentes
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

  const handleSelectSlot = (slotInfo) => {
    console.log("Slot seleccionado:", slotInfo);

    // Verificar que el slot no esté ocupado
    const isOccupied = reservas.some((reserva) => {
      const reservaStart = new Date(reserva.startDateTime);
      const reservaEnd = new Date(reserva.endDateTime);
      return (
        (slotInfo.start >= reservaStart && slotInfo.start < reservaEnd) ||
        (slotInfo.end > reservaStart && slotInfo.end <= reservaEnd)
      );
    });

    if (isOccupied) {
      alert("Este horario ya está reservado. Por favor seleccioná otro.");
      return;
    }

    setSelectedSlot({
      start: slotInfo.start,
      end: slotInfo.end,
    });
    // TODO: Abrir modal/formulario de reserva
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleSelectEvent = (event) => {
    console.log("Evento clickeado:", event);
    // TODO: Mostrar detalles de la reserva
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Seleccionar fecha y hora
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {isMobile
            ? "Tocá un horario para reservar"
            : "Hacé clic en un horario para reservar"}
        </p>
      </div>

      {/* Vista MOBILE - Lista de horarios */}
      {isMobile ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-900">
              {availableSlots.length} horarios disponibles
            </span>
          </div>

          <div className="max-h-[500px] overflow-y-auto space-y-2">
            {availableSlots.slice(0, 20).map((slot, idx) => {
              const isSelected =
                selectedSlot &&
                selectedSlot.start.getTime() === slot.start.getTime();

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedSlot(slot)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {format(slot.start, "EEEE d 'de' MMMM", { locale: es })}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {format(slot.start, "HH:mm", { locale: es })} -{" "}
                        {format(slot.end, "HH:mm", { locale: es })}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="text-blue-600 text-2xl">✓</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Vista DESKTOP - Calendario */
        <div style={{ height: 600 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            culture="es"
            view={currentView}
            onView={handleViewChange}
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
      )}

      {selectedSlot && (
        <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-400 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-semibold text-blue-900">
                Horario seleccionado:{" "}
                {format(selectedSlot.start, "PPP", { locale: es })}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                {format(selectedSlot.start, "HH:mm", { locale: es })} -{" "}
                {format(selectedSlot.end, "HH:mm", { locale: es })}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedSlot(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // TODO: Abrir formulario de reserva
                  alert("Próximo paso: Formulario de reserva");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {!isMobile && (
        <div className="mt-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
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
      )}
    </div>
  );
}
