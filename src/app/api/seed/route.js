import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Borrar canchas existentes (solo para desarrollo)
    await Resource.deleteMany({});

    // Crear canchas de ejemplo
    const canchas = await Resource.insertMany([
      {
        name: "Cancha 1 - Césped sintético",
        type: "Fútbol 5",
        capacity: 10,
        pricePerHour: 800,
        image:
          "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800",
        amenities: ["Vestuarios", "Iluminación", "Estacionamiento"],
        description:
          "Cancha de fútbol 5 con césped sintético de última generación.",
      },
      {
        name: "Cancha 2 - Profesional",
        type: "Fútbol 7",
        capacity: 14,
        pricePerHour: 1200,
        image:
          "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800",
        amenities: ["Vestuarios", "Iluminación", "Duchas", "Buffet"],
        description: "Cancha profesional para partidos de fútbol 7.",
      },
      {
        name: "Cancha 3 - Techada",
        type: "Fútbol 5",
        capacity: 10,
        pricePerHour: 1000,
        image:
          "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
        amenities: [
          "Techada",
          "Vestuarios",
          "Iluminación",
          "Aire acondicionado",
        ],
        description: "Cancha techada ideal para jugar con cualquier clima.",
      },
    ]);

    return NextResponse.json({
      success: true,
      message: `✅ ${canchas.length} canchas creadas exitosamente`,
      canchas,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
