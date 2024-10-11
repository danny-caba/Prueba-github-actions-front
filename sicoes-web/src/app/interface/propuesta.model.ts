import { ListadoDetalle } from "./listado.model";
import { Supervisora } from "./supervisora.model";

export class Propuesta {
    idPropuesta: number
    propuestaTecnica: any
    propuestaEconomica: any
    propuestaUuid: string
    fechaPresentacion: Date
    estado: ListadoDetalle
    supervisora: Supervisora
}

export class PropuestaProfesional{
    idPropuestaProfesional:number
    propuesta:Propuesta
    Supervisora:Supervisora
    estado: ListadoDetalle
    sector: ListadoDetalle
    subsector: ListadoDetalle
    perfil: ListadoDetalle
    fechaInvitacion:Date
    fechaRespuesta:Date
}

export class PropuestaTecnica{
    idPropuestaTecnica:number
    consorcio:ListadoDetalle
}

export class PropuestaEconomica{
    idPropuestaEconomica:number
    archivos: any
    importe:number
    folioInicio:number
    folioFin:number
}