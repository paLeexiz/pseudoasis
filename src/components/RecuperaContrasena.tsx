'use client';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

export const RecuperaContrasena: React.FC = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [preguntasSecretas, setPreguntasSecretas] = useState<string[]>([]);
    const [respuestasSecretas, setRespuestasSecretas] = useState<string[]>(['', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const validateEmail = (value: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const handleStep1 = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        
        const emailValue = email.trim();
        if (!emailValue) {
            setErrorMsg('Ingresa tu correo');
            return;
        }
        if (!validateEmail(emailValue)) {
            setErrorMsg('Correo inválido');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/recuperaContrasena/pregunta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailValue }),
            });

            const data = await res.json();
            if (!res.ok) {
                setErrorMsg(data.message || 'Error al buscar usuario');
            } else {
                setPreguntasSecretas(data.preguntasSecretas);
                setStep(2);
            }
        } catch (err) {
            setErrorMsg('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const handleRespuestaChange = (index: number, value: string) => {
        const newRespuestas = [...respuestasSecretas];
        newRespuestas[index] = value;
        setRespuestasSecretas(newRespuestas);
    };

    const handleStep2 = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (respuestasSecretas.some(r => !r.trim())) {
            setErrorMsg('Ingresa las 3 respuestas');
            return;
        }
        if (!newPassword) {
            setErrorMsg('Ingresa tu nueva contraseña');
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMsg('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/recuperaContrasena/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    respuestasSecretas: respuestasSecretas.map(r => r.trim()),
                    newPassword
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setErrorMsg(data.message || 'Error al restablecer contraseña');
            } else {
                alert('Contraseña actualizada con éxito');
                router.push('/login');
            }
        } catch (err) {
            setErrorMsg('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-[#0B0D11] border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-md mx-auto mt-10">
            <h2 className="text-white text-2xl font-black uppercase tracking-tighter italic mb-6">
                Restablecer contraseña
            </h2>
            
            {errorMsg && (
                <div className="w-full bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-xl mb-4 text-sm text-center">
                    {errorMsg}
                </div>
            )}

            {step === 1 && (
                <form onSubmit={handleStep1} className="w-full space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-blue-400 text-[10px] font-bold uppercase tracking-widest ml-1">Cuenta de Email</label>
                        <input
                            type="email"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/50 border-2 border-black p-4 text-white rounded-xl outline-none focus:border-blue-600 transition-all placeholder:text-gray-700"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all border-2 border-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Buscando...' : 'Buscar Usuario'}
                    </button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleStep2} className="w-full space-y-4">
                    {preguntasSecretas.map((pregunta, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex flex-col gap-2">
                                <label className="text-blue-400 text-[10px] font-bold uppercase tracking-widest ml-1">Pregunta {index + 1}</label>
                                <div className="w-full bg-black/50 border-2 border-black p-4 text-white rounded-xl">
                                    {pregunta}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-blue-400 text-[10px] font-bold uppercase tracking-widest ml-1">Respuesta {index + 1}</label>
                                <input
                                    type="text"
                                    placeholder="Tu respuesta..."
                                    value={respuestasSecretas[index]}
                                    onChange={(e) => handleRespuestaChange(index, e.target.value)}
                                    className="w-full bg-black/50 border-2 border-black p-4 text-white rounded-xl outline-none focus:border-blue-600 transition-all placeholder:text-gray-700"
                                />
                            </div>
                        </div>
                    ))}

                    <div className="flex flex-col gap-2 pt-4">
                        <label className="text-blue-400 text-[10px] font-bold uppercase tracking-widest ml-1">Nueva Contraseña</label>
                        <input
                            type="password"
                            placeholder="Nueva contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-black/50 border-2 border-black p-4 text-white rounded-xl outline-none focus:border-blue-600 transition-all placeholder:text-gray-700"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-blue-400 text-[10px] font-bold uppercase tracking-widest ml-1">Confirmar Contraseña</label>
                        <input
                            type="password"
                            placeholder="Confirma contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-black/50 border-2 border-black p-4 text-white rounded-xl outline-none focus:border-blue-600 transition-all placeholder:text-gray-700"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all border-2 border-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Guardando...' : 'Restablecer Contraseña'}
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={() => setStep(1)}
                        className="w-full py-4 bg-gray-600 hover:bg-gray-500 text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all border-2 border-black cursor-pointer"
                    >
                        Volver
                    </button>
                </form>
            )}

        </div>
    );
};