import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { BaseComponent } from '../components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { firstValueFrom } from 'rxjs';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { AuthUser } from 'src/app/auth/store/auth.models';
import { SelectedPerfeccionamientoItem } from 'src/app/interface/contrato.model';
import { ContratoService } from 'src/app/service/contrato.service';

@Component({
  selector: 'app-modal-aprobador-contrato',
  templateUrl: './modal-aprobador-contrato.component.html',
  styleUrls: ['./modal-aprobador-contrato.component.scss']
})
export class ModalAprobadorContratoComponent extends BaseComponent implements OnInit {

  observacionControl = new FormControl('', [Validators.required, Validators.maxLength(500)]);

  progreso: number = 0;
  loadingAccion: boolean = false;
  errores: string[] = [];

  usuario$: any;
  usuario: AuthUser;

  constructor(
    private dialogRef: MatDialogRef<ModalAprobadorContratoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      elementosSeleccionados: SelectedPerfeccionamientoItem[];
    },
    private contratoService: ContratoService,
    private authFacade: AuthFacade
    // MatDialog ya no se inyecta aquí
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
    let msj = `¿Está seguro de que desea ${tipoAccion.toLowerCase()} los contratos seleccionados?`;

    if (this.validarObservacion()) {
      return;
    }

    functionsAlert.questionSiNo(msj).then(async (result) => {
      if (result.isConfirmed) {
        this.loadingAccion = true;
        this.progreso = 0;

        const totalContratos = this.data.elementosSeleccionados.length;
        let contratosProcesados = 0;

        for (const contrato of this.data.elementosSeleccionados) {
          const idsAfectados = [contrato.idContrato];

          const requestPayload = {
            ids: [ contrato.idContrato ],                // lista de IDs
            accion: tipoAccion,                          // "APROBAR" o "RECHAZAR"
            observacion: this.observacionControl.value   // texto de la observación
          };
          try {
            await firstValueFrom(
              this.contratoService.aprobarPerfeccionamientosMasivo(requestPayload)
            );

          } catch (error) {
            console.error(`Error al procesar el contrato ${contrato.numeroExpediente}:`, error);
            this.errores.push(contrato.numeroExpediente); // Añade el número de expediente que falló
          } finally {
            contratosProcesados++;
            this.progreso = (contratosProcesados / totalContratos) * 100;

            if (contratosProcesados === totalContratos) {
              this.loadingAccion = false;

              if (this.errores.length > 0) {
                let errorMessage = 'Hubo errores al procesar los siguientes expedientes: ' + this.errores.join(', ');
                if (this.errores.length === totalContratos && totalContratos === 1) {
                    errorMessage = 'Error al procesar el expediente: ' + this.errores[0];
                }
                functionsAlert.error(errorMessage);
              } else {
                functionsAlert.success('Acción masiva completada con éxito.');
              }

              // Cierra el modal, indicando que la operación ha finalizado (correcta o incorrectamente)
              // El componente padre (SolicitudListAprobacionComponent) deberá recargar la tabla
              this.dialogRef.close('OK');
            }
          }
        }
      }
    });
  }

  // ELIMINADO: Método activarFirmaDigitalContratos ya no está aquí.
}