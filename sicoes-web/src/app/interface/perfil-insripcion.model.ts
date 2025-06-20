import { ListadoDetalle } from "./listado.model"
import { Solicitud } from "./solicitud.model"

export class PerfilInscripcion {
    idOtroRequisito: number
    idPerfil: number
    finalizado: ListadoDetalle
    categoria: ListadoDetalle
    perfil: ListadoDetalle
    sector: ListadoDetalle
    actividad: ListadoDetalle
    actividadArea: ListadoDetalle
    subsector: ListadoDetalle
    tipo: ListadoDetalle
    solicitud: Partial<Solicitud>
    unidad: ListadoDetalle
    subcategoria: ListadoDetalle
    evaluacion: ListadoDetalle
    observacion: string
    usuario: any

    listaEvaluacion: any
}