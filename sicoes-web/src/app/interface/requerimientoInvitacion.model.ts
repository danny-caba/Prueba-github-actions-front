import { ListadoDetalle } from "./listado.model";
import { Requerimiento } from "./requerimiento.model";
import { Supervisora } from "./supervisora.model";

export class RequerimientoInvitacion {

  idRequerimientoInvitacion?: number;
  requerimientoInvitacionUuid?: string;
  requerimiento?: Requerimiento;
  estado?: ListadoDetalle;
  supervisora?: Partial<Supervisora>;
  fechaInvitacion?: Date;
  fechaCaducidad?: Date;
  fechaAceptacion?: Date;
  fechaRechazo?: Date;
  saldoContrato?: number;
  flagActivo?: string;

}