import { AdjuntoRequisto } from "./adjuntos.model"

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