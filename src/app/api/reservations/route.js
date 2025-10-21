import { NextResponse } from "next/server";

let connectDB, Reservation, Resource, sendWhatsAppConfirmation;
try {
  connectDB = require("@/lib/mongodb").default;
  Reservation = require("@/models/Reservation").default;
  Resource = require("@/models/Resource").default;
  sendWhatsAppConfirmation = require("@/lib/whatsapp").sendWhatsAppConfirmation; // 👈 NUEVO
} catch (importError) {
  console.error("❌ Error importing modules:", importError);
}

export async function POST(request) {
  console.log("📨 API POST /api/reservations - Inicio");

  try {
    if (!connectDB || !Reservation || !Resource) {
      console.error("❌ Módulos no disponibles");
      return NextResponse.json(
        { error: "Error en la configuración del servidor" },
        { status: 500 }
      );
    }

    console.log("🔌 Conectando a MongoDB...");
    await connectDB();
    console.log("✅ Conectado a MongoDB");

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

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    console.log("📅 Fechas procesadas:", { start, end });

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

    console.log("🕐 Horarios extraídos:", { date, startTime, endTime });

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

    const durationMs = end - start;
    const durationHours = durationMs / (1000 * 60 * 60);
    const totalPrice = Math.round(resource.pricePerHour * durationHours);

    console.log("💰 Precio calculado:", { durationHours, totalPrice });

    const confirmationCode = `RES-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;

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

    await reservation.populate("resourceId");

    // 👇 NUEVO: Enviar confirmación por WhatsApp
    if (sendWhatsAppConfirmation) {
      try {
        const whatsappResult = await sendWhatsAppConfirmation({
          userName: reservation.userName,
          userPhone: reservation.userPhone,
          resourceName: reservation.resourceId.name,
          date: reservation.date,
          startTime: reservation.startTime,
          endTime: reservation.endTime,
          confirmationCode: reservation.confirmationCode,
          totalPrice: reservation.totalPrice,
        });

        console.log("📱 WhatsApp enviado:", whatsappResult);
      } catch (whatsappError) {
        console.error("❌ Error al enviar WhatsApp:", whatsappError);
        // La reserva ya se guardó, solo falló el WhatsApp
      }
    }
    // 👆 FIN NUEVO

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
    const email = searchParams.get("email");

    // Construir filtros dinámicamente
    const filters = {};

    if (resourceId) {
      filters.resourceId = resourceId;
      filters.status = { $ne: "cancelled" }; // Solo activas para calendario
    }

    if (email) {
      filters.userEmail = email;
      // Si busca por email, mostrar TODAS (incluidas canceladas)
    }

    const reservations = await Reservation.find(filters)
      .populate("resourceId")
      .sort({ date: -1, startTime: -1 });

    // Construir startDateTime y endDateTime a partir de date + startTime/endTime
    const reservationsData = reservations.map((r) => {
      const obj = r.toObject();

      // Crear Date completo combinando date + startTime
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
        startDateTime: startDateTime.toISOString(), // ← NUEVO
        endDateTime: endDateTime.toISOString(), // ← NUEVO
      };
    });

    return NextResponse.json(
      { reservations: reservationsData },
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
