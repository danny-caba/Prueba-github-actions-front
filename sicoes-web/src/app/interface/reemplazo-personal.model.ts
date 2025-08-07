import { AdjuntoRequisto } from "./adjuntos.model"
import { ListadoDetalle } from "./listado.model"
import { Supervisora } from "./supervisora.model"

export class PersonalPropuesto {
    idPersonal?: any
    tipoDocumento: string
    numeroDocumento: string
    nombreCompleto: string
    perfil: string
    fechaRegistro: string
    fechaBaja: string
    fechaDesvinculacion: string

    docs?: {
        nepotismo: AdjuntoRequisto;
        impedimento: AdjuntoRequisto;
        novinculo: AdjuntoRequisto;
        otros: AdjuntoRequisto;
      };
}

export class PersonalReemplazo {
  idReemplazo: number;
  idSolicitud: number;
  personaPropuesta: Supervisora;
  perfil: ListadoDetalle;
  feFechaRegistro: Date;
  feFechaInicioContractual: Date;
  estadoReemplazo: ListadoDetalle;
  personaBaja: Supervisora;
  perfilBaja: ListadoDetalle;
  feFechaBaja: Date;
  feFechaDesvinculacion: Date;
  feFechaFinalizacionContrato: Date;
  estadoEvalDoc: ListadoDetalle;
  estadoRevisarEval: ListadoDetalle;
  estadoAprobacionInforme: ListadoDetalle;
  estadoAprobacionAdenda: ListadoDetalle;
  estadoEvalDocIniServ: ListadoDetalle;
}

export interface SelectedReemplazarItem {
  idAprobacion: number;
  estadoAprob: number;
}