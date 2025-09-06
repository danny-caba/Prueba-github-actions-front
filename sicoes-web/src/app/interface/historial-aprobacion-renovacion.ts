export interface HistorialAprobacion {
    numeroExpediente?: string;
    tipoSector?: string;
    tipoSubSector?: string;
    nombreItem?: string;
    razSocialSupervisora?: string;
    estadoFinal?: string;
    tipoAccion?: string;
    grupoAprobador?: string;
    idUsuarioAccion?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    soloAprobados?: boolean;
    soloRechazados?: boolean;
    soloMisAcciones?: boolean;
  }