import { Division } from './division.model';
import { ListadoDetalle } from "./listado.model";
import { Profesion } from './profesion.model';

export class SolicitudListado {
    solicitudUuid: number
    codigo: string
}

export class Persona {
    idPersona: number
    numeroDocumento: string
    nombreRazonSocial: string
    nombres: string
    apellidoPaterno: string
    apellidoMaterno: string
    solicitante: string
    tipoPersona: ListadoDetalle
}

export class Representante {
    tipoDocumento: ListadoDetalle
    numeroDocumento: string
    nombres: string
    apellidoPaterno: string
    apellidoMaterno: string
}

export class Solicitud {
    solicitudUuidPadre: string
    solicitudUuid: string
    numeroExpediente: string
    codigo: string
    persona: Persona
    representante: Representante
    
    estado: Partial<ListadoDetalle>
    estadoRevision: ListadoDetalle
    estadoEvaluacionTecnica: ListadoDetalle
    estadoEvaluacionAdministrativa: ListadoDetalle

    observacionAdmnistrativa: string
    observacionTecnica: string

    resultadoAdministrativo: Partial<ListadoDetalle>
    asignados: any[]

    fechaPlazoResp
    fechaPlazoAsig
    fechaPlazoSub

    isUltimaSolicitud: boolean
    solicitudUuidUltima: string

    division: Division
    profesion: Profesion

}