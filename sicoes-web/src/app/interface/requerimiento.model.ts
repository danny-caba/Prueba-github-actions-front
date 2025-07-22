import { Division } from "./division.model"
import { ListadoDetalle } from "./listado.model"
import { Usuario } from "./pido.model"
import { Supervisora } from "./supervisora.model"


export class Requerimiento {
  idRequerimiento?: number
  requerimientoUuid?: string
  nuExpediente?: string
  estado?: ListadoDetalle
  feRegistro?: Date
  division?: Division
  perfil?: ListadoDetalle
  fePlazoCargaDoc?: Date
  deObservacion?: string
  nuSiaf?: string
  supervisora?: Supervisora
  nombresApellidos?: string
}

export class RequerimientoInforme {
  idRequerimientoInforme?: number
  requerimientoInformeUuid?: string
  requerimiento: Requerimiento
}

export class RequerimientoInformeDetalle {
  idRequerimientoInformeDetalle?: number
  requerimientoInforme: RequerimientoInforme
  objetivo: string
  perfilRequerido: string
  plazoEjecucion: string
  costoServicio: string
  terminoServicio: string
  entregables: string
  penalidades: string
  tipoSeguro: string
  disponibilidadPresupuestal: string
  declaracionJurada: string
}

export class RequerimientoDocumento {
  idRequerimientoDocumento: number
  requerimientoDocumentoUuid: string
  requerimiento: Requerimiento
  estado: ListadoDetalle
  flagActivo: string
  fechaIngreso: string
  tipo: ListadoDetalle
  fechaplazoEntrega: string
  revision: ListadoDetalle
  nombresApellidos?: string
}

export class RequerimientoDocumentoDetalle {
  idRequerimientoDocumentoDetalle: number
  requerimientoDocumentoDetalleUuid: string
  requerimientoDocumento: Partial<RequerimientoDocumento>
  descripcionRequisito: string
  archivo: any
  evaluacion: Partial<ListadoDetalle>
  usuario: Partial<Usuario>
  fechaEvaluacion: string
}