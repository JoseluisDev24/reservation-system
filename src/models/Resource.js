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
        default: 60, 
      },
      availableDays: {
        type: [Number], 
        default: [1, 2, 3, 4, 5, 6], 
      },
      blockedSlots: [
        {
          day: {
            type: Number, 
            required: true,
          },
          time: {
            type: String, 
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
