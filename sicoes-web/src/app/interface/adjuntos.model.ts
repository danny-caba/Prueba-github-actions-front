export class Adjunto {
    idAdjunto: number
    tipoAdjunto: {
        idListadoDetalle: number
        nombre: string
    }
    nombre: string
    url: string
}
export class AdjuntoRequisto{
    idListadoDetalle: number
    codigo: string
    nombre: string
    adjunto?: Adjunto
    esRequerido?: boolean
    inProgress?: boolean
}

export class ArchivoAdjuntoBackendDTO {
    idPerfContrato: number;
    idArchivo: number;
    idContrato: number;
    nombre: string;
    nombreReal: string;
    codigo: string;
    tipo: string;
    peso: number;
    feCreacion?: string;
    ipCreacion?: string;
    idEstadoLd?: number;
    idPersonal: any
}