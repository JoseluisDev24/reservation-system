// src/components/shared/ReservationModal.jsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Schema de validación
const reservationSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre es muy largo"),
  email: z.string().email("Email inválido").min(1, "El email es requerido"),
  phone: z
    .string()
    .min(8, "El teléfono debe tener al menos 8 dígitos")
    .regex(/^[0-9+\s-]+$/, "Teléfono inválido"),
  guests: z
    .number()
    .min(1, "Debe haber al menos 1 persona")
    .max(20, "Máximo 20 personas"),
  notes: z.string().max(200, "Las notas son muy largas").optional(),
});

export default function ReservationModal({
  isOpen,
  onClose,
  onSubmit,
  cancha,
  selectedSlot,
  isSubmitting = false,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      guests: 1,
      notes: "",
    },
  });

  if (!isOpen || !selectedSlot) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  // Calcular duración y precio
  const durationMs = selectedSlot.end - selectedSlot.start;
  const durationHours = durationMs / (1000 * 60 * 60);
  const totalPrice = Math.round(cancha.pricePerHour * durationHours);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Confirmar Reserva</h2>
              <p className="text-blue-100 mt-1">{cancha.name}</p>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Resumen de la reserva */}
        <div className="bg-blue-50 p-4 m-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            📅 Resumen de tu reserva
          </h3>
          <div className="space-y-1 text-sm text-blue-800">
            <p>
              <strong>Fecha:</strong>{" "}
              {format(selectedSlot.start, "EEEE d 'de' MMMM", { locale: es })}
            </p>
            <p>
              <strong>Horario:</strong> {format(selectedSlot.start, "HH:mm")} -{" "}
              {format(selectedSlot.end, "HH:mm")} ({durationHours}h)
            </p>
            <p>
              <strong>Cancha:</strong> {cancha.name}
            </p>
            <p className="text-lg font-bold text-blue-900 mt-2">
              Total: ${totalPrice}
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo *
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Juan Pérez"
              disabled={isSubmitting}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="juan@ejemplo.com"
              disabled={isSubmitting}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono *
            </label>
            <input
              {...register("phone")}
              type="tel"
              placeholder="099 123 456"
              disabled={isSubmitting}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Cantidad de personas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad de personas *
            </label>
            <input
              {...register("guests", { valueAsNumber: true })}
              type="number"
              min="1"
              max="20"
              disabled={isSubmitting}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.guests ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.guests && (
              <p className="text-red-500 text-sm mt-1">
                {errors.guests.message}
              </p>
            )}
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas adicionales (opcional)
            </label>
            <textarea
              {...register("notes")}
              rows="3"
              placeholder="Algún pedido especial..."
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            {errors.notes && (
              <p className="text-red-500 text-sm mt-1">
                {errors.notes.message}
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                "✅ Confirmar Reserva"
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Recibirás un email de confirmación con todos los detalles
          </p>
        </form>
      </div>
    </div>
  );
}
