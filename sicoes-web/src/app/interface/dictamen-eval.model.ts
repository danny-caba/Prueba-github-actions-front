import { ListadoDetalle } from "./listado.model"
import { Solicitud } from "./solicitud.model"

export class DictamenEval {
    solicitud: Partial<Solicitud>
    sector: ListadoDetalle
    montoFacturado: number
}