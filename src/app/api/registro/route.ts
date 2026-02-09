import { NextResponse } from "next/server";
import { usuarios } from "@/lib/usuarios-db";

export async function POST(req: Request) {
  try {
    const { nombre, email, password, telefono, captchaResultado } =
      await req.json();

    // Validaciones del lado del servidor
    if (!nombre || !email || !password || !telefono) {
      return NextResponse.json(
        { message: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Validar nombre
    const nombreLimpio = nombre.trim();
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(nombreLimpio)) {
      return NextResponse.json(
        { message: "El nombre solo debe contener letras" },
        { status: 400 }
      );
    }
    if (nombreLimpio.replace(/\s/g, "").length < 3) {
      return NextResponse.json(
        { message: "El nombre debe tener al menos 3 letras" },
        { status: 400 }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Correo electrónico inválido" },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const emailExiste = usuarios.find((u) => u.email === email);
    if (emailExiste) {
      return NextResponse.json(
        { message: "Este correo ya está registrado" },
        { status: 400 }
      );
    }

    // Validar password
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          message:
            "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo",
        },
        { status: 400 }
      );
    }

    // Validar teléfono
    if (!/^\d{10}$/.test(telefono)) {
      return NextResponse.json(
        { message: "Teléfono inválido (10 dígitos)" },
        { status: 400 }
      );
    }

    // Agregar usuario al array
    usuarios.push({
      nombre: nombreLimpio,
      email,
      password, // En producción real, deberías hashear la contraseña
      telefono,
    });

    console.log("Usuario registrado:", { nombre: nombreLimpio, email, telefono });
    console.log("Total usuarios:", usuarios.length);

    return NextResponse.json(
      { message: "Usuario registrado exitosamente" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { message: "Error en el servidor" },
      { status: 500 }
    );
  }
}