import { ListadoDetalle } from "./listado.model"

export class Sne {
    resultCode: string
    message: string
    correoAfiliado: string
    tipoAfiliacion: string
}

export class Pido {
    numeroDocumento: string
    tipoDocumento: ListadoDetalle
    nombres: string
    apellidoPaterno: string
    apellidoMaterno: string
    direccion: string
    ubigeo: string
    codigoDepartamento: string
    departamento: string
    codigoProvincia: string
    provincia: string
    codigoDistrito: string
    distrito: string
    celular: string
    esCiudadanoValido: string
    correo: string
    ruc: string

    nombreTipoNegocio: string
    codigoTipoNegocio: string

    resultCode: string
    statusCode: number
    message: string
    errorMessage: string
    deResultado: string
}

export class Sunedu {
    abreviaturaTitulo : string
    nombres : string
    apellidoPaterno : string
    apellidoMaterno : string
    especialidad : string
    tipoDocumento : string
    numeroDocumento : string
    pais : string
    tituloProfesional : string
    universidad : string
    tipoInstitucion : string
    tipoGestion : string
    fechaEmision : string
    resolucion : string
    fechaResolucion : string
}

export class Areas {
    cantidadProcesos:number
    idUnidad:number
    nombreUnidad:string
}

export class Usuario {
    idUsuario:number
    nombres:string
}