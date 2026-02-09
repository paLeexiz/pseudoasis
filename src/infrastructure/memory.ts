



export default class HistorialAyuda {

    listMensajes: { text: string, emisor: string, fecha: Date }[] = [];

    constructor() {
        this.listMensajes = [];
    }

    agregarMensaje(mensaje: string, emisor: string): { text: string, emisor: string, fecha: Date } {
        try {
            const lastI = this.listMensajes.push({
                text: mensaje,
                emisor: emisor,
                fecha: new Date()
            });
            
            return this.listMensajes[lastI - 1];
        } catch (error) {
            console.error('Error al agregar mensaje:', error);
            throw error;
        }
    }

    // getLastMensaje(): { text: string, emisor: string, fecha: Date } {
    //     return this.listMensajes[this.listMensajes.length - 1];
    // }
}
