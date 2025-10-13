// src/app/api/reservations/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Reservation from "@/models/Reservation";

/**
 * GET /api/reservations/[id]
 * Obtiene una reserva específica por su ID
 *
 * Uso: GET /api/reservations/507f1f77bcf86cd799439011
 * Retorna: { reservation: {...} } o error 404 si no existe
 */
export async function GET(request, { params }) {
  try {
    await connectDB();

    // Next.js 15: params es una Promise, hay que esperarla
    const { id } = await params;

    // Buscar reserva por ID y popular la info de la cancha
    const reservation = await Reservation.findById(id)
      .populate("resourceId", "name type pricePerHour image") // Trae datos de la cancha
      .lean(); // Convierte a objeto JS plano (más rápido)

    // Si no existe, retornar 404
    if (!reservation) {
      return NextResponse.json(
        { error: "Reserva no encontrada" },
        { status: 404 }
      );
    }

    // Convertir ObjectIds a strings para JSON
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

/**
 * PATCH /api/reservations/[id]
 * Cancela una reserva (cambia status a 'cancelled')
 *
 * Uso: PATCH /api/reservations/507f1f77bcf86cd799439011
 * Body: { action: "cancel" } (opcional, por ahora solo cancela)
 * Retorna: { reservation: {...} } con el status actualizado
 */
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    // Next.js 15: params es una Promise, hay que esperarla
    const { id } = await params;

    // Buscar la reserva primero para validar que existe
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return NextResponse.json(
        { error: "Reserva no encontrada" },
        { status: 404 }
      );
    }

    // Validar que no esté ya cancelada
    if (reservation.status === "cancelled") {
      return NextResponse.json(
        { error: "La reserva ya está cancelada" },
        { status: 400 }
      );
    }

    // Actualizar el status a 'cancelled'
    // findByIdAndUpdate retorna el documento DESPUÉS de actualizarlo
    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true } // Retorna el documento actualizado (no el viejo)
    )
      .populate("resourceId", "name type")
      .lean();

    // Convertir ObjectIds a strings
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
