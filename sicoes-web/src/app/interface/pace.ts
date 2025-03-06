export class PacesListado {
    solicitudUuid: number
    codigo: string
    etapa: any;
}

export class PacesUpdateDTO {
    idPaces: number | null;
    mesConvocatoria: string | null;
    noConvocatoria: string | null;
    deItemPaces: string | null;
    reProgramaAnualSupervision: string | null;
    dePresupuesto: string | null;
}

export class PacesObservarDivisionDTO {
    idPaces: number | null;
    observacion: string | null;        
}

export class PacesAprobarDivisionDTO {
    idPaces: number | null;
    observacion: string | null;        
}