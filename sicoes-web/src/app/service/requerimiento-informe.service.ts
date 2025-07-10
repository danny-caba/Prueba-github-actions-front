import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RequerimientoService } from './requerimiento.service';
import { Requerimiento, RequerimientoInformeDetalle } from '../interface/requerimiento.model';
import { RequerimientoInforme } from '../interface/requerimiento.model';

export interface InformeValidationResult {
  isValid: boolean;
  errors: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RequerimientoInformeService {

  constructor(private requerimientoService: RequerimientoService) {}

  /**
   * Valida los datos del informe antes del envío
   * @param formData - Datos del formulario a validar
   * @returns Resultado de la validación con errores específicos
   */
  validateInformeData(formData: any): InformeValidationResult {
    const errors: string[] = [];

    if (!formData) {
      errors.push('No se proporcionaron datos del informe');
      return { isValid: false, errors };
    }

    // Validar campos requeridos
    const requiredFields = [
      'objetivo',
      'perfilRequerido', 
      'plazoEjecucion',
      'costoServicio',
      'penalidades',
      'tipoSeguro',
      'disponibilidadPresupuestal',
      'declaracionJurada'
    ];

    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        errors.push(`El campo "${this.getFieldDisplayName(field)}" es requerido`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Construye el objeto RequerimientoInformeDetalle
   * @param requerimientoUuid - UUID del requerimiento
   * @param formData - Datos del formulario
   * @returns Objeto RequerimientoInformeDetalle construido
   */
  buildRequerimientoInformeDetalle(
    requerimientoUuid: string, 
    formData: any
  ): RequerimientoInformeDetalle {
    const requerimiento = new Requerimiento();
    requerimiento.requerimientoUuid = requerimientoUuid;

    const requerimientoInforme = new RequerimientoInforme();
    requerimientoInforme.requerimiento = requerimiento;

    return {
      requerimientoInforme,
      ...formData
    };
  }

  /**
   * @param requerimientoInformeDetalle - Detalle del informe a enviar
   * @returns Observable con la respuesta del servidor
   */
  enviarInforme(requerimientoInformeDetalle: RequerimientoInformeDetalle): Observable<any> {
    return this.requerimientoService.enviarInforme(requerimientoInformeDetalle)
      .pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          console.error('Error en RequerimientoInformeService:', error);
          return throwError(() => this.handleServiceError(error));
        })
      );
  }

  /**
   * Obtiene el nombre de visualización para un campo
   * @param field - Nombre del campo
   * @returns Nombre de visualización del campo
   */
  private getFieldDisplayName(field: string): string {
    const fieldNames: { [key: string]: string } = {
      'objetivo': 'Objetivo',
      'perfilRequerido': 'Perfil Requerido',
      'plazoEjecucion': 'Plazo de Ejecución',
      'costoServicio': 'Costo del Servicio',
      'penalidades': 'Penalidades',
      'tipoSeguro': 'Tipo de Seguro',
      'disponibilidadPresupuestal': 'Disponibilidad Presupuestal',
      'declaracionJurada': 'Declaración Jurada'
    };
    return fieldNames[field] || field;
  }
  
  /**
   * Maneja errores del servicio
   * @param error - Error original
   * @returns Error procesado
   */
  private handleServiceError(error: any): any {
    // Aquí puedes agregar lógica adicional para el manejo de errores
    // Por ejemplo, logging, notificaciones, etc.
    return error;
  }
}
