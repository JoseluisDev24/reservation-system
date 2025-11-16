import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Reservation from "@/models/Reservation";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const reservation = await Reservation.findById(id)
      .populate("resourceId", "name type pricePerHour image")
      .lean();

    if (!reservation) {
      return NextResponse.json(
        { error: "Reserva no encontrada" },
        { status: 404 }
      );
    }

    const reservationData = {
      ...reservation,
      _id: reservation._id.toString(),
      resourceId: {
        ...reservation.resourceId,
        _id: reservation.resourceId._id.toString(),
      },
    };

    return NextResponse.json({ reservation: reservationData });
  } catch (error) {
    console.error("❌ Error al obtener reserva:", error);
    return NextResponse.json(
      { error: "Error al obtener la reserva" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return NextResponse.json(
        { error: "Reserva no encontrada" },
        { status: 404 }
      );
    }

    if (reservation.status === "cancelled") {
      return NextResponse.json(
        { error: "La reserva ya está cancelada" },
        { status: 400 }
      );
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    )
      .populate("resourceId", "name type")
      .lean();

    const reservationData = {
      ...updatedReservation,
      _id: updatedReservation._id.toString(),
      resourceId: {
        ...updatedReservation.resourceId,
        _id: updatedReservation.resourceId._id.toString(),
      },
    };

    return NextResponse.json({
      message: "Reserva cancelada exitosamente",
      reservation: reservationData,
    });
  } catch (error) {
    console.error("❌ Error al cancelar reserva:", error);
    return NextResponse.json(
      { error: "Error al cancelar la reserva" },
      { status: 500 }
    );
  }
}
