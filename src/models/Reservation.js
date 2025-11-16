import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
   
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },

    
    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
      match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 
    },

    endTime: {
      type: String,
      required: true,
      match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 
    },

    
    startDateTime: {
      type: Date,
      required: false,
    },

    endDateTime: {
      type: Date,
      required: false,
    },

   
    
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
    timestamps: true,
  }
);



reservationSchema.index({ resourceId: 1, date: 1, startTime: 1 });

reservationSchema.index({ userId: 1, date: -1 });

reservationSchema.index({ userEmail: 1 });

reservationSchema.index({ status: 1 });

reservationSchema.index({
  resourceId: 1,
  date: 1,
  status: 1,
});


const Reservation =
  mongoose.models.Reservation ||
  mongoose.model("Reservation", reservationSchema);

export default Reservation;
