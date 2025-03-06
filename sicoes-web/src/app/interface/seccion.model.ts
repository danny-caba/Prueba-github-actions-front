import { ListadoDetalle } from "./listado.model"


export class Seccion {
    idSeccion?: number
    deSeccion?: string
    esSeccion?: string
    flReqPersonal?: string
    coSeccion?: string
}

export  class Requisito {
    idSeccionRequisito?: number
    seccion?: ListadoDetalle
    coRequisito?: string
    tipoDato?: ListadoDetalle
    tipoDatoEntrada?: ListadoDetalle
    tipoContrato?: ListadoDetalle
    deSeccionRequisito?: string
    esSeccionRequisito?: string
}

export class SeccionRequisito {
    idSeccionRequisito?: number
    seccion?: Seccion
    coRequisito?: string
    tipoDato?: ListadoDetalle
    tipoDatoEntrada?: ListadoDetalle
    tipoContrato?: ListadoDetalle
    deSeccionRequisito?: string
    esSeccionRequisito?: string
}