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
