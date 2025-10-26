import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      // Actualizamos los valores del enum para que sean más legibles
      enum: [
        "Fútbol 5",
        "Fútbol 7",
        "Fútbol 11",
        "Tenis",
        "Paddle",
        "Básquet",
        "Vóley",
      ],
      // Removemos lowercase para permitir mayúsculas y espacios
    },

    capacity: {
      type: Number,
      default: 10,
      min: 1,
    },

    pricePerHour: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      default: "/images/default-cancha.jpg",
    },

    description: {
      type: String,
      default: "",
    },

    amenities: [
      {
        type: String,
        trim: true,
      },
    ],

    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Esto agrega automáticamente createdAt y updatedAt ✅
  }
);

// Índices para mejorar performance en consultas
resourceSchema.index({ type: 1 });
resourceSchema.index({ available: 1 });
resourceSchema.index({ name: 1 });

// Evitar duplicados del modelo en desarrollo
const Resource =
  mongoose.models.Resource || mongoose.model("Resource", resourceSchema);

export default Resource;
