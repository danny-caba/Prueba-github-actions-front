export interface SolicitudSicoes {
    idSolicitud: number;
    propuesta: Propuesta;
    supervisora: Supervisora;
    tipoSolicitud: string;
    estadoProcesoSolicitud: string;
    fechaPlazoSubsanacion: string;
    estado: string;
    tipoContratacion: TipoContratacion;
  }
  
  export interface Propuesta {
    idPropuesta: number;
    procesoItem: ProcesoItem;
    propuestaUuid: string;
    datoProceso: boolean;
    proTecnica: boolean;
    invitarProfesionales: boolean;
    proEconomica: boolean;
    presentarPro: boolean;
  }
  
  export interface ProcesoItem {
    proceso: Proceso;
    descripcionItem: string;
  }
  
  export interface Proceso {
    idProceso: number;
    numeroProceso: string;
    nombreProceso: string;
    editar: boolean;
    verPostulante: boolean;
    datosGenerales: boolean;
    etapa: boolean;
    miembros: boolean;
    items: boolean;
    informacion: boolean;
  }
  
  export interface Supervisora {
    idSupervisora: number;
    numeroDocumento: string;
  }
  
  export interface TipoContratacion {
    idListadoDetalle: number;
    nombre: string;
    descripcion: string;
  }
  