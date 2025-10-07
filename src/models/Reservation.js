import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema(
  {
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },
    userName: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
    },
    userEmail: {
      type: String,
      required: [true, "El email es requerido"],
      trim: true,
      lowercase: true,
    },
    userPhone: {
      type: String,
      required: [true, "El teléfono es requerido"],
    },
    date: {
      type: Date,
      required: [true, "La fecha es requerida"],
    },
    startTime: {
      type: String,
      required: [true, "La hora de inicio es requerida"],
    },
    endTime: {
      type: String,
      required: [true, "La hora de fin es requerida"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    confirmationCode: {
      type: String,
      unique: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Reservation ||
  mongoose.model("Reservation", ReservationSchema);
