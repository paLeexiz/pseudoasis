import { NextResponse } from 'next/server';
import { usuarios } from '@/lib/usuarios-db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const email = typeof body?.email === 'string' ? body.email.trim() : '';

        if (!email) {
            return NextResponse.json(
                { message: 'El correo es obligatorio.' }, 
                { status: 400 }
            );
        }

        console.log("========== RECUPERACIÓN (Paso 1) ==========");
        console.log("Buscando usuario:", email);
        console.log("Total usuarios en BD:", usuarios.length);
        console.log("Lista de correos registrados:", usuarios.map(u => u.email));

        const usuario = usuarios.find((u) => u.email === email);
        if (!usuario) {
            console.log("-> Fallo: Usuario no encontrado para recuperación");
            console.log("=============================================");
            return NextResponse.json(
                { message: 'Usuario no encontrado.' }, 
                { status: 404 }
            );
        }

        if (!usuario.preguntasSecretas || usuario.preguntasSecretas.length < 3) {
            console.log("-> Fallo: Usuario no tiene preguntas configuradas");
            console.log("=============================================");
            return NextResponse.json(
                { message: 'Este usuario no tiene configuradas sus preguntas secretas.' }, 
                { status: 400 }
            );
        }

        // Devolver las 3 preguntas
        console.log("-> Éxito: Preguntas devueltas correctamente");
        console.log("=============================================");

        return NextResponse.json(
            { 
                preguntasSecretas: usuario.preguntasSecretas
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: 'Error interno del servidor.' }, 
            { status: 500 }
        );
    }
}
