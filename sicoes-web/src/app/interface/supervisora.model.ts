import { ListadoDetalle } from "./listado.model";

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
}

export class Representante {
    tipoDocumento: ListadoDetalle
    numeroDocumento: string
    nombres: string
    apellidoPaterno: string
    apellidoMaterno: string
}

export class Supervisora {
    idSupervisora: number
    numeroExpediente: string
    tipoDocumento: Partial<ListadoDetalle>
    tipo: Partial<ListadoDetalle>
    numeroDocumento: string
    nombreRazonSocial: string
    nombres: string
    apellidoPaterno: string
    apellidoMaterno: string
    codigoRuc: string
    direccion: string
    codigoDepartamento: string
    codigoProvincia: string
    codigoDistrito: string
    nombreDepartamento: string
    nombreProvincia: string
    nombreDistrito: string
    codigoPartidaRegistral: string
    telefono1: string
    telefono2: string
    telefono3: string
    correo: string
    codigoCliente: string
    pais: Partial<ListadoDetalle>
    fechaIngreso: string
    estado: string
    nombreCompleto?: string
}
export class ProfesionalPerfil {
    perfil: string
    documento: string
    nombre: string
    correo: string
}