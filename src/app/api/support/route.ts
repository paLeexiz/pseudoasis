import { NextResponse } from 'next/server';
import HistorialAyuda from '@/infrastructure/memory';

const historial = new HistorialAyuda();

export async function POST(req: Request) {
    try {
        const body = await req.json();

        ////VALIDACIÓN EN EL BACK///
        const message = typeof body?.message === 'string' ? body.message.trim() : '';

        if (!message) {
            return NextResponse.json({ error: 'Mensaje vacío.' }, { status: 400 });
        }

        
        const success = historial.agregarMensaje(message, body.emisor);

        return NextResponse.json({ ok: true, success }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
    }
}