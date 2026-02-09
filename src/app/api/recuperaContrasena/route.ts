import { NextResponse } from 'next/server';

// Podrías importar un servicio de correo o base de datos aquí
// import { enviarCorreoRecuperacion } from '@/infrastructure/email';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        //// VALIDACIÓN EN EL BACK ////
        // erificamos que sea un string y limpiamos espeices
        const email = typeof body?.email === 'string' ? body.email.trim() : '';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            return NextResponse.json(
                { error: 'El correo es obligatorio.' }, 
                { status: 400 }
            );
        }

        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Formato de correo inválido.' }, 
                { status: 400 }
            );
        }



        //*enviar el correote*****///
        

        
        console.log('pasó: ' + email);

        return NextResponse.json(
            { ok: true, status: 201 }
        );

    } catch (error) {
        console.error('Error en Password Recovery API:', error);
        return NextResponse.json(
            { error: 'Error interno al procesar la solicitud.' }, 
            { status: 500 }
        );
    }
}