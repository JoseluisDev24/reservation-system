import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const available = searchParams.get("available"); 

    const filters = {};
    if (type) filters.type = type;
    if (available !== null) filters.available = available === "true";

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
