import { ListadoDetalle } from "./listado.model";

export interface InformeAprobacionResponse {
    idInformeRenovacion: number;
    numeroExpediente: string;
    tipoSector?: string;
    tipoSubSector?: string;
    nombreItem?: string;
    razSocialSupervisora?: string;
    estadoInforme?: ListadoDetalle;
    grupoAprobador?: ListadoDetalle;
    prioridad?: number;
    fechaCreacion?: string;
    fechaLimiteEvaluacion?: string;
    diasVencidos?: number;
    asignado?: boolean;
}