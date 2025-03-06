import { ListadoDetalle } from "./listado.model"
import { Solicitud } from "./solicitud.model"
import { Supervisora } from "./supervisora.model"

export class DictamenEval {
    idSupervisora: Supervisora
    solicitud: Partial<Solicitud>
    sector: ListadoDetalle
    montoFacturado: number
}