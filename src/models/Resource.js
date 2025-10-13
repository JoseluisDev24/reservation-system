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
      enum: [
        "futbol5",
        "futbol7",
        "futbol11",
        "tenis",
        "padel",
        "basquet",
        "voley",
      ], 
      lowercase: true,
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
    timestamps: true,
  }
);

// Índices para mejorar performance
resourceSchema.index({ type: 1 });
resourceSchema.index({ available: 1 });
resourceSchema.index({ name: 1 });

// Evitar duplicados del modelo
const Resource =
  mongoose.models.Resource || mongoose.model("Resource", resourceSchema);

export default Resource;
