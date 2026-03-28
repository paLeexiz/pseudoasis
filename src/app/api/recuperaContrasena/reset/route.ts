import { NextResponse } from 'next/server';
import { usuarios } from '@/lib/usuarios-db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const email = typeof body?.email === 'string' ? body.email.trim() : '';
        const respuestasSecretas = Array.isArray(body?.respuestasSecretas) ? body.respuestasSecretas : [];
        const newPassword = typeof body?.newPassword === 'string' ? body.newPassword.trim() : '';

        console.log("========== RECUPERACIÓN (Paso 2: Reset) ==========");
        console.log("Usuario intentando reset:", email);
        console.log("Respuestas recibidas:", respuestasSecretas);

        if (!email || respuestasSecretas.length !== 3 || !newPassword) {
            console.log("-> Fallo: Faltan campos obligatorios");
            return NextResponse.json(
                { message: 'Todos los campos son obligatorios.' }, 
                { status: 400 }
            );
        }

        const usuarioIndex = usuarios.findIndex((u) => u.email === email);
        if (usuarioIndex === -1) {
            console.log("-> Fallo: Usuario no encontrado en DB");
            return NextResponse.json(
                { message: 'Usuario no encontrado.' }, 
                { status: 404 }
            );
        }

        const usuario = usuarios[usuarioIndex];
        console.log("Respuestas guardadas en DB:", usuario.respuestasSecretas);

        if (!usuario.respuestasSecretas || usuario.respuestasSecretas.length !== 3) {
            console.log("-> Fallo: Usuario en DB no tiene 3 respuestas configuradas");
            return NextResponse.json(
                { message: 'El usuario no tiene configuradas sus respuestas correctamente.' }, 
                { status: 400 }
            );
        }

        // Validar que todas las respuestas coincidan (ignorando mayúsculas/minúsculas y espacios extra)
        const erroresRespuestas: string[] = [];
        const respuestasCorrectas = usuario.respuestasSecretas.every((respDB, index) => {
            const respUser = respuestasSecretas[index]?.trim();
            const esCorrecta = respDB.toLowerCase() === respUser.toLowerCase();
            if (!esCorrecta) {
                erroresRespuestas.push(`La respuesta ${index + 1} no coincide`);
            }
            return esCorrecta;
        });

        if (!respuestasCorrectas) {
            console.log("-> Fallo: Respuestas incorrectas:", erroresRespuestas);
            return NextResponse.json(
                { message: `Error en respuestas: ${erroresRespuestas.join(", ")}` }, 
                { status: 401 }
            );
        }

        // Validar nueva contraseña
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            console.log("-> Fallo: La contraseña no cumple los requisitos de seguridad");
            return NextResponse.json(
                {
                    message: "La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo",
                },
                { status: 400 }
            );
        }

        // Actualizar contraseña
        usuarios[usuarioIndex].password = newPassword;
        console.log("-> Éxito: Contraseña actualizada correctamente");
        console.log("==================================================");

        return NextResponse.json(
            { message: 'Contraseña actualizada exitosamente.' },
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
