import { ListadoDetalle } from "./listado.model"
import { Solicitud } from "./solicitud.model"

export class Capacitacion {
    idEstudio: number
    tipo: ListadoDetalle
    detalleTipo: string
    nombreCapacitacion: string
    institucion: string
    hora: string
    fechaVigencia: string
    fechaInicio: string
    fechaFin: string
    solicitud: Partial<Solicitud>
    archivos: any
    idEstudioPadre: number
}