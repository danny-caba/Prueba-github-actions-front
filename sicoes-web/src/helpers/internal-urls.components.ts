import { Injectable } from '@angular/core';

export enum Link {
    PRINCIPAL = 'principal',
    PERFECCIONAMIENTO_LIST = 'PERFECCIONAMIENTO_LIST',
    PERFECCIONAMIENTO_VIEW = 'PERFECCIONAMIENTO_VIEW',
    EXTRANET = 'extranet',
    LOGIN_SUNAT = 'login-sunat',
    LOGIN_EXTRANJERO = 'login-extranjero',
    REGISTRO_EMP_EXTRANJERA = 'registro-emp-extranjera',
    RECUPERAR_CONTRASENIA = 'recuperar-contrasenia',
    INTRANET = 'intranet',
    LOGIN_INTRANET = 'login-intranet',
    PUBLIC = 'public',
    REGISTRO_EMP = 'registro-emp',
    REGISTRO_EMP_SUSP_CANC = 'registro-emp-susp-canc',
    REGISTRO_PROCESO_SELECCION = 'proceso-seleccion',
    REGISTRO_PROCESO_SELECCION_DETALLE = 'detalle',

    SOLICITUDES_LIST = 'solicitudes',
    SOLICITUDES_LIST_PEND = 'pendientes',
    SOLICITUDES_LIST_ATENCION = 'atencion',
    SOLICITUDES_LIST_APROBACION = 'aprobacion',
    REGISTRO_LIST = 'registro',
    REGISTRO_LIST_SUSP_CANC = 'registro-susp-canc',

    PROCESOS_LIST = 'procesos',
    PROCESOS_ADD = 'registro',
    PROCESOS_EDIT = 'editar',
    PROCESOS_VIEW = 'ver',
    PROCESOS_ITEM_PRESENTAR = 'presentar',
    PROCESOS_PROPUESTA = 'propuesta',
    PROCESOS_PROPUESTA_RESUMEN = 'propuesta-resumen',
    PROCESO_VIEW_POSTULANTE = 'ver-postulante',
    PROCESO_BITACORA = 'bitacora',

    CONTRATOS_LIST = 'contratos',
    BANDEJA_CONTRATOS_LIST = 'bandeja-contratos',
    CONTRATO_SOLICITUD_EVALUAR = 'evaluar',
    
    INVITACIONES_LIST = 'invitaciones',

    FORMULACION_CONSULTAS = 'formulacion-consultas',

    LIBERAR_PERSONAL_LIST = 'liberar-personal',

    EMPRESA_SUPER_LIST = 'empresa-supervisoras',
    EMPRESA_SUPER_VIEW = 'ver',
    EMPRESA_SUPER_SUSPENDER = 'suspender',
    EMPRESA_SUPER_CANCELAR = 'cancelar',
    EMPRESA_SUPER_SUSPENDER_CANCELAR_LIST = 'susp-canc',
    EMPRESA_SUPER_SUSPENDER_CANCELAR_VIEW = 'ver',

    SOLICITUDES_OPCION = 'opciones',
    SOLICITUDES_ADD = 'registro',
    SOLICITUDES_PROCESAR = 'procesar',
    SOLICITUDES_APROBAR = 'aprobar',
    SOLICITUDES_EVALUAR = 'evaluar',
    SOLICITUDES_VIEW = 'ver',
    SOLICITUDES_EDIT = 'editar',
    SOLICITUDES_SUBSANAR = 'subsanar',
    SOLICITUDES_ACTUALIZAR = 'actualizar',
    SOLICITUDES_EDIT_MOD = 'modificar',

    GESTION_USUARIO='gestion-usuarios',
    GESTION_USUARIO_ADD ='registrar-usuario',
    GESTION_USUARIO_CONF_PERFIL ='configurar-perfil',

    GESTION_ASIGNACION='gestion-asignacion',

    SOLICITUDES_LIST_APROBACION_PACES = 'aprobacionPaces',

    GESTION_CONFIGURACION='gestion-configuraciones',

    CONTRATO_SOLICITUD_ADD = 'registro',
    CONTRATO_SOLICITUD_VIEW = 'ver',

    //REQUERIMIENTOS
    REQUERIMIENTOS_LIST = 'requerimientos',
    REQUERIMIENTOS_INFORME = 'informes',
    INFORME_ADD = 'add',
    REQUERIMIENTOS_INVITACION = 'invitaciones',
    INVITACION_SEND = 'send',
}

export enum Apis {
    LST_OFICINA_REGISTRAL   = 'api/maestros/oficina-registral',
}

@Injectable({
    providedIn: 'root'
})

export class InternalUrls {
    link = Link;
    apis = Apis;

    getPath(value){
        return '/' + value;
    }
}