import { Requerimiento } from "src/app/interface/requerimiento.model";
import { EstadoRequerimientoEnum } from "./constantes.components";

export const REQUERIMIENTO_INFORME_CONSTANTS = {
  MESSAGES: {
    CONFIRMATION: '¿Seguro de Enviar el Informe para firmas?',
    SUCCESS: 'El informe ha sido registrado exitosamente',
    ERROR_NO_REQUERIMIENTO: 'Error: No se encontró el requerimiento',
    ERROR_NO_DATA: 'Error: No se pudieron obtener los datos del informe',
    ERROR_UNEXPECTED: 'Error inesperado durante el envío del informe',
    VALIDATION_ERRORS: 'Errores de validación:'
  },
  
  VALIDATION: {
    REQUIRED_FIELDS: [
      'objetivo',
      'perfilRequerido', 
      'plazoEjecucion',
      'costoServicio',
      'penalidades',
      'tipoSeguro',
      'disponibilidadPresupuestal',
      'declaracionJurada'
    ],
    
    FIELD_DISPLAY_NAMES: {
      'objetivo': 'Objetivo',
      'perfilRequerido': 'Perfil Requerido',
      'plazoEjecucion': 'Plazo de Ejecución',
      'costoServicio': 'Costo del Servicio',
      'terminoServicio': 'Términos del Servicio',
      'entregables': 'Entregables',
      'penalidades': 'Penalidades',
      'tipoSeguro': 'Tipo de Seguro',
      'disponibilidadPresupuestal': 'Disponibilidad Presupuestal',
      'declaracionJurada': 'Declaración Jurada'
    }
  },
  
  ROUTES: {
    CANCEL: ['intranet', 'solicitudes'],
    SUCCESS: ['intranet', 'solicitudes', 'atencion']
  },
  
  QUERY_PARAMS: {
    TAB: 'requerimientos'
  }
} as const; 

export const REQUERIMIENTO_CONSTANTS = {

  // Validaciones de estado de requerimiento
  ESTADO_VALIDACIONES: {
    [EstadoRequerimientoEnum.PRELIMINAR]: (req: Requerimiento) => req.estado?.codigo === EstadoRequerimientoEnum.PRELIMINAR,
    [EstadoRequerimientoEnum.EN_PROCESO]: (req: Requerimiento) => req.estado?.codigo === EstadoRequerimientoEnum.EN_PROCESO
  },
  ESTADOS_CON_ACCIONES: [
    EstadoRequerimientoEnum.PRELIMINAR,
    EstadoRequerimientoEnum.EN_PROCESO
  ],

  // Columnas de lista de requerimientos
  COLUMNAS_LISTA_REQUERIMIENTOS: [
    'expediente',
    'fechaRegistro',
    'division',
    'perfil',
    'nombresApellidos',
    'estado',
    'acciones'
  ]
} as const; 