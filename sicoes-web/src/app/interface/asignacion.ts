import { ListadoDetalle } from "./listado.model"

export class Asignacion {
    idAsignacion: number
    solicitud: {
        solicitudUuid: number
    }
    usuario: {
        idUsuario: number
    }
    tipo: ListadoDetalle
}