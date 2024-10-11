import { ListadoDetalle } from "./listado.model"
import { Solicitud } from "./solicitud.model"

export class Evidencia {
    idArchivo: number
    tipoArchivo: ListadoDetalle
    solicitudUuid: number
    nombreReal: string
    nombreAlfresco: string
    codigo: string
    tipo: string
    descripcion: string
    nroFolio: number
    peso: number
}