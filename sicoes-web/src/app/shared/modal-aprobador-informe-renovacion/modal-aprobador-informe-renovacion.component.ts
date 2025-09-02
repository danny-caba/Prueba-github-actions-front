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
          const requestPayload = {
            idInformeRenovacion: informe.idInformeRenovacion,
            accion: tipoAccion,
            observacion: this.observacionControl.value || ''
          };

          try {
            await firstValueFrom(
              this.informeRenovacionService.aprobarInformeRenovacion(requestPayload)
            );

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
                    this.activarFirmaDigital();
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
}