import { ListadoDetalle } from "./listado.model"


export class Seccion {
    idSeccion?: number
    deSeccion?: string
    esSeccion?: string
    flReqPersonal?: string
    coSeccion?: string
    flVisibleSeccion?: string
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
    flagConformaConsorcio?: string
    flagRemype?: string
    flagVisibleFielCumplimiento?: string
    flagVisibleRetencion?: string
    flagVisibleSuperaPropuesta?: string
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

export class Listado {
    fecCreacion?: Date
    idListado?: number
    codigo?: number
    nombre?: string
    descripcion?: string
}

export class SeccionReemplazoPersonal {
    idListadoDetalle?: number
    idListado?: number
    codigo?: string
    orden?: number
    nombre?: string
    descripcion?: string
    valor?: string
    listado?: Listado
}