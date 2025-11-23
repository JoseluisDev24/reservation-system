"use client";

import { useState, useEffect } from "react";
import ReservationModal from "@/components/shared/ReservationModal";
import toast from "react-hot-toast";
import Link from "next/link";

import { useSlotValidation } from "../hooks/useSlotValidation";
import { useAvailableSlots } from "../hooks/useAvailableSlots";
import { useCalendarEvents } from "../hooks/useCalendarEvents";

import MobileSlotsList from "./MobileSlotsList";
import DesktopCalendar from "./DesktopCalendar";
import SelectedSlotBanner from "./SelectedSlotBanner";
import CalendarLegend from "./CalendarLegend";

import { eventStyleGetter } from "../utils/calendarHelpers";
import { useRouter } from "next/navigation";

export default function ReservationCalendar({ cancha, reservas = [] }) {
  const router = useRouter();

  if (!cancha) {
    console.error("❌ ReservationCalendar: cancha is undefined");
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 font-semibold">
          Error: No se pudo cargar la información de la cancha
        </p>
        <Link
          href="/canchas"
          className="text-blue-600 hover:underline mt-2 inline-block"
        >
          Volver al listado
        </Link>
      </div>
    );
  }

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentView, setCurrentView] = useState("week");
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isSlotOccupied, isSlotValid } = useSlotValidation(reservas);
  const availableSlots = useAvailableSlots(reservas, isSlotValid, cancha);
  const events = useCalendarEvents(reservas, selectedSlot, cancha);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSelectSlot = (slotInfo) => {
    const now = new Date();
    const maxDate = new Date();
    maxDate.setDate(now.getDate() + 14);

    const dayOfWeek = slotInfo.start.getDay();
    const availableDays = cancha?.schedule?.availableDays || [
      0, 1, 2, 3, 4, 5, 6,
    ];

    if (!availableDays.includes(dayOfWeek)) {
      const dayNames = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ];
      toast.error(`${dayNames[dayOfWeek]} no está disponible para reservas.`);
      return;
    }

    if (slotInfo.start < now) {
      toast.error(
        "No podés reservar en el pasado. Por favor seleccioná una fecha futura."
      );
      return;
    }

    if (slotInfo.start > maxDate) {
      toast.error("Solo podés reservar con hasta 2 semanas de anticipación.");
      return;
    }

    const timeString = `${slotInfo.start
      .getHours()
      .toString()
      .padStart(2, "0")}:00`;
    const blockedSlots = cancha?.schedule?.blockedSlots || [];
    const isBlocked = blockedSlots.some(
      (slot) => slot.day === dayOfWeek && slot.time === timeString
    );

    if (isBlocked) {
      toast.error(
        "Este horario específico está bloqueado. Por favor seleccioná otro horario."
      );
      return;
    }

    if (isSlotOccupied(slotInfo.start, slotInfo.end)) {
      toast.error(
        "Este horario ya está reservado. Por favor seleccioná otro horario."
      );
      return;
    }

    setSelectedSlot({
      start: slotInfo.start,
      end: slotInfo.end,
    });
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleConfirmClick = () => {
    if (!selectedSlot) {
      toast.error("Por favor seleccioná un horario");
      return;
    }

    setIsModalOpen(true);
  };

  const handleReservationSubmit = async (formData) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading("Creando tu reserva...");

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

      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });

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

      toast.dismiss(loadingToast);

      if (!response.ok) {
        throw new Error(result.error || "Error al crear la reserva");
      }

      toast.success(
        `¡Reserva confirmada! 🎉\nCódigo: ${result.reservation.confirmationCode}`,
        { duration: 5000 }
      );

      setIsModalOpen(false);
      setSelectedSlot(null);

      setTimeout(() => {
        router.push("/mis-reservas");
      }, 1500);
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("❌ Error completo:", error);
      toast.error(error.message || "Error al crear la reserva");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
            eventStyleGetter={eventStyleGetter}
            cancha={cancha}
          />
        )}

        <SelectedSlotBanner
          selectedSlot={selectedSlot}
          onCancel={() => setSelectedSlot(null)}
          onConfirm={handleConfirmClick}
        />

        {!isMobile && (
          <CalendarLegend events={events} selectedSlot={selectedSlot} />
        )}
      </div>

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
