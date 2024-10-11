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