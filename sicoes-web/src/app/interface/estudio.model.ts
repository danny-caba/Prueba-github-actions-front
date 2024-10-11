import { ListadoDetalle } from "./listado.model"
import { Solicitud } from "./solicitud.model"

export class Estudio {
    idEstudio: number
    tipoEstudio: ListadoDetalle
    flagEgresado: boolean
    colegiatura: string
    especialidad: string
    fechaVigenciaGrado: string
    institucion: string
    flagColegiatura: string
    fechaVigenciaColegiatura: string
    institucionColegiatura: string
    hora: string
    fechaVigencia: string
    fechaInicio: string
    fechaFin: string
    evaluacion: ListadoDetalle
    idEstudioPadre: number
    solicitud: Partial<Solicitud>
    fuente: Partial<ListadoDetalle>
    archivos: any
}