'use client';
import React, { useEffect } from 'react';

export const RecuperaContrasena: React.FC = () => {

    const validateEmail = (value: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    // Función principal de envío manejando el DOM
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Acceso directo a los elementos del DOM
        const emailInput = document.getElementById('recover-email') as HTMLInputElement;
        const submitBtn = document.getElementById('recover-btn') as HTMLButtonElement;

        //primero checoque si tiene alog, que lo limpie n estos

        const emailValue = emailInput.value.trim();

        ///más validaciones///
        if (!emailValue) return;
        if (!validateEmail(emailValue)) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Mandando';
        emailInput.disabled = true;

        try {
            const response = await fetch('/api/recuperaContrasena', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailValue }),
            });

            if (!response.ok) throw new Error('fallóo al enviar');
            emailInput.value = '';
            
        } catch (err) {
                throw new Error('Un error occurrió: ' + err);
        }
        // } finally {
        //     submitBtn.disabled = false;
        //     submitBtn.textContent = 'Send Recovery Email';
        //     emailInput.disabled = false;
        // }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-[#0B0D11] border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-md mx-auto mt-10">
            <h2 className="text-white text-2xl font-black uppercase tracking-tighter italic mb-6">restablecer contraseña</h2>
            
            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="flex flex-col gap-2">
                    <label className="text-blue-400 text-[10px] font-bold uppercase tracking-widest ml-1">Cuenta de Email</label>
                    <input
                        id="recover-email"
                        type="email"
                        placeholder="user@example.com"
                        className="w-full bg-black/50 border-2 border-black p-4 text-white rounded-xl outline-none focus:border-blue-600 transition-all placeholder:text-gray-700"
                    />
                </div>

                <button 
                    id="recover-btn"
                    type="submit" 
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all border-2 border-black cursor-pointer"
                >
                    Enviar correo de recuperación
                </button>
            </form>

        </div>
    );
};