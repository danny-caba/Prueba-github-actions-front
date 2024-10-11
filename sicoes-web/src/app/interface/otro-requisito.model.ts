import { ListadoDetalle } from "./listado.model"
import { Solicitud } from "./solicitud.model"

export class OtroRequisito {
    idOtroRequisito: number
    tipo: ListadoDetalle
    tipoRequisito: ListadoDetalle
    evaluacion: ListadoDetalle
    finalizado: ListadoDetalle
    observacion: string
    solicitud: Partial<Solicitud>
    archivo: any
    flagActivo: string
    flagElectronico: string
    flagFirmaDigital: string
    fechaExpedicion: string
}