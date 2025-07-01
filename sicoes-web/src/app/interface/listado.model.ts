export class Listado {
    idListadoDetalle: any
    codigo: any
    descripcion: any
    flagActivo: any
    nombre: any
    orden: any
    valor: any
    idListado: any
    idListadoSuperior: any
    idListadoPadre: any
}

export class ListadoDetalle {
    idListadoDetalle: number
    idListado: number
    codigo: string
    orden: string
    nombre: string
    descripcion: string
    valor: string
    editable
    disabled?: boolean
    seleccionado?: boolean
}

export class ListadoEvaluador {
    idUsuario?: any
    nombres: string
    apellidoPaterno: string
    apellidoMaterno: string
    nombreCompleto: string
}

export class ListadoPersonalPropuesto {
    idPersonal?: any
    tipoDocumento: string
    numeroDocumento: string
    nombreCompleto: string
    perfil: string
    fechaRegistro: string
    fechaBaja: string
    fechaDesvinculacion: string
}
