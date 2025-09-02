import { Division } from './division.model';
import { ListadoDetalle } from "./listado.model";
import { Profesion } from './profesion.model';
import { RequerimientoRenovacion } from './requerimiento-renovacion.model';

export class InformeRenovacion {
    idInformeRenovacion: number | null;
    usuario: any; // segun tu modelo AuthUser
    notificacion: any; // segun tu modelo
    aprobaciones: any; // segun tu modelo
    objeto: string;
    baseLegal: string;
    antecedentes: string;
    justificacion: string;
    necesidad: string;
    conclusiones: string;
    vigente: boolean;
    registro: string; // podria ser Date si lo manejas asi
    completado: string; // idem
    estadoAprobacionInforme: any; // enum o number
    requerimiento: RequerimientoRenovacion
}

