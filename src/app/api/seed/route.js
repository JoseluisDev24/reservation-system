// scripts/seed.js o src/lib/seed.js

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

    // Crear canchas
    const canchas = await Resource.insertMany([
      {
        name: "Cancha 1 - Fútbol 5",
        type: "futbol5",
        capacity: 10,
        pricePerHour: 800,
        image: "/images/cancha1.jpg",
        description:
          "Cancha de fútbol 5 con césped sintético de última generación",
        amenities: [
          "Vestuarios",
          "Estacionamiento",
          "Iluminación LED",
          "Parrillero",
        ],
        available: true,
      },
      {
        name: "Cancha 2 - Fútbol 7",
        type: "futbol7",
        capacity: 14,
        pricePerHour: 1200,
        image: "/images/cancha2.jpg",
        description: "Cancha de fútbol 7 techada con césped sintético",
        amenities: ["Vestuarios", "Estacionamiento", "Techo", "Bar"],
        available: true,
      },
      {
        name: "Cancha 3 - Fútbol 11",
        type: "futbol11",
        capacity: 22,
        pricePerHour: 2000,
        image: "/images/cancha3.jpg",
        description: "Cancha de fútbol 11 profesional",
        amenities: ["Vestuarios", "Estacionamiento", "Tribuna", "Cafetería"],
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
