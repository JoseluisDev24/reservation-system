import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { uploadImage } from "@/lib/cloudinary";
import { canchaSchema } from "@/lib/validations/cancha.schema";
import { z } from "zod";

export async function GET(request) {
  try {
    await connectDB();

    const session = await auth();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const available = searchParams.get("available");

    let filters = {};

    if (session?.user?.role === "admin") {
      filters.owner = session.user.id;
    } else {
      filters.available = true;
    }

    if (type) filters.type = type;
    if (available !== null && session?.user?.role === "admin") {
      filters.available = available === "true";
    }

    const canchas = await Resource.find(filters)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: canchas.length,
      canchas,
    });
  } catch (error) {
    console.error("Error obteniendo canchas:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { success: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "No autorizado. Solo administradores." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      type,
      capacity,
      pricePerHour,
      description,
      amenities,
      imageFile,
      available,
    } = body;

    let validatedData;
    try {
      const dataToValidate = {
        name,
        type,
        capacity: Number(capacity),
        pricePerHour: Number(pricePerHour),
        description: description || "",
        amenities: amenities || [],
        available: available !== undefined ? available : true,
        image: "",
      };

      validatedData = canchaSchema.parse(dataToValidate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            success: false,
            error: "Datos inválidos",
            details: error.errors.map((e) => ({
              field: e.path.join("."),
              message: e.message,
            })),
          },
          { status: 400 }
        );
      }
      throw error;
    }

    if (!imageFile) {
      return NextResponse.json(
        { success: false, error: "La imagen es obligatoria" },
        { status: 400 }
      );
    }

    console.log("📤 Subiendo imagen a Cloudinary...");
    const imageUrl = await uploadImage(imageFile, "canchas");
    console.log("✅ Imagen subida exitosamente:", imageUrl);

    await connectDB();

    const newCancha = await Resource.create({
      ...validatedData,
      image: imageUrl,
      owner: session.user.id,
    });

    const canchaPopulated = await Resource.findById(newCancha._id).populate(
      "owner",
      "name email"
    );

    console.log("✅ Cancha creada exitosamente:", newCancha._id);

    return NextResponse.json(
      {
        success: true,
        message: "Cancha creada exitosamente",
        cancha: canchaPopulated,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creando cancha:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          error: "Error de validación",
          details: Object.values(error.errors).map((e) => e.message),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Error al crear la cancha: " + error.message },
      { status: 500 }
    );
  }
}
