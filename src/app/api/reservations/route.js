// src/app/api/reservations/route.js

import { NextResponse } from "next/server";

// Verificar imports
let connectDB, Reservation, Resource;
try {
  connectDB = require("@/lib/mongodb").default;
  Reservation = require("@/models/Reservation").default;
  Resource = require("@/models/Resource").default;
} catch (importError) {
  console.error("❌ Error importing modules:", importError);
}

export async function POST(request) {
  console.log("📨 API POST /api/reservations - Inicio");

  try {
    // 1. Verificar que los módulos se importaron correctamente
    if (!connectDB || !Reservation || !Resource) {
      console.error("❌ Módulos no disponibles");
      return NextResponse.json(
        { error: "Error en la configuración del servidor" },
        { status: 500 }
      );
    }

    // 2. Conectar a la base de datos
    console.log("🔌 Conectando a MongoDB...");
    await connectDB();
    console.log("✅ Conectado a MongoDB");

    // 3. Leer el body
    let body;
    try {
      body = await request.json();
      console.log("📦 Body recibido:", {
        resourceId: body.resourceId,
        startDateTime: body.startDateTime,
        endDateTime: body.endDateTime,
        name: body.name,
        email: body.email,
      });
    } catch (parseError) {
      console.error("❌ Error parseando JSON:", parseError);
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

    // 4. Validación básica
    if (
      !resourceId ||
      !startDateTime ||
      !endDateTime ||
      !name ||
      !email ||
      !phone
    ) {
      console.log("❌ Faltan campos requeridos");
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // 5. Validar que el recurso existe
    console.log("🔍 Buscando recurso:", resourceId);
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      console.log("❌ Recurso no encontrado");
      return NextResponse.json(
        { error: "Recurso no encontrado" },
        { status: 404 }
      );
    }
    console.log("✅ Recurso encontrado:", resource.name);

    // 6. Procesar fechas
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    console.log("📅 Fechas procesadas:", { start, end });

    // Validar fechas
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

    // 7. Extraer date, startTime, endTime
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

    console.log("🕐 Horarios extraídos:", { date, startTime, endTime });

    // 8. Verificar disponibilidad
    console.log("🔍 Verificando disponibilidad...");
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
      console.log("❌ Conflicto con reserva existente");
      return NextResponse.json(
        { error: "El horario seleccionado ya no está disponible" },
        { status: 409 }
      );
    }
    console.log("✅ Horario disponible");

    // 9. Calcular precio
    const durationMs = end - start;
    const durationHours = durationMs / (1000 * 60 * 60);
    const totalPrice = Math.round(resource.pricePerHour * durationHours);

    console.log("💰 Precio calculado:", { durationHours, totalPrice });

    // 10. Generar código de confirmación
    const confirmationCode = `RES-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;

    // 11. Crear la reserva
    console.log("💾 Creando reserva...");
    const reservation = await Reservation.create({
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

    console.log("✅ Reserva creada:", reservation._id);

    // 12. Poblar datos del recurso
    await reservation.populate("resourceId");

    console.log("🎉 Proceso completado exitosamente");

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
    console.error("❌❌❌ Error crítico en POST /api/reservations:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error.message,
        type: error.name,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  console.log("📨 API GET /api/reservations - Inicio");

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

    const filters = { status: { $ne: "cancelled" } };

    if (resourceId) {
      filters.resourceId = resourceId;
    }

    const reservations = await Reservation.find(filters)
      .populate("resourceId")
      .sort({ date: 1, startTime: 1 });

    return NextResponse.json(
      {
        reservations: reservations.map((r) => ({
          ...r.toObject(),
          _id: r._id.toString(),
          resourceId: r.resourceId._id.toString(),
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error en GET /api/reservations:", error);
    return NextResponse.json(
      { error: "Error al obtener reservas", details: error.message },
      { status: 500 }
    );
  }
}
