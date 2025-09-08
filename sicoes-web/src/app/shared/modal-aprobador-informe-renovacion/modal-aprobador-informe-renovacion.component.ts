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
    private firmaDigitalService: FirmaDigitalService
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

        const totalInformes = this.data.elementosSeleccionados.length;
        let informesProcesados = 0;

        for (const informe of this.data.elementosSeleccionados) {
          let requestPayload: any;
          
          if (tipoAccion === 'APROBAR') {
            requestPayload = {
              idInformeRenovacion: informe.idInformeRenovacion,
              idUsuario: this.usuario?.idUsuario,
              observacion: this.observacionControl.value || ''
            };
          } else if (tipoAccion === 'RECHAZAR') {
            requestPayload = {
              idInformeRenovacion: informe.idInformeRenovacion,
              motivoRechazo: this.observacionControl.value || '',
              idUsuario: this.usuario?.idUsuario,
              observaciones: this.observacionControl.value || '',
              idGrupoAprobador: 3 // Grupo 3 as specified
            };
          }

          try {
            if (tipoAccion === 'APROBAR') {
              await firstValueFrom(
                this.informeRenovacionService.aprobarInformeRenovacion(requestPayload)
              );
            } else if (tipoAccion === 'RECHAZAR') {
              await firstValueFrom(
                this.informeRenovacionService.rechazarInformeRenovacion(requestPayload)
              );
            }

          } catch (error) {
            console.error(`Error al procesar el informe ${informe.numeroExpedienteR}:`, error);
            this.errores.push(informe.numeroExpedienteR);
          } finally {
            informesProcesados++;
            this.progreso = (informesProcesados / totalInformes) * 100;

            if (informesProcesados === totalInformes) {
              this.loadingAccion = false;

              if (this.errores.length > 0) {
                let errorMessage = 'Hubo errores al procesar los siguientes expedientes: ' + this.errores.join(', ');
                if (this.errores.length === totalInformes && totalInformes === 1) {
                  errorMessage = 'Error al procesar el expediente: ' + this.errores[0];
                }
                functionsAlert.error(errorMessage);
                this.dialogRef.close('OK');
              } else {
                functionsAlert.success('Acción completada con éxito.').then(() => {
                  if (tipoAccion === 'APROBAR') {
                    // Enviar notificación después de aprobar
                    this.enviarNotificacion(1); // ID para aprobación
                    this.activarFirmaDigital();
                  } else if (tipoAccion === 'RECHAZAR') {
                    // Enviar notificación después de rechazar
                    this.enviarNotificacion(2); // ID para rechazo
                    this.dialogRef.close('OK');
                  } else {
                    this.dialogRef.close('OK');
                  }
                });
              }
            }
          }
        }
      }
    });
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