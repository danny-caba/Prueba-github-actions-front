import { ListadoDetalle } from "./listado.model"

export class Documento{
    idDocumento: number
    numeroDocumento: string
    nombreEntidad: string
    codigoContrato: string
    descripcionContrato: string
    fechaInicio: string
    fechaFin: string
    flagVigente: string
    fechaConformidad: string
    cuentaConformidad: ListadoDetalle
    idDocumentoPadre: number

    montoContrato: number
    montoTipoCambio: number
    montoContratoSol: number

    archivo: {
        idArchivo: number
    }
}