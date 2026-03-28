import { NextResponse } from "next/server";
import { usuarios } from "@/lib/usuarios-db";

export async function POST(req: Request) {
  try {
    const { email, password, captchaResultado } = await req.json();

    // Validaciones del lado del servidor
    if (!email || !password) {
      return NextResponse.json(
        { message: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Correo electrónico inválido" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "La contraseña debe tener al menos 8 caracteres" },
        { status: 400 }
      );
    }

    console.log("================= LOGIN ==================");
    console.log("Intentando login con email:", email);
    console.log("Total usuarios en BD:", usuarios.length);
    console.log("Lista de correos registrados:", usuarios.map(u => u.email));

    // Buscar usuario en el array
    const usuario = usuarios.find((u) => u.email === email);

    if (!usuario) {
      console.log("-> Fallo: Usuario no encontrado");
      console.log("==========================================");
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Verificar contraseña (comparación directa sin hash)
    if (usuario.password !== password) {
      console.log("-> Fallo: Contraseña incorrecta para", email);
      console.log("==========================================");
      return NextResponse.json(
        { message: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    console.log("-> Éxito: Login exitoso para", email);
    console.log("==========================================");

    // Login exitoso
    return NextResponse.json(
      {
        message: "Inicio de sesión exitoso",
        user: {
          nombre: usuario.nombre,
          email: usuario.email,
          telefono: usuario.telefono,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { message: "Error en el servidor" },
      { status: 500 }
    );
  }
}