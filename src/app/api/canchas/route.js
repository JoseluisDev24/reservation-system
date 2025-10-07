import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // ej: ?type=Fútbol 5
    const available = searchParams.get("available"); // ej: ?available=true

    // Construir filtros
    const filters = {};
    if (type) filters.type = type;
    if (available !== null) filters.available = available === "true";

    // Traer canchas
    const canchas = await Resource.find(filters).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: canchas.length,
      data: canchas,
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
