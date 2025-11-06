import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    // ========================================
    // ⭐ NUEVO: userId (referencia al usuario que hizo la reserva)
    // ========================================
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ========================================
    // Recurso (cancha) reservada
    // ========================================
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },

    // ========================================
    // Fecha y horarios
    // ========================================
    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
      match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, // Formato "HH:MM"
    },

    endTime: {
      type: String,
      required: true,
      match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, // Formato "HH:MM"
    },

    // ========================================
    // LEGACY: Campos opcionales para compatibilidad
    // ========================================
    startDateTime: {
      type: Date,
      required: false,
    },

    endDateTime: {
      type: Date,
      required: false,
    },

    // ========================================
    // Información del cliente
    // ========================================
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

    // ========================================
    // Detalles de la reserva
    // ========================================
    guests: {
      type: Number,
      default: 1,
      min: 1,
    },

    notes: {
      type: String,
      default: "",
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    confirmationCode: {
      type: String,
      unique: true,
      required: true,
    },

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

// ========================================
// ÍNDICES PARA PERFORMANCE
// ========================================

// Índice para buscar reservas de una cancha en una fecha específica
reservationSchema.index({ resourceId: 1, date: 1, startTime: 1 });

// ⭐ NUEVO: Índice para buscar reservas por usuario
reservationSchema.index({ userId: 1, date: -1 });

// Índice para buscar por email (legacy, por si acaso)
reservationSchema.index({ userEmail: 1 });

// Índice para filtrar por status
reservationSchema.index({ status: 1 });

// Índice compuesto para verificar conflictos de horarios
reservationSchema.index({
  resourceId: 1,
  date: 1,
  status: 1,
});

// ========================================
// EXPORTAR MODELO
// ========================================
// Evitar duplicados del modelo en hot-reload de Next.js
const Reservation =
  mongoose.models.Reservation ||
  mongoose.model("Reservation", reservationSchema);

export default Reservation;
