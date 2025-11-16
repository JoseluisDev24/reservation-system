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
        "Fútbol 5",
        "Fútbol 7",
        "Fútbol 11",
        "Tenis",
        "Paddle",
        "Básquet",
        "Vóley",
      ],
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

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // NUEVO - Configuración de horarios
    schedule: {
      openTime: {
        type: String,
        default: "08:00",
      },
      closeTime: {
        type: String,
        default: "23:00",
      },
      slotDuration: {
        type: Number,
        default: 60, // minutos por slot
      },
      availableDays: {
        type: [Number], // 0=Dom, 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb
        default: [1, 2, 3, 4, 5, 6], // Lunes a Sábado por defecto
      },
      blockedSlots: [
        {
          day: {
            type: Number, // 0-6
            required: true,
          },
          time: {
            type: String, // "14:00"
            required: true,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

resourceSchema.index({ type: 1 });
resourceSchema.index({ available: 1 });
resourceSchema.index({ name: 1 });
resourceSchema.index({ owner: 1, available: 1 });

const Resource =
  mongoose.models.Resource || mongoose.model("Resource", resourceSchema);

export default Resource;
