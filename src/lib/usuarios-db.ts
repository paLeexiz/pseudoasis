// Array global de usuarios (simulando una base de datos)

export interface Usuario {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  preguntasSecretas: string[];
  respuestasSecretas: string[];
}

// Usar globalThis para mantener el estado entre recargas en desarrollo de Next.js
declare global {
  var _usuarios: Usuario[] | undefined;
}

export const usuarios: Usuario[] = globalThis._usuarios || [];

if (process.env.NODE_ENV !== 'production') {
  globalThis._usuarios = usuarios;
}