import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "El tipo es requerido"],
      enum: ["Fútbol 5", "Fútbol 7", "Fútbol 11", "Tenis", "Paddle"],
    },
    capacity: {
      type: Number,
      required: [true, "La capacidad es requerida"],
      min: 1,
    },
    pricePerHour: {
      type: Number,
      required: [true, "El precio es requerido"],
      min: 0,
    },
    image: {
      type: String,
      required: [true, "La imagen es requerida"],
    },
    amenities: {
      type: [String],
      default: [],
    },
    available: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

// Evitar crear el modelo múltiples veces en desarrollo
export default mongoose.models.Resource ||
  mongoose.model("Resource", ResourceSchema);
