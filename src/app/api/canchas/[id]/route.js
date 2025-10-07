import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
  try {
    await connectDB();

    const {id} = await params;
    const cancha = await Resource.findById(id);

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
