import { EstadoEvaluacionAdministrativa, EstadoEvaluacionTecnica, EvaluadorRol, RolEnum, SolicitudEstadoEnum } from "./constantes.components";

export enum Opcion {

  //PERFIL INSCRIPCION
  BTN_PER_INS_AGREGAR = 'BTN_PER_INS_AGREGAR',
  MEN_PER_INS_MODIFICAR = 'MEN_PER_INS_MODIFICAR',
  MEN_PER_INS_ELIMINAR = 'MEN_PER_INS_ELIMINAR',

  //GRADO ACADEMICO Y TITULOS
  BTN_GRA_ACA_AGREGAR = 'BTN_GRA_ACA_AGREGAR',
  MEN_GRA_ACA_EDITAR = 'MEN_GRA_ACA_EDITAR',
  MEN_GRA_ACA_ELIMINAR = 'MEN_GRA_ACA_ELIMINAR',
  MEN_GRA_ACA_EVALUAR = 'MEN_GRA_ACA_EVALUAR',

  //CAPACITACION
  BTN_CAPAC_AGREGAR = 'BTN_CAPAC_AGREGAR',
  MEN_CAPAC_EDITAR = 'MEN_CAPAC_EDITAR',
  MEN_CAPAC_ELIMINAR = 'MEN_CAPAC_ELIMINAR',
  MEN_CAPAC_EVALUAR = 'MEN_CAPAC_EVALUAR',
  MEN_CAPAC_SUBSANAR = 'MEN_CAPAC_SUBSANAR',

  //DOC_EXPERIENCIA
  BTN_DOC_EXP_AGREGAR = 'BTN_DOC_EXP_AGREGAR',
  MEN_DOC_EXP_EDITAR = 'MEN_DOC_EXP_EDITAR',
  MEN_DOC_EXP_ELIMINAR = 'MEN_DOC_EXP_ELIMINAR',
  MEN_DOC_EXP_EVALUAR = 'MEN_DOC_EXP_EVALUAR',

  //DOC_EXPERIENCIA_ARCHIVO
  BTN_DOC_EXP_EDITAR_ARCH = 'BTN_DOC_EXP_EDITAR_ARCH',

  //RESP ADMIN
  BTN_INT_REGRESAR = 'BTN_INT_REGRESAR',
  CMP_EDIT_EVAL_TEC = 'CMP_EDIT_EVAL_TEC',
  CMP_VIEW_EVAL_TEC = 'CMP_VIEW_EVAL_TEC',
  CMP_EDIT_EVAL_ADM = 'CMP_EDIT_EVAL_ADM',
  CMP_VIEW_EVAL_ADM = 'CMP_VIEW_EVAL_ADM',

  //OBSERVACIONES Y RESULTADO
  CMP_EDIT_OBS_ADM = 'CMP_EDIT_OBS_ADM',
  CMP_VIEW_OBS_ADM = 'CMP_VIEW_OBS_ADM',
  CMP_EDIT_OBS_TEC = 'CMP_EDIT_OBS_TEC',
  CMP_VIEW_OBS_TEC = 'CMP_VIEW_OBS_TEC',

  CPM_OTROS_DOC_EVALUAR = 'CPM_OTROS_DOC_EVALUAR',

  //EVIDENCIA
  BTN_EVIDENCIA_ADD = 'BTN_EVIDENCIA_ADD',

  //RESULTADO
  RESUL_EVAL_ADMIN = 'RESUL_EVAL_ADMIN',
  RESUL_EVAL_TECNI = 'RESUL_EVAL_TECNI',

  //FINALIZA
  BTN_FIN_REV_ADM = 'BTN_FIN_REV_ADM',
  BTN_FIN_REV_TEC = 'BTN_FIN_REV_TEC',

  VIEW_EVALUACION = 'VIEW_EVALUACION',
  VIEW_EVALUACION_EXT = 'VIEW_EVALUACION_EXT',

  //APROBADOR
  BTN_APROBADOR_ADD = 'BTN_APROBADOR_ADD',
  BTN_APROBADOR_ACC = 'BTN_APROBADOR_ACC',

  //CONTRATO
  CONTRATO_EVALUACION = 'CONTRATO_EVALUACION',

  //REQUERIMIENTO
  BANDEJA_REQUERIMIENTO = 'BANDEJA_REQUERIMIENTO',
  BTN_REVISAR_DOCUMENTOS = 'BTN_REVISAR_DOCUMENTOS',
  BTN_EVALUAR_DOCUMENTOS = 'BTN_EVALUAR_DOCUMENTOS',
  BTN_NUMERO_CONTRATO = 'BTN_NUMERO_CONTRATO',
  BTN_ELABORAR_INFORME = 'BTN_ELABORAR_INFORME',
  BTN_ENVIAR_INVITACION = 'BTN_ENVIAR_INVITACION',
  BTN_ARCHIVAR_REQUERIMIENTO = 'BTN_ARCHIVAR_REQUERIMIENTO',
}

export const OpcionConfig = [
  //PERFIL INSCRIPCION
  { codigo: Opcion.BTN_PER_INS_AGREGAR, estadoSolicitud: SolicitudEstadoEnum.BORRADOR },
  { codigo: Opcion.MEN_PER_INS_MODIFICAR, estadoSolicitud: SolicitudEstadoEnum.BORRADOR },
  { codigo: Opcion.MEN_PER_INS_MODIFICAR, estadoSolicitud: SolicitudEstadoEnum.OBSERVADO },
  { codigo: Opcion.MEN_PER_INS_ELIMINAR, estadoSolicitud: SolicitudEstadoEnum.BORRADOR },

  //GRADO ACADEMICO Y TITULOS
  { codigo: Opcion.BTN_GRA_ACA_AGREGAR, estadoSolicitud: SolicitudEstadoEnum.BORRADOR },
  { codigo: Opcion.BTN_GRA_ACA_AGREGAR, estadoSolicitud: SolicitudEstadoEnum.OBSERVADO },
  { codigo: Opcion.MEN_GRA_ACA_EDITAR, estadoSolicitud: SolicitudEstadoEnum.BORRADOR },
  { codigo: Opcion.MEN_GRA_ACA_EDITAR, estadoSolicitud: SolicitudEstadoEnum.OBSERVADO },
  { codigo: Opcion.MEN_GRA_ACA_ELIMINAR, estadoSolicitud: SolicitudEstadoEnum.BORRADOR },
  { codigo: Opcion.MEN_GRA_ACA_ELIMINAR, estadoSolicitud: SolicitudEstadoEnum.OBSERVADO },
  { codigo: Opcion.MEN_GRA_ACA_EVALUAR, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionTec: EstadoEvaluacionTecnica.ASIGNADO, evaluadorRol: EvaluadorRol.TECNICO_COD },
  { codigo: Opcion.MEN_GRA_ACA_EVALUAR, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionTec: EstadoEvaluacionTecnica.EN_PROCESO, evaluadorRol: EvaluadorRol.TECNICO_COD },

  //CAPACITACION
  { codigo: Opcion.BTN_CAPAC_AGREGAR, estadoSolicitud: SolicitudEstadoEnum.BORRADOR },
  { codigo: Opcion.BTN_CAPAC_AGREGAR, estadoSolicitud: SolicitudEstadoEnum.OBSERVADO },
  { codigo: Opcion.MEN_CAPAC_EDITAR, estadoSolicitud: SolicitudEstadoEnum.BORRADOR },
  { codigo: Opcion.MEN_CAPAC_EDITAR, estadoSolicitud: SolicitudEstadoEnum.OBSERVADO },
  { codigo: Opcion.MEN_CAPAC_ELIMINAR, estadoSolicitud: SolicitudEstadoEnum.BORRADOR },
  { codigo: Opcion.MEN_CAPAC_ELIMINAR, estadoSolicitud: SolicitudEstadoEnum.OBSERVADO },
  { codigo: Opcion.MEN_CAPAC_EVALUAR, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionTec: EstadoEvaluacionTecnica.ASIGNADO, evaluadorRol: EvaluadorRol.TECNICO_COD },
  { codigo: Opcion.MEN_CAPAC_EVALUAR, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionTec: EstadoEvaluacionTecnica.EN_PROCESO, evaluadorRol: EvaluadorRol.TECNICO_COD },

  //DOC_EXPERIENCIA
  { codigo: Opcion.BTN_DOC_EXP_AGREGAR, estadoSolicitud: SolicitudEstadoEnum.BORRADOR },
  { codigo: Opcion.BTN_DOC_EXP_AGREGAR, estadoSolicitud: SolicitudEstadoEnum.OBSERVADO },
  { codigo: Opcion.MEN_DOC_EXP_EDITAR, estadoSolicitud: SolicitudEstadoEnum.BORRADOR },
  { codigo: Opcion.MEN_DOC_EXP_EDITAR, estadoSolicitud: SolicitudEstadoEnum.OBSERVADO },
  { codigo: Opcion.MEN_DOC_EXP_ELIMINAR, estadoSolicitud: SolicitudEstadoEnum.BORRADOR },
  { codigo: Opcion.MEN_DOC_EXP_ELIMINAR, estadoSolicitud: SolicitudEstadoEnum.OBSERVADO },
  { codigo: Opcion.MEN_DOC_EXP_EVALUAR, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionTec: EstadoEvaluacionTecnica.ASIGNADO, evaluadorRol: EvaluadorRol.TECNICO_COD },
  { codigo: Opcion.MEN_DOC_EXP_EVALUAR, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionTec: EstadoEvaluacionTecnica.EN_PROCESO, evaluadorRol: EvaluadorRol.TECNICO_COD },

  //BTN DOC EXP EDITAR ARCHIVO
  { codigo: Opcion.BTN_DOC_EXP_EDITAR_ARCH, estadoSolicitud: SolicitudEstadoEnum.BORRADOR },

  //RESP ADMIN
  { codigo: Opcion.BTN_INT_REGRESAR, estadoSolicitud: SolicitudEstadoEnum.ALL },
  { codigo: Opcion.CMP_EDIT_EVAL_TEC, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO },
  { codigo: Opcion.CMP_VIEW_EVAL_TEC, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO },
  { codigo: Opcion.CMP_EDIT_EVAL_ADM, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO },
  { codigo: Opcion.CMP_VIEW_EVAL_ADM, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO },

  //OBSERVACIONES Y RESULTADO
  { codigo: Opcion.CMP_EDIT_OBS_ADM, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionAdm: EstadoEvaluacionAdministrativa.ASIGNADO, evaluadorRol: EvaluadorRol.ADMINIS_COD },
  { codigo: Opcion.CMP_EDIT_OBS_ADM, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionAdm: EstadoEvaluacionAdministrativa.EN_PROCESO, evaluadorRol: EvaluadorRol.ADMINIS_COD },
  { codigo: Opcion.CMP_VIEW_OBS_ADM, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO },
  { codigo: Opcion.CMP_EDIT_OBS_TEC, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionTec: EstadoEvaluacionTecnica.ASIGNADO, evaluadorRol: EvaluadorRol.TECNICO_COD },
  { codigo: Opcion.CMP_EDIT_OBS_TEC, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionTec: EstadoEvaluacionTecnica.EN_PROCESO, evaluadorRol: EvaluadorRol.TECNICO_COD },
  { codigo: Opcion.CMP_VIEW_OBS_TEC, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO },

  //OTROS REQUISITOS
  { codigo: Opcion.CPM_OTROS_DOC_EVALUAR, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionAdm: EstadoEvaluacionAdministrativa.ASIGNADO, evaluadorRol: EvaluadorRol.ADMINIS_COD },
  { codigo: Opcion.CPM_OTROS_DOC_EVALUAR, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionAdm: EstadoEvaluacionAdministrativa.EN_PROCESO, evaluadorRol: EvaluadorRol.ADMINIS_COD },

  //EVIDENCIA
  //{ codigo: Opcion.BTN_EVIDENCIA_ADD, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO},

  { codigo: Opcion.BTN_EVIDENCIA_ADD, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionTec: EstadoEvaluacionTecnica.ASIGNADO, evaluadorRol: EvaluadorRol.TECNICO_COD },
  { codigo: Opcion.BTN_EVIDENCIA_ADD, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionTec: EstadoEvaluacionTecnica.EN_PROCESO, evaluadorRol: EvaluadorRol.TECNICO_COD },
  { codigo: Opcion.BTN_EVIDENCIA_ADD, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionAdm: EstadoEvaluacionAdministrativa.ASIGNADO, evaluadorRol: EvaluadorRol.ADMINIS_COD },
  { codigo: Opcion.BTN_EVIDENCIA_ADD, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionAdm: EstadoEvaluacionAdministrativa.EN_PROCESO, evaluadorRol: EvaluadorRol.ADMINIS_COD },

  //RESULTADO
  { codigo: Opcion.RESUL_EVAL_ADMIN, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionAdm: EstadoEvaluacionAdministrativa.ASIGNADO, evaluadorRol: EvaluadorRol.ADMINIS_COD },
  { codigo: Opcion.RESUL_EVAL_ADMIN, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionAdm: EstadoEvaluacionAdministrativa.EN_PROCESO, evaluadorRol: EvaluadorRol.ADMINIS_COD },
  { codigo: Opcion.RESUL_EVAL_TECNI, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionTec: EstadoEvaluacionTecnica.ASIGNADO, evaluadorRol: EvaluadorRol.TECNICO_COD },
  { codigo: Opcion.RESUL_EVAL_TECNI, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionTec: EstadoEvaluacionTecnica.EN_PROCESO, evaluadorRol: EvaluadorRol.TECNICO_COD },

  //FINALIZA
  { codigo: Opcion.BTN_FIN_REV_ADM, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionAdm: EstadoEvaluacionAdministrativa.ASIGNADO, evaluadorRol: EvaluadorRol.ADMINIS_COD },
  { codigo: Opcion.BTN_FIN_REV_ADM, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionAdm: EstadoEvaluacionAdministrativa.EN_PROCESO, evaluadorRol: EvaluadorRol.ADMINIS_COD },
  { codigo: Opcion.BTN_FIN_REV_TEC, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionTec: EstadoEvaluacionTecnica.ASIGNADO, evaluadorRol: EvaluadorRol.TECNICO_COD },
  { codigo: Opcion.BTN_FIN_REV_TEC, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionTec: EstadoEvaluacionTecnica.EN_PROCESO, evaluadorRol: EvaluadorRol.TECNICO_COD },

  { codigo: Opcion.VIEW_EVALUACION, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO },
  { codigo: Opcion.VIEW_EVALUACION, estadoSolicitud: SolicitudEstadoEnum.OBSERVADO },
  { codigo: Opcion.VIEW_EVALUACION_EXT, estadoSolicitud: SolicitudEstadoEnum.OBSERVADO },

  //APROBADOR
  { codigo: Opcion.BTN_APROBADOR_ADD, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionTec: EstadoEvaluacionTecnica.ASIGNADO, evaluadorRol: EvaluadorRol.TECNICO_COD },
  { codigo: Opcion.BTN_APROBADOR_ADD, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO, estadoRevisionTec: EstadoEvaluacionTecnica.EN_PROCESO, evaluadorRol: EvaluadorRol.TECNICO_COD },
  { codigo: Opcion.BTN_APROBADOR_ACC, estadoSolicitud: SolicitudEstadoEnum.EN_PROCESO },

]

export const OpcionPorRol = [{
  rol: RolEnum.USU_EXTER,
  opciones: [
    Opcion.BTN_PER_INS_AGREGAR,
    Opcion.MEN_PER_INS_MODIFICAR,
    Opcion.MEN_PER_INS_ELIMINAR,

    Opcion.BTN_GRA_ACA_AGREGAR,
    Opcion.MEN_GRA_ACA_EDITAR,
    Opcion.MEN_GRA_ACA_ELIMINAR,

    Opcion.BTN_CAPAC_AGREGAR,
    Opcion.MEN_CAPAC_EDITAR,
    Opcion.MEN_CAPAC_ELIMINAR,

    Opcion.BTN_DOC_EXP_AGREGAR,
    Opcion.MEN_DOC_EXP_EDITAR,
    Opcion.MEN_DOC_EXP_ELIMINAR,

    Opcion.BTN_DOC_EXP_EDITAR_ARCH,

    Opcion.VIEW_EVALUACION_EXT
  ]
}, {
  rol: RolEnum.RES_ADMIN,
  opciones: [
    Opcion.BTN_INT_REGRESAR,
    Opcion.CMP_VIEW_EVAL_TEC,
    Opcion.CMP_EDIT_EVAL_ADM,
    Opcion.CMP_VIEW_OBS_ADM,
    Opcion.CMP_VIEW_OBS_TEC,
    Opcion.VIEW_EVALUACION,

    // ---
    Opcion.CONTRATO_EVALUACION
  ]
}, {
  rol: RolEnum.RES_TECNI,
  opciones: [
    Opcion.BTN_INT_REGRESAR,
    Opcion.CMP_VIEW_EVAL_TEC,
    Opcion.CMP_EDIT_EVAL_TEC,
    Opcion.CMP_VIEW_OBS_ADM,
    Opcion.CMP_VIEW_OBS_TEC,
    Opcion.VIEW_EVALUACION,
    Opcion.BANDEJA_REQUERIMIENTO,
    Opcion.BTN_EVALUAR_DOCUMENTOS,
    Opcion.BTN_NUMERO_CONTRATO,
    Opcion.BTN_ELABORAR_INFORME,
    Opcion.BTN_ENVIAR_INVITACION,
    Opcion.BTN_ARCHIVAR_REQUERIMIENTO,
  ]
}, {
  rol: RolEnum.EVA_TECNI,
  opciones: [
    Opcion.BTN_INT_REGRESAR,
    Opcion.CMP_VIEW_EVAL_TEC,
    //Opcion.CMP_EDIT_EVAL_TEC,
    Opcion.CMP_VIEW_OBS_ADM,
    Opcion.CMP_EDIT_OBS_TEC,

    Opcion.MEN_CAPAC_EVALUAR,
    Opcion.MEN_DOC_EXP_EVALUAR,
    Opcion.MEN_GRA_ACA_EVALUAR,

    Opcion.RESUL_EVAL_TECNI,

    Opcion.BTN_FIN_REV_TEC,
    Opcion.VIEW_EVALUACION,
    Opcion.BTN_EVIDENCIA_ADD,
    Opcion.BTN_APROBADOR_ADD
  ]
}, {
  rol: RolEnum.EVA_ADMIN,
  opciones: [
    Opcion.BTN_INT_REGRESAR,
    Opcion.CMP_VIEW_EVAL_TEC,
    Opcion.CMP_EDIT_EVAL_ADM,
    Opcion.CMP_EDIT_OBS_ADM,
    Opcion.CMP_VIEW_OBS_TEC,

    Opcion.CPM_OTROS_DOC_EVALUAR,
    Opcion.RESUL_EVAL_ADMIN,

    Opcion.BTN_FIN_REV_ADM,
    Opcion.VIEW_EVALUACION,
    Opcion.BTN_EVIDENCIA_ADD,
    //Opcion.BTN_APROBADOR_ADD
  ]
}, {
  rol: RolEnum.APROB_TEC,
  opciones: [
    Opcion.VIEW_EVALUACION,
    Opcion.BTN_APROBADOR_ACC,
  ]
}, {
  rol: RolEnum.APROB_ADM,
  opciones: [
    Opcion.VIEW_EVALUACION,
    Opcion.BTN_APROBADOR_ACC,
  ]
}, {
  rol: RolEnum.EVA_CONTRA,
  opciones: [
    Opcion.BTN_REVISAR_DOCUMENTOS,
  ]
}];

const menu01 = {
  codigo: 'menu01',
  type: 'link',
  label: 'Bandeja Solicitudes',
  route: '/extranet/solicitudes',
  icon: 'mat:arrow_circle_right',
  routerLinkActiveOptions: { exact: true }
};
const menu02 = {
  codigo: 'menu02',
  type: 'link',
  label: 'Bandeja Solicitudes',
  route: '/intranet/solicitudes',
  icon: 'mat:arrow_circle_right',
  routerLinkActiveOptions: { exact: true }
};
const menu04 = {
  codigo: 'menu04',
  type: 'link',
  label: 'Mis Solicitudes',
  route: '/intranet/solicitudes/atencion',
  icon: 'mat:arrow_circle_right',
  routerLinkActiveOptions: { exact: true }
};
const menu05 = {
  codigo: 'menu05',
  type: 'link',
  label: 'Bandeja Aprobaciones',
  route: '/intranet/solicitudes/aprobacion',
  icon: 'mat:arrow_circle_right',
  routerLinkActiveOptions: { exact: true }
};
const menu06 = {
  codigo: 'menu06',
  type: 'link',
  label: 'Registro de Precalificación de Empresas Supervisoras',
  route: '/intranet/empresa-supervisoras',
  icon: 'mat:arrow_circle_right',
  routerLinkActiveOptions: { exact: true }
};
const menu07 = {
  codigo: 'menu07',
  type: 'link',
  label: 'Registro de E.S. Suspendidas / Canceladas',
  route: '/intranet/empresa-supervisoras/susp-canc',
  icon: 'mat:arrow_circle_right',
  routerLinkActiveOptions: { exact: true }
};
const menu08 = {
  codigo: 'menu08',
  type: 'link',
  label: 'Bandeja Procesos',
  route: '/intranet/procesos',
  icon: 'mat:arrow_circle_right',
  routerLinkActiveOptions: { exact: true }
}

const menu09 = {
  codigo: 'menu09',
  type: 'link',
  label: 'Bandeja de Procesos',
  route: '/extranet/procesos',
  icon: 'mat:arrow_circle_right',
  routerLinkActiveOptions: { exact: true }
};

const menu10 = {
  codigo: 'menu10',
  type: 'link',
  label: 'Bandeja de Invitaciones',
  route: '/extranet/invitaciones',
  icon: 'mat:arrow_circle_right',
  routerLinkActiveOptions: { exact: true }
};

const menu11 = {
  codigo: 'menu11',
  type: 'link',
  label: 'Gestión de profesionales',
  route: '/intranet/liberar-personal',
  icon: 'mat:arrow_circle_right',
  routerLinkActiveOptions: { exact: true }
};

const menu12 = {
  codigo: 'menu12',
  type: 'link',
  label: 'Gestión de Usuarios',
  route: '/intranet/gestion-usuarios',
  icon: 'mat:arrow_circle_right',
  routerLinkActiveOptions: { exact: true }
};

const menu13 = {
  codigo: 'menu13',
  type: 'link',
  label: 'Gestión de Asignación',
  route: '/extranet/gestion-asignacion',
  icon: 'mat:arrow_circle_right',
  routerLinkActiveOptions: { exact: true }
};

const menu14 = {
  codigo: 'menu14',
  type: 'link',
  label: 'Solicitudes de Contrato',
  route: '/extranet/contratos',
  icon: 'mat:arrow_circle_right',
  routerLinkActiveOptions: { exact: true }
};

const menu15 = {
  codigo: 'menu15',
  type: 'link',
  label: 'Gestión de Configuraciones',
  route: '/intranet/gestion-configuraciones',
  icon: 'mat:arrow_circle_right',
  routerLinkActiveOptions: { exact: true }
}

const menu16 = {
  codigo: 'menu16',
  type: 'link',
  label: 'Solicitudes de Contrato',
  route: '/intranet/contratos',
  icon: 'mat:arrow_circle_right',
  routerLinkActiveOptions: { exact: true }
};

const menu17 = {
  codigo: 'menu17',
  type: 'link',
  label: 'Bandeja de Contratos',
  route: '/intranet/bandeja-contratos',
  icon: 'mat:arrow_circle_right',
  routerLinkActiveOptions: { exact: true }
};

const menu18 = {
  codigo: 'menu14',
  type: 'link',
  label: 'Gestión de PACES',
  route: '/intranet/procesos/gestionPaces',
  icon: 'mat:arrow_circle_right',
  routerLinkActiveOptions: { exact: true }
};
const menu19 = {
  codigo: 'menu14',
  type: 'link',
  label: 'Aprobación de PACES',
  route: '/intranet/procesos/aprobacionPaces',
  icon: 'mat:arrow_circle_right',
  routerLinkActiveOptions: { exact: true }
};
const menu20 = {
  codigo: 'menu14',
  type: 'link',
  label: 'Aprobación de PACES Gerencia',
  route: '/intranet/procesos/aprobacionPacesGerencia',
  icon: 'mat:arrow_circle_right',
  routerLinkActiveOptions: { exact: true }
};
const menu21 = {
  codigo: 'menu21',
  type: 'link',
  label: 'Gestión de Requerimientos',
  route: '/intranet/requerimientos',
  icon: 'mat:arrow_circle_right',
  routerLinkActiveOptions: { exact: true }
};


export const RolMenu = [
  { ROL: { CODIGO: RolEnum.USU_EXTER }, MENU: [menu01, menu09, menu10, 
    menu14
  ], path: [
    'extranet/solicitudes',
    'extranet/solicitudes/opciones',
    'extranet/solicitudes/registro',
    'extranet/solicitudes/editar/',
    'extranet/solicitudes/subsanar/',
    'extranet/solicitudes/ver/',
    'extranet/proceso',
    'extranet/invitaciones',
    'extranet/contrato',
    'extranet/requerimientos/documentos/add',
    'extranet/requerimientos/documentos/subsanar',
    'extranet/requerimientos/documentos/view'
  ]},
  { ROL: { CODIGO: RolEnum.EVA_ADMIN }, MENU: [menu02, menu04], path: [
    'intranet/solicitudes',
    'intranet/solicitudes/ver/',
    'intranet/solicitudes/evaluar/',
    'intranet/solicitudes/atencion',
  ]},
  { ROL: { CODIGO: RolEnum.EVA_TECNI }, MENU: [menu02, menu04], path: [
    'intranet/solicitudes',
    'intranet/solicitudes/ver/',
    'intranet/solicitudes/evaluar/',
    'intranet/solicitudes/atencion'
  ]},
  { ROL: { CODIGO: RolEnum.RES_ADMIN }, MENU: [menu02, menu04, menu06, menu07], path: [
    'intranet/solicitudes',
    'intranet/solicitudes/ver/',
    'intranet/solicitudes/procesar/',
    'intranet/empresa-supervisoras',
    'intranet/empresa-supervisoras/susp-canc',
    'intranet/solicitudes/atencion',
    'intranet/empresa-supervisoras/ver/',
    'intranet/empresa-supervisoras/suspender/',
    'intranet/empresa-supervisoras/cancelar/',
    'intranet/empresa-supervisoras/susp-canc/ver'
  ]},
  { ROL: { CODIGO: RolEnum.RES_TECNI }, MENU: [menu02, menu04, menu06, menu07,menu18], path: [
    'intranet/solicitudes',
    'intranet/solicitudes/ver/',
    'intranet/solicitudes/procesar/',
    'intranet/empresa-supervisoras',
    'intranet/empresa-supervisoras/susp-canc',
    'intranet/solicitudes/atencion',
    'intranet/empresa-supervisoras/ver/',
    'intranet/empresa-supervisoras/suspender/',
    'intranet/empresa-supervisoras/cancelar/',
    'intranet/empresa-supervisoras/susp-canc/ver',
    'intranet/procesos/gestionPaces',
    // 'intranet/requerimientos',
    'intranet/requerimientos/informes/add',
    'intranet/requerimientos/documentos/evaluar',
    'intranet/requerimientos/invitaciones/send',
  ]},
  { ROL: { CODIGO: RolEnum.APROB_TEC }, MENU: [menu05,menu19,menu20], path: [
    'intranet/solicitudes/ver/',
    'intranet/solicitudes/aprobar/',
    'intranet/solicitudes/aprobacion',
    'intranet/procesos/aprobacionPaces',
    'intranet/procesos/aprobacionPacesGerencia',
            
  ]},
  { ROL: { CODIGO: RolEnum.APROB_ADM }, MENU: [menu05], path: [
    'intranet/solicitudes/ver/',
    'intranet/solicitudes/aprobar/',
    'intranet/solicitudes/aprobacion'
  ]},
  { ROL: { CODIGO: RolEnum.ADM_PROCE }, MENU: [menu08], path: [
    'intranet/procesos',
    'intranet/procesos/ver/',
    'intranet/procesos/registro',
    'intranet/procesos/editar',
    'intranet/procesos/propuesta-resumen/',
    'intranet/procesos/ver-postulante/'
  ]},
  { ROL: { CODIGO: RolEnum.ADM_BLOQU }, MENU: [menu11,menu12/*,menu13*/], path: [
    'intranet/liberar-personal',
    'intranet/gestion-usuarios'
  ]},
  { ROL: { CODIGO: RolEnum.ADM_CONFIG }, MENU: [menu15], path: [
    'intranet/gestion-configuraciones'
  ]},
  { ROL: { CODIGO: RolEnum.EVA_CONTRA }, MENU: [menu16, menu17], path: [
    'intranet/contratos',
    'intranet/bandeja-contratos',
    'intranet/requerimientos/documentos/revisar',
    'intranet/requerimientos/contratos/editar'
  ]},
  { ROL: { CODIGO: RolEnum.APROB_GPPM }, MENU: [], path: [

  ]},
  { ROL: { CODIGO: RolEnum.APROB_GSE }, MENU: [], path: [

  ]},
  { ROL: { CODIGO: RolEnum.INVITADO }, MENU: [], path: [

  ]},
  { ROL: { CODIGO: RolEnum.APROB_GAF }, MENU: [], path: [

  ]},
  { ROL: { CODIGO: RolEnum.JEFE_ULO }, MENU: [], path: [

  ]},
  { ROL: { CODIGO: RolEnum.ABOGADA_G2 }, MENU: [], path: [

  ]}
]
