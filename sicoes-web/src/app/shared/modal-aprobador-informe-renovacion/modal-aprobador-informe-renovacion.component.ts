import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { BaseComponent } from '../components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { firstValueFrom } from 'rxjs';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { AuthUser } from 'src/app/auth/store/auth.models';
import { InformeRenovacionService } from 'src/app/service/informe-renovacion.service';
import { FirmaDigitalService } from 'src/app/service/firma-digital.service';
import { SolicitudService } from 'src/app/service/solicitud.service';

@Component({
  selector: 'app-modal-aprobador-informe-renovacion',
  templateUrl: './modal-aprobador-informe-renovacion.component.html',
  styleUrls: ['./modal-aprobador-informe-renovacion.component.scss']
})
export class ModalAprobadorInformeRenovacionComponent extends BaseComponent implements OnInit {

  observacionControl = new FormControl('', [Validators.required, Validators.maxLength(500)]);

  progreso: number = 0;
  loadingAccion: boolean = false;
  errores: string[] = [];

  usuario$: any;
  usuario: AuthUser;
  archivoSeleccionado: File | null = null;

  constructor(
    private dialogRef: MatDialogRef<ModalAprobadorInformeRenovacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      tipo: string;
      accion: string;
      elementosSeleccionados: any[];
    },
    private informeRenovacionService: InformeRenovacionService,
    private authFacade: AuthFacade,
    private firmaDigitalService: FirmaDigitalService,
    private solicitudService: SolicitudService
  ) {
    super();
  }

  ngOnInit(): void {
    this.usuario$ = this.authFacade.user$;
    this.usuario$.subscribe(usu => {
      this.usuario = usu;
    });

    if (this.data.elementosSeleccionados.length === 0) {
      this.observacionControl.disable();
    }
  }

  cancelar(): void {
    this.dialogRef.close('cancel');
  }

  validarObservacion(): boolean {
    if (!this.observacionControl.valid) {
      this.observacionControl.markAsTouched();
      return true;
    }
    return false;
  }
  async adjuntarArchivo (): Promise<void> {

    console.log("adjuntarArchivo");
  }

  onFileSelectedPersonal(ev: any): void {
    const file = ev.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('tipoRequisito', 'name');

  }
  descargar(): void {
    console.log('Descargando archivo:');
  }
  eliminarPersonalDoc(): void {
    console.log('Eliminando archivo:');
  }

  async realizarAccion(tipoAccion: string): Promise<void> {
    this.errores = [];
    let msj = `¿Está seguro de que desea ${tipoAccion.toLowerCase()} los informes de renovación seleccionados?`;

    if (tipoAccion === 'RECHAZAR' && this.validarObservacion()) {
      return;
    }

    functionsAlert.questionSiNo(msj).then(async (result) => {
      if (result.isConfirmed) {
        this.loadingAccion = true;
        this.progreso = 0;

        try {
          if (tipoAccion === 'APROBAR') {
            // Usar el nuevo endpoint de aprobación masiva
            const idRequerimientosAprobacion = this.data.elementosSeleccionados.map(informe => 
              informe.idRequermientoAprobacion || informe.idInformeRenovacion
            );

            const requestPayload = {
              idRequerimientosAprobacion: idRequerimientosAprobacion,
              observaciones: this.observacionControl.value || 'Aprobación masiva de informes de renovación'
            };

            await firstValueFrom(
              this.solicitudService.aprobarInformesRenovacionBandeja(requestPayload)
            );

            this.progreso = 100;
            functionsAlert.success('Los informes han sido aprobados exitosamente.').then(() => {
              this.enviarNotificacion(1); // ID para aprobación
              this.activarFirmaDigital();
            });

          } else if (tipoAccion === 'RECHAZAR') {
            // Para rechazar, continuar con el proceso individual por ahora
            const totalInformes = this.data.elementosSeleccionados.length;
            let informesProcesados = 0;

            for (const informe of this.data.elementosSeleccionados) {
              const requestPayload = {
                idInformeRenovacion: informe.idInformeRenovacion,
                motivoRechazo: this.observacionControl.value || '',
                idUsuario: this.usuario?.idUsuario,
                observaciones: this.observacionControl.value || '',
                idGrupoAprobador: 3
              };

              try {
                await firstValueFrom(
                  this.informeRenovacionService.rechazarInformeRenovacion(requestPayload)
                );
              } catch (error) {
                console.error(`Error al rechazar el informe ${informe.numeroExpedienteR}:`, error);
                this.errores.push(informe.numeroExpedienteR);
              }

              informesProcesados++;
              this.progreso = Math.round((informesProcesados / totalInformes) * 100);
            }

            this.finalizarProceso(tipoAccion);
          }

        } catch (error: any) {
          console.error('Error al procesar informes:', error);
          
          // Manejar errores de validación del backend
          if (error?.error?.meta?.mensajes) {
            const mensajesError = error.error.meta.mensajes
              .filter(m => m.tipo === 'ERROR')
              .map(m => m.message)
              .join('\n');
            functionsAlert.error(mensajesError || 'Error al procesar los informes');
          } else {
            functionsAlert.error('Error al procesar los informes. Por favor, intente nuevamente.');
          }
          
          this.loadingAccion = false;
        }
      }
    });
  }

  private finalizarProceso(tipoAccion: string): void {
    this.loadingAccion = false;

    if (this.errores.length > 0) {
      let errorMessage = 'Hubo errores al procesar los siguientes expedientes: ' + this.errores.join(', ');
      if (this.errores.length === this.data.elementosSeleccionados.length && this.data.elementosSeleccionados.length === 1) {
        errorMessage = 'Error al procesar el expediente: ' + this.errores[0];
      }
      functionsAlert.error(errorMessage);
      this.dialogRef.close('OK');
    } else {
      functionsAlert.success('Acción completada con éxito.').then(() => {
        if (tipoAccion === 'RECHAZAR') {
          this.enviarNotificacion(2); // ID para rechazo
        }
        this.dialogRef.close('OK');
      });
    }
  }

  private async activarFirmaDigital(): Promise<void> {
    try {
      const result = await this.firmaDigitalService.firmarInformesRenovacion(
        this.data.elementosSeleccionados
      );
      
      result.subscribe({
        next: (resultado) => {
          if (resultado === 'success') {
            console.log('Firma digital completada exitosamente');
          }
          this.dialogRef.close('OK');
        },
        error: (error) => {
          console.error('Error en firma digital:', error);
          functionsAlert.info('La aprobación se completó, pero hubo un problema con la firma digital.');
          this.dialogRef.close('OK');
        }
      });
    } catch (error) {
      console.error('Error iniciando firma digital:', error);
      functionsAlert.info('La aprobación se completó, pero no se pudo iniciar la firma digital: ' + error.message);
      this.dialogRef.close('OK');
    }
  }

  private enviarNotificacion(idTipoNotifica: number): void {
    this.informeRenovacionService.notificarRenovacionInforme(idTipoNotifica).subscribe({
      next: (response) => {
        console.log('Notificación enviada exitosamente:', response);
      },
      error: (error) => {
        console.error('Error al enviar notificación:', error);
        // No mostramos error al usuario ya que es un proceso secundario
      }
    });
  }

  async solicitarPerfeccionamientoContrato(): Promise<void> {
    if (this.data.elementosSeleccionados.length === 0) {
      functionsAlert.info('Debe seleccionar al menos un informe para procesar la solicitud.');
      return;
    }

    const mensajeConfirmacion = '¿Está seguro de que desea generar la solicitud de perfeccionamiento de contrato?';

    functionsAlert.questionSiNo(mensajeConfirmacion).then(async (result) => {
      if (result.isConfirmed) {
        this.loadingAccion = true;

        try {
          const requestPayload = {
            informesIds: this.data.elementosSeleccionados.map(informe => informe.idInformeRenovacion),
            idUsuario: this.usuario?.idUsuario,
            observacion: this.observacionControl.value || '',
            fechaSolicitud: new Date().toISOString()
          };

          await firstValueFrom(
            this.informeRenovacionService.solicitudPerfeccionamientoContrato(requestPayload)
          );

          this.loadingAccion = false;
          functionsAlert.success('Solicitud de perfeccionamiento de contrato generada exitosamente.').then(() => {
            // Enviar notificación específica para perfeccionamiento de contrato
            this.enviarNotificacion(3); // ID para perfeccionamiento de contrato
            this.dialogRef.close('OK');
          });

        } catch (error) {
          this.loadingAccion = false;
          console.error('Error al generar solicitud de perfeccionamiento:', error);
          
          let mensajeError = 'Error al generar la solicitud de perfeccionamiento de contrato.';
          if (error?.error?.message) {
            mensajeError = error.error.message;
          }
          
          functionsAlert.error(mensajeError);
        }
      }
    });
  }
}