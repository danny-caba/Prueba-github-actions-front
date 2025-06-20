export class Contrato {
  idSolicitud: number
  idPropuesta: number
  idSupervisora: number
  fecCreacion: string
  fecActualizacion: string
  descripcionSolicitud: string
  tipoSolicitud: string
  estadoProcesoSolicitud: string
  fechaPlazoInscripcion: string
  fechaPlazoSubsanacion: string
  estado: string
  archivo: any
}

export class SicoesSolicitudSeccion {
  archivo: any
  estado: string
  idPerConSec: number
  idSolicitudSeccion: number
  procRevision: string
  procSubsanacion: string
  requisito: any
}