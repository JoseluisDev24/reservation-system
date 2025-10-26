// src/app/api/canchas/route.js

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // ← CAMBIO AQUÍ
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { uploadImage } from "@/lib/cloudinary";

/**
 * GET /api/canchas
 * Obtiene todas las canchas de la base de datos
 */
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

/**
 * POST /api/canchas
 * Crea una nueva cancha
 */
export async function POST(request) {
  try {
    // 1. VERIFICAR AUTENTICACIÓN Y AUTORIZACIÓN
    const session = await auth(); // ← CAMBIO AQUÍ

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

    // 2. OBTENER DATOS DEL BODY
    const body = await request.json();
    const {
      name,
      type,
      capacity,
      pricePerHour,
      description,
      amenities,
      imageFile,
    } = body;

    // 3. VALIDAR DATOS BÁSICOS
    if (!name || !type || !capacity || !pricePerHour) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Faltan campos obligatorios: name, type, capacity, pricePerHour",
        },
        { status: 400 }
      );
    }

    if (!imageFile) {
      return NextResponse.json(
        { success: false, error: "La imagen es obligatoria" },
        { status: 400 }
      );
    }

    // 4. SUBIR IMAGEN A CLOUDINARY
    console.log("📤 Subiendo imagen a Cloudinary...");
    const imageUrl = await uploadImage(imageFile, "canchas");
    console.log("✅ Imagen subida exitosamente:", imageUrl);

    // 5. CONECTAR A MONGODB
    await connectDB();

    // 6. CREAR NUEVA CANCHA
    const newCancha = await Resource.create({
      name,
      type,
      capacity: Number(capacity),
      pricePerHour: Number(pricePerHour),
      description: description || "",
      amenities: amenities || [],
      image: imageUrl,
      available: true,
    });

    console.log("✅ Cancha creada exitosamente:", newCancha._id);

    return NextResponse.json(
      {
        success: true,
        message: "Cancha creada exitosamente",
        cancha: newCancha,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creando cancha:", error);
    return NextResponse.json(
      { success: false, error: "Error al crear la cancha: " + error.message },
      { status: 500 }
    );
  }
}
