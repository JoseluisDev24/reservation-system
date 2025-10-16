import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    // 1. Obtener datos del body
    const { name, email, password } = await request.json();

    // 2. Validar que llegaron todos los campos
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // 3. Validar longitud del password
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // 4. Conectar a MongoDB
    await connectDB();

    // 5. Verificar si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // 6. Crear usuario (el middleware pre('save') hashea el password automáticamente)
    const user = await User.create({
      name,
      email,
      password,
      provider: "credentials",
      role: "user", // Por defecto todos son 'user'
    });

    // 7. Retornar respuesta exitosa (sin el password)
    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
