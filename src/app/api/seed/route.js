// src/lib/seed.js

import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import Reservation from "@/models/Reservation";

async function seed() {
  try {
    await connectDB();
    console.log("🌱 Iniciando seed...");

    // Limpiar colecciones existentes
    await Resource.deleteMany({});
    await Reservation.deleteMany({});
    console.log("🗑️  Colecciones limpiadas");

    // Crear canchas con imágenes de Unsplash
    const canchas = await Resource.insertMany([
      {
        name: "Cancha Fútbol 5 - Pocitos",
        type: "futbol5",
        capacity: 10,
        pricePerHour: 1200,
        image:
          "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80",
        description:
          "Cancha de fútbol 5 con césped sintético de última generación, perfecta para partidos entre amigos",
        amenities: [
          "Vestuarios",
          "Estacionamiento",
          "Iluminación LED",
          "Parrillero",
        ],
        available: true,
      },
      {
        name: "Cancha Fútbol 7 - Carrasco",
        type: "futbol7",
        capacity: 14,
        pricePerHour: 1800,
        image:
          "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
        description:
          "Cancha de fútbol 7 techada con césped sintético premium y tribuna",
        amenities: ["Vestuarios", "Estacionamiento", "Techo", "Bar", "Tribuna"],
        available: true,
      },
      {
        name: "Cancha Fútbol 11 - Ciudad Vieja",
        type: "futbol11",
        capacity: 22,
        pricePerHour: 2500,
        image:
          "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80",
        description:
          "Cancha de fútbol 11 profesional con césped natural, ideal para torneos",
        amenities: [
          "Vestuarios profesionales",
          "Estacionamiento amplio",
          "Tribuna",
          "Cafetería",
          "Zona de prensa",
        ],
        available: true,
      },
    ]);

    console.log(`✅ ${canchas.length} canchas creadas`);

    // Crear algunas reservas de ejemplo
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const reservasEjemplo = [];

    // Reservas para los próximos 7 días
    for (let dia = 0; dia < 7; dia++) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() + dia);

      // 2-4 reservas por día
      const numReservas = Math.floor(Math.random() * 3) + 2;

      for (let i = 0; i < numReservas; i++) {
        const horaInicio = 8 + Math.floor(Math.random() * 12); // 8 AM - 8 PM
        const duracion = Math.random() > 0.5 ? 1 : 2; // 1 o 2 horas

        const cancha = canchas[Math.floor(Math.random() * canchas.length)];

        reservasEjemplo.push({
          resourceId: cancha._id,
          date: fecha,
          startTime: `${horaInicio.toString().padStart(2, "0")}:00`,
          endTime: `${(horaInicio + duracion).toString().padStart(2, "0")}:00`,
          userName: `Usuario ${Math.floor(Math.random() * 100)}`,
          userEmail: `user${Math.floor(Math.random() * 100)}@example.com`,
          userPhone: `099${Math.floor(Math.random() * 1000000)}`,
          guests: Math.floor(Math.random() * 10) + 1,
          notes: "Reserva de ejemplo",
          totalPrice: cancha.pricePerHour * duracion,
          confirmationCode: `RES-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 6)
            .toUpperCase()}`,
          status: Math.random() > 0.2 ? "confirmed" : "pending",
        });
      }
    }

    await Reservation.insertMany(reservasEjemplo);
    console.log(`✅ ${reservasEjemplo.length} reservas creadas`);

    console.log("🎉 Seed completado exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error en seed:", error);
    process.exit(1);
  }
}

// seed();
export default seed;
