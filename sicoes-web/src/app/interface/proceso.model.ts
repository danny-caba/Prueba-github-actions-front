import { ListadoDetalle } from "./listado.model";

export class SolicitudListado {
    idSolicitud: number
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

export class Proceso {
    idProceso: number
    idSolicitudPadre: number
    numeroExpediente: string
    procesoUuid: string
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

    items: boolean
}

export class Usuario {
    idUsuario:number
    nombreUsuario:string
    usuario:string
    estadoUsuario:string
    correo:string
}

export class ResponseUsuario {
    idUsuario:number;
    idUsuarioRolC:number
}