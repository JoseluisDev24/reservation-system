import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import { canchaSchema } from "@/lib/validations/cancha.schema";
import { z } from "zod";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const cancha = await Resource.findById(id).populate("owner", "name email");

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
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
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

    await connectDB();

    const { id } = await params;
    const canchaExistente = await Resource.findById(id);

    if (!canchaExistente) {
      return NextResponse.json(
        { success: false, error: "Cancha no encontrada" },
        { status: 404 }
      );
    }

    if (canchaExistente.owner.toString() !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "No tienes permisos para editar esta cancha",
          message: "Solo el propietario puede editar esta cancha",
        },
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
      available,
      imageFile,
      schedule,
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
        image: canchaExistente.image,
      };

      validatedData = canchaSchema.partial().parse(dataToValidate);
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

    if (imageFile) {
      const newImageUrl = await uploadImage(imageFile, "canchas");
      validatedData.image = newImageUrl;

      if (
        canchaExistente.image &&
        !canchaExistente.image.includes("default-cancha")
      ) {
        await deleteImage(canchaExistente.image);
      }
    }

    const updateData = {
      ...validatedData,
      owner: canchaExistente.owner,
    };

    if (schedule) {
      updateData.schedule = schedule;
    }

    const canchaActualizada = await Resource.findByIdAndUpdate(
      id,
      updateData, {
        new: true,
        runValidators: true,
      }
    ).populate("owner", "name email");

    return NextResponse.json({
      success: true,
      message: "Cancha actualizada exitosamente",
      cancha: canchaActualizada,
    });
  } catch (error) {
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
      {
        success: false,
        error: "Error al actualizar la cancha: " + error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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

    await connectDB();

    const { id } = await params;
    const cancha = await Resource.findById(id);

    if (!cancha) {
      return NextResponse.json(
        { success: false, error: "Cancha no encontrada" },
        { status: 404 }
      );
    }

    if (cancha.owner.toString() !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "No tienes permisos para eliminar esta cancha",
          message: "Solo el propietario puede eliminar esta cancha",
        },
        { status: 403 }
      );
    }

    if (cancha.image && !cancha.image.includes("default-cancha")) {
      await deleteImage(cancha.image);
    }

    await Resource.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Cancha eliminada exitosamente",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Error al eliminar la cancha: " + error.message,
      },
      { status: 500 }
    );
  }
}
