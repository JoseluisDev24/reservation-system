// src/app/api/seed/route.js
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import Reservation from "@/models/Reservation";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Limpiar colecciones
    await Resource.deleteMany({});
    await Reservation.deleteMany({});

    // Crear canchas
    const canchas = await Resource.insertMany([
      {
        name: "Cancha Fútbol 5 - Pocitos",
        description:
          "Cancha de fútbol 5 con pasto sintético de última generación",
        type: "Fútbol 5",
        capacity: 10,
        pricePerHour: 1200,
        location: "Pocitos, Montevideo",
        amenities: ["Vestuarios", "Duchas", "Estacionamiento", "Iluminación"],
        image:
          "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800",
        available: true,
      },
      {
        name: "Cancha Tenis - Carrasco",
        description: "Cancha de tenis profesional con superficie de arcilla",
        type: "Tenis",
        capacity: 4,
        pricePerHour: 800,
        location: "Carrasco, Montevideo",
        amenities: ["Vestuarios", "Alquiler de raquetas", "Estacionamiento"],
        image:
          "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800",
        available: true,
      },
      {
        name: "Cancha Paddle - Punta Gorda",
        description: "Cancha de paddle climatizada con vidrio panorámico",
        type: "Paddle",
        capacity: 4,
        pricePerHour: 900,
        location: "Punta Gorda, Montevideo",
        amenities: ["Vestuarios", "Climatización", "Buffet", "WiFi"],
        image:
          "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
        available: true,
      },
    ]);

    // Crear reservas de ejemplo para cada cancha
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const reservas = [];

    // Reservas para Fútbol 5 (próximos 7 días)
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() + i);

      // Reserva a las 18:00
      reservas.push({
        resourceId: canchas[0]._id,
        userName: `Equipo ${i + 1}`,
        userEmail: `equipo${i + 1}@ejemplo.com`,
        userPhone: "+598 99 123 456",
        date: fecha,
        startTime: "18:00",
        endTime: "19:00",
        status: i % 2 === 0 ? "confirmed" : "pending",
        totalPrice: 1200,
        confirmationCode: `CONF-${Date.now()}-${i}`,
      });

      // Reserva a las 20:00 (solo algunos días)
      if (i % 2 === 0) {
        reservas.push({
          resourceId: canchas[0]._id,
          userName: "Los Amigos FC",
          userEmail: "amigosfc@ejemplo.com",
          userPhone: "+598 99 654 321",
          date: fecha,
          startTime: "20:00",
          endTime: "21:30",
          status: "confirmed",
          totalPrice: 1800,
          confirmationCode: `CONF-${Date.now()}-${i}-2`,
        });
      }
    }

    // Reservas para Tenis
    for (let i = 1; i <= 5; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() + i);

      reservas.push({
        resourceId: canchas[1]._id,
        userName: `Tenista ${i}`,
        userEmail: `tenis${i}@ejemplo.com`,
        userPhone: "+598 99 111 222",
        date: fecha,
        startTime: `${16 + i}:00`,
        endTime: `${17 + i}:00`,
        status: "confirmed",
        totalPrice: 800,
        confirmationCode: `CONF-${Date.now()}-T${i}`,
      });
    }

    // Reservas para Paddle
    for (let i = 0; i < 4; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() + i + 2);

      reservas.push({
        resourceId: canchas[2]._id,
        userName: `Paddle Team ${i + 1}`,
        userEmail: `paddle${i + 1}@ejemplo.com`,
        userPhone: "+598 99 333 444",
        date: fecha,
        startTime: "19:00",
        endTime: "20:30",
        status: i === 0 ? "pending" : "confirmed",
        totalPrice: 1350,
        confirmationCode: `CONF-${Date.now()}-P${i}`,
      });
    }

    await Reservation.insertMany(reservas);

    return NextResponse.json({
      success: true,
      message: `${canchas.length} canchas y ${reservas.length} reservas creadas`,
      canchas: canchas.length,
      reservas: reservas.length,
    });
  } catch (error) {
    console.error("Error en seed:", error);
    return NextResponse.json(
      { error: "Error al cargar datos de ejemplo", details: error.message },
      { status: 500 }
    );
  }
}
