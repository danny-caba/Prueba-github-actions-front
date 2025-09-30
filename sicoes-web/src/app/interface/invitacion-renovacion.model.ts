import { Division } from './division.model';
import { ListadoDetalle } from "./listado.model";
import { Profesion } from './profesion.model';
import { RequerimientoRenovacion } from './requerimiento-renovacion.model';

export class InvitacionRenovacion {
    idReqInvitacion?: number;
    idRequerimientoRenovacion?: number;
    numeroExpediente?: string;
    nombreItem?: string;
    sector?: string;
    subSector?: string;
    feInvitacion?: string;
    fePlazoConfirmacion?: string;
    feAceptacion?: string;
    feCaducidad?: string;
    noItem?: string;
    estadoInvitacion?: number | ListadoDetalle; // Puede ser número o objeto
    estado?: ListadoDetalle; // Campo adicional para el estado completo
    observacion?: string;
    fechaCreacion?: Date;
    fechaModificacion?: Date;
}

