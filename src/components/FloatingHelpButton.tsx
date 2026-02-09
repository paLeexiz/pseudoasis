'use client';
import { useEffect } from 'react';

export default function FloatingHelpButton() {

    // Función pura de JS para inyectar mensajes
    const inyectarMensaje = (texto: any, emisor: any) => {
        const chatContainer = document.getElementById('chat-messages-container');
        if (!chatContainer) return;

        const isSup = emisor === 'sup';
        const msgDiv = document.createElement('div');
        msgDiv.className = `flex w-full mb-4 ${isSup ? 'justify-start' : 'justify-end'}`;

        const burbuja = document.createElement('div');
        burbuja.className = `rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] ${isSup ? 'bg-[#9fadc0] text-[#1A1C22] rounded-tl-none' : 'bg-[#4A5568] text-[#E2E8F0] rounded-tr-none border border-black'
            }`;
        burbuja.style.padding = '4px 8px';
        burbuja.style.width = 'fit-content';
        burbuja.textContent = texto;

        msgDiv.appendChild(burbuja);
        chatContainer.appendChild(msgDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    useEffect(() => {
        inyectarMensaje("Hola. ¿En qué te puedo ayudar?", "sup");
    }, []);

    const togglePanel = () => {
        const panel = document.getElementById('help-sidebar-panel');
        if (panel) {
            panel.classList.toggle('translate-x-full');
            panel.classList.toggle('translate-x-0');
        }
    };

    const enviarTicket = async (e: any) => {
        e.preventDefault();
        const input: any = document.getElementById('chat-textarea-input');
        ///VALIDACIÓN///
        if (!input || !input.value.trim()) return;

        inyectarMensaje(input.value, 'usuario');
        
        const res = await fetch('/api/support', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input.value, emisor: 'usuario' }),
        });
        
        const body = await res.json();
        
        console.log(body);
        
        input.value = '';
    };
    // const enviarTicket = async (e: any) => {
    //     e.preventDefault();

    //     if (!problema.trim()) return;


    //     const nuevoMensaje = body.success;
    //     const updatedMensajes = [...mensajes, nuevoMensaje];
    //     setMensajes(updatedMensajes);
    //     setProblema('');

    //     renderizarMensajes(updatedMensajes);
    // };

    return (
        <>
            <button onClick={togglePanel} className="fixed bottom-24 right-16 z-[90] w-16 h-16 bg-gray-900 border border-black text-white rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-2xl font-bold cursor-pointer">
                ?
            </button>

            <aside id="help-sidebar-panel" className="fixed right-0 bottom-0 w-80 h-[65vh] z-[90] bg-[#0B0D11]/50 border-l-2 border-t-2 border-black rounded-tl-2xl shadow-2xl transition-transform duration-300 transform translate-x-full flex flex-col backdrop-blur-md">
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
                    <h2 className="text-white text-[10px] font-black tracking-widest uppercase italic">Soporte</h2>
                    <button onClick={togglePanel} className="text-white/30 hover:text-white transition-colors cursor-pointer">✕</button>
                </div>

                <div id="chat-messages-container" className="flex-1 p-4 overflow-y-auto flex flex-col bg-gradient-to-b from-[#1a1c2278] to-[#0b0d1167] backdrop-blur-ms" />

                <form onSubmit={enviarTicket} className="p-4 bg-[#1A202C] border-t-2 border-black">
                    <div className="flex gap-2 bg-[#0B0D11] border border-black rounded-lg p-2">
                        <textarea
                            id="chat-textarea-input"
                            className="flex-1 bg-transparent text-white text-sm outline-none resize-none h-10 font-light"
                            placeholder="Escribe reporte..."
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) enviarTicket(e); }}
                        />
                        <button type="submit" className="bg-blue-600 w-10 h-10 rounded border border-black text-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all">
                            {'>'}
                        </button>
                    </div>
                </form>
            </aside>
        </>
    );
}