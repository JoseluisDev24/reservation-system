// src/components/reservations/ReservationCalendar/ReservationCalendar.jsx
"use client";

import { useState, useEffect } from "react";
import ReservationModal from "@/components/shared/ReservationModal";

// Custom Hooks
import { useSlotValidation } from "./hooks/useSlotValidation";
import { useAvailableSlots } from "./hooks/useAvailableSlots";
import { useCalendarEvents } from "./hooks/useCalendarEvents";

// Componentes visuales
import MobileSlotsList from "./components/MobileSlotsList";
import DesktopCalendar from "./components/DesktopCalendar";
import SelectedSlotBanner from "./components/SelectedSlotBanner";
import CalendarLegend from "./components/CalendarLegend";

// Utilidades
import { eventStyleGetter } from "./utils/calendarHelpers";
import { useRouter } from "next/navigation";

export default function ReservationCalendar({ cancha, reservas = [] }) {

  const router = useRouter();

  // ============================================
  // 1. VALIDACIÓN DE PROPS
  // ============================================
  if (!cancha) {
    console.error("❌ ReservationCalendar: cancha is undefined");
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 font-semibold">
          Error: No se pudo cargar la información de la cancha
        </p>
        <a
          href="/canchas"
          className="text-blue-600 hover:underline mt-2 inline-block"
        >
          Volver al listado
        </a>
      </div>
    );
  }

  // ============================================
  // 2. ESTADOS
  // ============================================
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentView, setCurrentView] = useState("week");
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============================================
  // 3. CUSTOM HOOKS (LÓGICA DE NEGOCIO)
  // ============================================
  const { isSlotOccupied, isSlotValid } = useSlotValidation(reservas);
  const availableSlots = useAvailableSlots(reservas, isSlotValid);
  const events = useCalendarEvents(reservas, selectedSlot);

  // ============================================
  // 4. EFFECT: DETECTAR MOBILE
  // ============================================
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ============================================
  // 5. HANDLERS
  // ============================================

  /**
   * Maneja la selección de un slot en el calendario
   */
  const handleSelectSlot = (slotInfo) => {
    console.log("Slot seleccionado:", slotInfo);

    // Validar que no esté ocupado
    if (isSlotOccupied(slotInfo.start, slotInfo.end)) {
      alert("Este horario ya está reservado. Por favor seleccioná otro.");
      return;
    }

    setSelectedSlot({
      start: slotInfo.start,
      end: slotInfo.end,
    });
  };

  /**
   * Maneja el click en un evento existente del calendario
   */
  const handleSelectEvent = (event) => {
    console.log("Evento clickeado:", event);
    // TODO: Mostrar detalles de la reserva
  };

  /**
   * Maneja el cambio de vista (mes/semana/día)
   */
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  /**
   * Maneja el click en el botón "Confirmar"
   */
  const handleConfirmClick = () => {
    if (!selectedSlot) {
      alert("Por favor seleccioná un horario");
      return;
    }

    console.log("🔍 Debug - Datos de cancha:", {
      _id: cancha._id,
      name: cancha.name,
      pricePerHour: cancha.pricePerHour,
    });

    setIsModalOpen(true);
  };

  /**
   * Maneja el envío del formulario de reserva
   */
  const handleReservationSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const reservationData = {
        resourceId: cancha._id,
        startDateTime: selectedSlot.start.toISOString(),
        endDateTime: selectedSlot.end.toISOString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        guests: formData.guests,
        notes: formData.notes || "",
      };

      console.log("📤 Enviando reserva:", reservationData);

      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });

      // Validar que la respuesta sea JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error(
          "❌ Respuesta no es JSON:",
          textResponse.substring(0, 200)
        );
        throw new Error("El servidor respondió con un formato inesperado.");
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al crear la reserva");
      }

      console.log("✅ Reserva creada:", result);

      alert(
        `¡Reserva confirmada! 🎉\n\nCódigo: ${result.reservation.confirmationCode}\n\nRecibirás un email con los detalles.`
      );

      setIsModalOpen(false);
      setSelectedSlot(null);

      router.push("/");
    } catch (error) {
      console.error("❌ Error completo:", error);
      alert(`Error al crear la reserva:\n\n${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

 
  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
        {/* Header */}
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

        {/* Vista Mobile o Desktop */}
        {isMobile ? (
          <MobileSlotsList
            availableSlots={availableSlots}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
          />
        ) : (
          <DesktopCalendar
            events={events}
            currentView={currentView}
            onViewChange={handleViewChange}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            eventStyleGetter={eventStyleGetter}
          />
        )}

        {/* Banner de slot seleccionado */}
        <SelectedSlotBanner
          selectedSlot={selectedSlot}
          onCancel={() => setSelectedSlot(null)}
          onConfirm={handleConfirmClick}
        />

        {/* Leyenda (solo desktop) */}
        {!isMobile && (
          <CalendarLegend events={events} selectedSlot={selectedSlot} />
        )}
      </div>

      {/* Modal de confirmación */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleReservationSubmit}
        cancha={cancha}
        selectedSlot={selectedSlot}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
