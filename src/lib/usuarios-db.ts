// Array global de usuarios (simulando una base de datos)


interface Usuario {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  preguntasSecretas: string[];
  respuestasSecretas: string[];
}

export const usuarios: Usuario[] = [];