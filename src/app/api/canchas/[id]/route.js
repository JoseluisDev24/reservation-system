import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { NextResponse } from "next/server";

// GET /api/canchas/[id] - Traer una cancha por ID
export async function GET(request, context) {
  try {
    await connectDB();

    // Await params antes de usarlo
    const params = await context.params;
    const cancha = await Resource.findById(params.id);

    if (!cancha) {
      return NextResponse.json(
        {
          success: false,
          error: "Cancha no encontrada",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: cancha,
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
