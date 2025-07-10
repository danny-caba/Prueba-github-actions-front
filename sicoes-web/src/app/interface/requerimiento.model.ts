import { Division } from "./division.model"
import { ListadoDetalle } from "./listado.model"


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