import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ConfigService } from '../core/services';
import { EvaluadorService } from './evaluador.service';
import { InformeRenovacionService } from './informe-renovacion.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalFirmaDigitalEnhancedComponent, ParametrosFirma, ArchivoFirma } from '../shared/modal-firma-digital-enhanced/modal-firma-digital-enhanced.component';

export interface ResultadoFirmaDigital {
  exitoso: boolean;
  archivos: any[];
  errores: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FirmaDigitalService {

  private _path_serve: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private evaluadorService: EvaluadorService,
    private informeRenovacionService: InformeRenovacionService,
    private dialog: MatDialog
  ) {
    this._path_serve = this.configService.getAPIUrl();
  }

  /**
   * Inicia el proceso de firma digital para una lista de números de expediente
   */
  async firmarExpedientes(numerosExpediente: string[]): Promise<Observable<any>> {
    try {
      // 1. Obtener parámetros de firma digital
      const parametros = await this.obtenerParametrosFirma();
      
      // 2. Obtener IDs de archivos para cada expediente
      const archivos = await this.obtenerArchivosParaFirmar(numerosExpediente);
      
      // 3. Filtrar solo archivos válidos
      const archivosValidos = archivos.filter(archivo => archivo.id !== '0' && archivo.id !== null);
      
      if (archivosValidos.length === 0) {
        throw new Error('No se encontraron archivos válidos para firmar.');
      }

      // 4. Abrir modal de firma digital
      return this.abrirModalFirma(archivosValidos, parametros);
      
    } catch (error) {
      console.error('Error en proceso de firma digital:', error);
      throw error;
    }
  }

  /**
   * Inicia el proceso de firma digital para informes de renovación
   */
  async firmarInformesRenovacion(informes: any[]): Promise<Observable<any>> {
    try {
      // 1. Obtener parámetros de firma digital generales
      const parametros = await this.obtenerParametrosFirmaGeneral();
      
      // 2. Obtener IDs de archivos para cada informe
      const archivos = await this.obtenerArchivosInformesRenovacion(informes);
      
      // 3. Filtrar solo archivos válidos
      const archivosValidos = archivos.filter(archivo => archivo.id !== '0' && archivo.id !== null);
      
      if (archivosValidos.length === 0) {
        throw new Error('No se encontraron archivos válidos para firmar.');
      }

      // 4. Abrir modal de firma digital
      return this.abrirModalFirma(archivosValidos, parametros);
      
    } catch (error) {
      console.error('Error en proceso de firma digital para informes:', error);
      throw error;
    }
  }

  /**
   * Obtiene los parámetros necesarios para la firma digital
   */
  private async obtenerParametrosFirma(): Promise<ParametrosFirma> {
    const token = {
      usuario: sessionStorage.getItem("USUARIO")
    };
    
    return new Promise((resolve, reject) => {
      this.evaluadorService.obtenerParametrosfirmaDigital(token).subscribe({
        next: (parametros) => {
          if (parametros && parametros.action) {
            resolve(parametros);
          } else {
            reject(new Error('No se pudieron obtener los parámetros de firma digital'));
          }
        },
        error: (error) => {
          reject(new Error('Error al obtener parámetros de firma digital: ' + error.message));
        }
      });
    });
  }

  /**
   * Obtiene los parámetros generales para firma digital usando el endpoint de asignaciones
   */
  private async obtenerParametrosFirmaGeneral(): Promise<ParametrosFirma> {
    const token = {
      usuario: sessionStorage.getItem("USUARIO")
    };
    
    return new Promise((resolve, reject) => {
      this.evaluadorService.obtenerParametrosfirmaDigital(token).subscribe({
        next: (parametros) => {
          if (parametros && parametros.action) {
            resolve(parametros);
          } else {
            reject(new Error('No se pudieron obtener los parámetros de firma digital'));
          }
        },
        error: (error) => {
          reject(new Error('Error al obtener parámetros de firma digital: ' + error.message));
        }
      });
    });
  }

  /**
   * Obtiene los IDs de archivos para los expedientes dados
   */
  private async obtenerArchivosParaFirmar(numerosExpediente: string[]): Promise<ArchivoFirma[]> {
    const observables = numerosExpediente.map(numeroExpediente => 
      this.evaluadorService.obtenerIdArchivo(numeroExpediente).pipe(
        map(idArchivo => ({
          id: idArchivo.toString(),
          nombre: `Expediente ${numeroExpediente}`
        })),
        catchError(error => {
          console.error(`Error obteniendo archivo para expediente ${numeroExpediente}:`, error);
          return of({ id: '0', nombre: `Expediente ${numeroExpediente}` });
        })
      )
    );

    return new Promise((resolve, reject) => {
      forkJoin(observables).subscribe({
        next: (archivos) => resolve(archivos),
        error: (error) => reject(error)
      });
    });
  }

  /**
   * Obtiene los IDs de archivos para los informes de renovación dados
   */
  private async obtenerArchivosInformesRenovacion(informes: any[]): Promise<ArchivoFirma[]> {
    const observables = informes.map(informe => 
      this.informeRenovacionService.obtenerParametrosFirmaDigital(informe.idInformeRenovacion).pipe(
        map(response => ({
          id: response.data?.[0]?.firmaDigital?.idArchivo?.toString() || informe.idInformeRenovacion.toString(),
          nombre: `Informe ${informe.numeroExpedienteR || informe.empresaSupervisoraR}`
        })),
        catchError(error => {
          console.error(`Error obteniendo parámetros de firma para informe ${informe.idInformeRenovacion}:`, error);
          return of({ 
            id: informe.idInformeRenovacion.toString(), 
            nombre: `Informe ${informe.numeroExpedienteR || informe.empresaSupervisoraR}` 
          });
        })
      )
    );

    return new Promise((resolve, reject) => {
      forkJoin(observables).subscribe({
        next: (archivos) => resolve(archivos),
        error: (error) => reject(error)
      });
    });
  }

  /**
   * Abre el modal de firma digital mejorado
   */
  private abrirModalFirma(archivos: ArchivoFirma[], parametros: ParametrosFirma): Observable<any> {
    const dialogRef = this.dialog.open(ModalFirmaDigitalEnhancedComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: true,
      data: {
        archivos: archivos,
        parametros: parametros
      }
    });

    return dialogRef.afterClosed();
  }

  /**
   * Método de utilidad para validar si un archivo es válido para firmar
   */
  private esArchivoValido(idArchivo: string): boolean {
    return idArchivo && idArchivo !== '0' && idArchivo !== 'null' && idArchivo !== 'undefined';
  }
}