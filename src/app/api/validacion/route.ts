import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import VerificationEmail from '../../../lib/verification-email';

// ==================== CONFIGURACIÓN ====================
const resend = new Resend('re_FhE4P6Xk_2aD9zQFu89wCKimkNsp18kEe'); // ← Cambia por tu API Key real

// Almacenamiento temporal en memoria (mejor que simulación)
const verificationTokens = new Map<string, {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  expiresAt: Date;
}>();

export async function POST(request: NextRequest) {
  try {
    const { nombre, email, password, telefono } = await request.json();

    // Validaciones básicas
    if (!nombre || !email || !password) {
      return NextResponse.json(
        { error: "Faltan datos requeridos (nombre, email o contraseña)" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "El formato del correo electrónico no es válido" },
        { status: 400 }
      );
    }

    // Generar token más seguro usando crypto
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // Expira en 30 minutos

    // Guardar información del usuario temporalmente
    verificationTokens.set(token, {
      nombre: nombre.trim(),
      email: email.toLowerCase(),
      password,        // En producción nunca guardes la contraseña en plano
      telefono: telefono || "",
      expiresAt
    });

    const verificationUrl = `http://localhost:3000/validacion?token=${token}&email=${encodeURIComponent(email)}`;

    // Enviar correo
    const { error } = await resend.emails.send({
      from: 'A5I5 <onboarding@resend.dev>',   // Cambia si quieres
      to: [email],
      subject: 'Verifica tu correo electrónico - A5I5',
      react: VerificationEmail({
        verificationUrl,
        name: nombre.trim()
      }),
    });

    if (error) {
      verificationTokens.delete(token); // Limpiar si falla el envío
      console.error('Error de Resend:', error);
      return NextResponse.json(
        { error: "No se pudo enviar el correo de verificación" },
        { status: 500 }
      );
    }

    console.log(`✅ Correo de verificación enviado a: ${email}`);
    console.log(`🔑 Token generado: ${token}`);

    return NextResponse.json({
      success: true,
      message: "Correo de verificación enviado correctamente. Revisa tu bandeja de entrada."
    });

  } catch (error: any) {
    console.error('Error en send-verification:', error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');
    const email = request.nextUrl.searchParams.get('email');

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Faltan token o email en la consulta' },
        { status: 400 }
      );
    }

    const stored = verificationTokens.get(token);
    if (!stored || stored.email !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Token inválido o email no coincide' },
        { status: 400 }
      );
    }

    if (stored.expiresAt < new Date()) {
      verificationTokens.delete(token);
      return NextResponse.json(
        { error: 'El token ha expirado' },
        { status: 410 }
      );
    }

    verificationTokens.delete(token);

    return NextResponse.json({
      success: true,
      message: 'Verificación exitosa. Tu correo ha sido confirmado.'
    });
  } catch (error: any) {
    console.error('Error en GET /api/validacion:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}