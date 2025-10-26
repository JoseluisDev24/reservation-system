// src/app/api/canchas/[id]/route.js

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // ← CAMBIO AQUÍ
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

/**
 * GET /api/canchas/[id]
 * Obtiene una cancha específica por su ID
 */
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const cancha = await Resource.findById(id);

    if (!cancha) {
      return NextResponse.json(
        { success: false, error: "Cancha no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      cancha,
    });
  } catch (error) {
    console.error("Error obteniendo cancha:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/canchas/[id]
 * Actualiza una cancha existente
 */
export async function PUT(request, { params }) {
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

    // 2. CONECTAR A MONGODB Y BUSCAR CANCHA
    await connectDB();

    const { id } = await params;
    const canchaExistente = await Resource.findById(id);

    if (!canchaExistente) {
      return NextResponse.json(
        { success: false, error: "Cancha no encontrada" },
        { status: 404 }
      );
    }

    // 3. OBTENER DATOS DEL BODY
    const body = await request.json();
    const {
      name,
      type,
      capacity,
      pricePerHour,
      description,
      amenities,
      available,
      imageFile,
    } = body;

    // 4. PREPARAR DATOS PARA ACTUALIZAR
    const updateData = {
      name,
      type,
      capacity: Number(capacity),
      pricePerHour: Number(pricePerHour),
      description: description || "",
      amenities: amenities || [],
      available: available !== undefined ? available : true,
    };

    // 5. SI HAY NUEVA IMAGEN, SUBIR Y ELIMINAR LA ANTERIOR
    if (imageFile) {
      console.log("📤 Subiendo nueva imagen a Cloudinary...");

      const newImageUrl = await uploadImage(imageFile, "canchas");
      updateData.image = newImageUrl;

      console.log("✅ Nueva imagen subida:", newImageUrl);

      if (
        canchaExistente.image &&
        !canchaExistente.image.includes("default-cancha")
      ) {
        console.log("🗑️ Eliminando imagen anterior...");
        await deleteImage(canchaExistente.image);
      }
    }

    // 6. ACTUALIZAR CANCHA EN MONGODB
    const canchaActualizada = await Resource.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    console.log("✅ Cancha actualizada exitosamente:", canchaActualizada._id);

    return NextResponse.json({
      success: true,
      message: "Cancha actualizada exitosamente",
      cancha: canchaActualizada,
    });
  } catch (error) {
    console.error("❌ Error actualizando cancha:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al actualizar la cancha: " + error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/canchas/[id]
 * Elimina una cancha
 */
export async function DELETE(request, { params }) {
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

    // 2. CONECTAR A MONGODB Y BUSCAR CANCHA
    await connectDB();

    const { id } = await params;
    const cancha = await Resource.findById(id);

    if (!cancha) {
      return NextResponse.json(
        { success: false, error: "Cancha no encontrada" },
        { status: 404 }
      );
    }

    // 3. ELIMINAR IMAGEN DE CLOUDINARY (si no es la default)
    if (cancha.image && !cancha.image.includes("default-cancha")) {
      console.log("🗑️ Eliminando imagen de Cloudinary...");
      await deleteImage(cancha.image);
    }

    // 4. ELIMINAR CANCHA DE MONGODB
    await Resource.findByIdAndDelete(id);

    console.log("✅ Cancha eliminada exitosamente:", id);

    return NextResponse.json({
      success: true,
      message: "Cancha eliminada exitosamente",
    });
  } catch (error) {
    console.error("❌ Error eliminando cancha:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al eliminar la cancha: " + error.message,
      },
      { status: 500 }
    );
  }
}
