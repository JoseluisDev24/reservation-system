import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

let connectDB, Reservation, Resource, sendWhatsAppConfirmation;
try {
  connectDB = require("@/lib/mongodb").default;
  Reservation = require("@/models/Reservation").default;
  Resource = require("@/models/Resource").default;
  sendWhatsAppConfirmation = require("@/lib/whatsapp").sendWhatsAppConfirmation;
} catch (importError) {
  console.error("Error importing modules:", importError);
}

export async function POST(request) {
  try {
    if (!connectDB || !Reservation || !Resource) {
      return NextResponse.json(
        { error: "Error en la configuración del servidor" },
        { status: 500 }
      );
    }

    await connectDB();

    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Debes estar logueado para hacer una reserva" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "JSON inválido en el request" },
        { status: 400 }
      );
    }

    const {
      resourceId,
      startDateTime,
      endDateTime,
      name,
      email,
      phone,
      guests,
      notes,
    } = body;

    if (
      !resourceId ||
      !startDateTime ||
      !endDateTime ||
      !name ||
      !email ||
      !phone
    ) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const resource = await Resource.findById(resourceId);
    
    if (!resource) {
      return NextResponse.json(
        { error: "Recurso no encontrado" },
        { status: 404 }
      );
    }

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (start < new Date()) {
      return NextResponse.json(
        { error: "No podés reservar en el pasado" },
        { status: 400 }
      );
    }

    if (end <= start) {
      return NextResponse.json(
        { error: "La hora de fin debe ser posterior a la de inicio" },
        { status: 400 }
      );
    }

    const date = new Date(start);
    date.setHours(0, 0, 0, 0);

    const startTime = `${start.getHours().toString().padStart(2, "0")}:${start
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    
    const endTime = `${end.getHours().toString().padStart(2, "0")}:${end
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const existingReservation = await Reservation.findOne({
      resourceId,
      date: date,
      status: { $ne: "cancelled" },
      $or: [
        { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
        { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
        { startTime: { $gte: startTime }, endTime: { $lte: endTime } },
      ],
    });

    if (existingReservation) {
      return NextResponse.json(
        { error: "El horario seleccionado ya no está disponible" },
        { status: 409 }
      );
    }

    const durationMs = end - start;
    const durationHours = durationMs / (1000 * 60 * 60);
    const totalPrice = Math.round(resource.pricePerHour * durationHours);

    const confirmationCode = `RES-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;

    const reservation = await Reservation.create({
      userId,
      resourceId,
      date,
      startTime,
      endTime,
      userName: name,
      userEmail: email,
      userPhone: phone,
      guests: guests || 1,
      notes: notes || "",
      totalPrice,
      confirmationCode,
      status: "confirmed",
    });

    await reservation.populate("resourceId");

    if (sendWhatsAppConfirmation) {
      try {
        await sendWhatsAppConfirmation({
          userName: reservation.userName,
          userPhone: reservation.userPhone,
          resourceName: reservation.resourceId.name,
          date: reservation.date,
          startTime: reservation.startTime,
          endTime: reservation.endTime,
          confirmationCode: reservation.confirmationCode,
          totalPrice: reservation.totalPrice,
        });
      } catch (whatsappError) {
        console.error("Error al enviar WhatsApp:", whatsappError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        reservation: {
          ...reservation.toObject(),
          _id: reservation._id.toString(),
          resourceId: reservation.resourceId._id.toString(),
        },
        message: "Reserva creada exitosamente",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/reservations:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    if (!connectDB || !Reservation) {
      return NextResponse.json(
        { error: "Error en la configuración del servidor" },
        { status: 500 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get("resourceId");
    const email = searchParams.get("email");

    const filters = {};

    if (resourceId) {
      filters.resourceId = resourceId;
      filters.status = { $ne: "cancelled" };
    }

    if (email) {
      filters.userEmail = email;
    }

    const reservations = await Reservation.find(filters)
      .populate("resourceId")
      .sort({ date: -1, startTime: -1 });

    const reservationsData = reservations.map((r) => {
      const obj = r.toObject();

      const [startHour, startMinute] = obj.startTime.split(":");
      const startDateTime = new Date(obj.date);
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

      const [endHour, endMinute] = obj.endTime.split(":");
      const endDateTime = new Date(obj.date);
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

      return {
        ...obj,
        _id: obj._id.toString(),
        resourceId: obj.resourceId._id.toString(),
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
      };
    });

    return NextResponse.json(
      { reservations: reservationsData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en GET /api/reservations:", error);
    return NextResponse.json(
      { error: "Error al obtener reservas", details: error.message },
      { status: 500 }
    );
  }
}