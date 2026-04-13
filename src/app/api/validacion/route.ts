import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import VerificationEmail from '../../../lib/verification-email';
import { usuarios } from '@/lib/usuarios-db';
import { sign, verify, JwtPayload } from 'jsonwebtoken';

// ==================== CONFIGURACIÓN ====================

// hay que hacerlo con un smpt

const transporter = nodemailer.createTransport({
host: process.env.EMAIL_HOST || 'smtp.gmail.com', // Cambia por tu host SMTP
port: parseInt(process.env.EMAIL_PORT || '587'), // Cambia por tu puerto SMTP
secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para otros puertos
auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
  },
});
// const resend = new Resend('re_FhE4P6Xk_2aD9zQFu89wCKimkNsp18kEe'); // ← Cambia por tu API Key real

const jwtSecret = process.env.JWT_SECRET || '';

type VerificationTokenPayload = {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
};

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

    if (!jwtSecret) {
      console.error('JWT_SECRET no está configurado');
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      );
    }

    const payload: VerificationTokenPayload = {
      nombre: nombre.trim(),
      email: email.toLowerCase(),
      password, // En producción no guardes contraseñas en texto plano.
      telefono: telefono || '',
    };

    const token = sign(payload, jwtSecret, { expiresIn: '30m' });
    const verificationUrl = `https://pseudoa5i5oasis1.vercel.app/validacion?token=${encodeURIComponent(token)}`;

    // Enviar correo por Resend
    // const { error } = await resend.emails.send({
    //   from: 'A5I5 <onboarding@resend.dev>',   // Cambia si quieres
    //   to: [email],
    //   subject: 'Verifica tu correo electrónico - A5I5',
    //   react: VerificationEmail({
    //     verificationUrl,
    //     name: nombre.trim()
    //   }),
    // });

    //enviar correo por smtp
    const html = await render(
      VerificationEmail({
        verificationUrl,
        name: nombre.trim(),
      })
    );

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'A5I5 <no-reply@a5i5.com>',
      to: [email],
      subject: 'Verifica tu correo electrónico - A5I5',
      html,
    });


    // if (error) {
    //   verificationTokens.delete(token); // Limpiar si falla el envío
    //   console.error('Error de Resend:', error);
    //   return NextResponse.json(
    //     { error: "No se pudo enviar el correo de verificación" },
    //     { status: 500 }
    //   );
    // }

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
    if (!jwtSecret) {
      console.error('JWT_SECRET no está configurado');
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      );
    }

    const token = request.nextUrl.searchParams.get('token');
    if (!token) {
      return NextResponse.json(
        { error: 'Falta el token en la consulta' },
        { status: 400 }
      );
    }

    let decoded: VerificationTokenPayload & JwtPayload;
    try {
      decoded = verify(token, jwtSecret) as VerificationTokenPayload & JwtPayload;
    } catch (error: any) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 400 }
      );
    }

    if (!decoded || typeof decoded.email !== 'string') {
      return NextResponse.json(
        { error: 'Token inválido o email no coincide' },
        { status: 400 }
      );
    }

    const email = decoded.email.toLowerCase();
    if (!usuarios.some((u) => u.email === email)) {
      usuarios.push({
        nombre: decoded.nombre,
        email,
        password: decoded.password,
        telefono: decoded.telefono,
        preguntasSecretas: [],
        respuestasSecretas: [],
      });
    }

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
