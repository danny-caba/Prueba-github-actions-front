import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ConfigService } from '../core/services';
import { EvaluadorService } from './evaluador.service';
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
      // 1. Obtener parámetros de firma digital
      const parametros = await this.obtenerParametrosFirma();
      
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
    // Esta función necesitará implementarse según la lógica específica para informes de renovación
    // Por ahora, simular la obtención de IDs de archivo
    const archivos: ArchivoFirma[] = [];
    
    for (const informe of informes) {
      try {
        // Aquí debería ir la lógica específica para obtener el ID del archivo del informe
        // Por ejemplo: this.informeRenovacionService.obtenerIdArchivo(informe.idInformeRenovacion)
        
        archivos.push({
          id: informe.idInformeRenovacion.toString(), // Placeholder
          nombre: `Informe ${informe.numeroExpedienteR || informe.empresaSupervisoraR}`
        });
      } catch (error) {
        console.error(`Error obteniendo archivo para informe ${informe.idInformeRenovacion}:`, error);
      }
    }
    
    return archivos;
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