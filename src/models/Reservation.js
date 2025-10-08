// src/models/Reservation.js

import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    // Referencia al recurso (cancha)
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },

    // Fecha de la reserva (solo día, sin hora)
    date: {
      type: Date,
      required: true,
    },

    // Hora de inicio (formato "HH:mm" como string)
    startTime: {
      type: String,
      required: true,
      match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, // Validar formato HH:mm
    },

    // Hora de fin (formato "HH:mm" como string)
    endTime: {
      type: String,
      required: true,
      match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, // Validar formato HH:mm
    },

    // OPCIONAL: Campos legacy para compatibilidad (si ya tenés reservas con estos campos)
    startDateTime: {
      type: Date,
      required: false,
    },

    endDateTime: {
      type: Date,
      required: false,
    },

    // Datos del cliente
    userName: {
      type: String,
      required: true,
      trim: true,
    },

    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    userPhone: {
      type: String,
      required: true,
      trim: true,
    },

    guests: {
      type: Number,
      default: 1,
      min: 1,
    },

    notes: {
      type: String,
      default: "",
    },

    // Precio y pago
    totalPrice: {
      type: Number,
      required: true,
    },

    // Código de confirmación único
    confirmationCode: {
      type: String,
      unique: true,
      required: true,
    },

    // Estado de la reserva
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

// Índices para mejorar performance
reservationSchema.index({ resourceId: 1, date: 1, startTime: 1 });
// ELIMINADO: reservationSchema.index({ confirmationCode: 1 }); ← YA NO NECESARIO (unique: true ya lo crea)
reservationSchema.index({ userEmail: 1 });
reservationSchema.index({ status: 1 });

// Índice compuesto para buscar conflictos de horarios
reservationSchema.index({
  resourceId: 1,
  date: 1,
  status: 1,
});

// Evitar duplicados del modelo
const Reservation =
  mongoose.models.Reservation ||
  mongoose.model("Reservation", reservationSchema);

export default Reservation;
