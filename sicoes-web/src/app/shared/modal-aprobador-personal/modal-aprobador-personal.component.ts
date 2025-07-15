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
import { UsuariosRoles } from 'src/helpers/constantes.components';

@Component({
  selector: 'app-modal-aprobador-personal',
  templateUrl: './modal-aprobador-personal.component.html',
  styleUrls: ['./modal-aprobador-personal.component.scss']
})
export class ModalAprobadorPersonalComponent extends BaseComponent implements OnInit {

  observacion = new FormControl('', [Validators.maxLength(500)]);

  progreso: number = 0;
  loadingAccion: boolean = false;
  errores: string[] = [];

  usuario$: any;
  usuario: AuthUser;
  accion:any;
  roles=UsuariosRoles

  constructor(
    private dialogRef: MatDialogRef<ModalAprobadorPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      accion:any;
      elementosSeleccionados: SelectedPerfeccionamientoItem[];
    },
    private contratoService: ContratoService,
    private authFacade: AuthFacade
    // MatDialog ya no se inyecta aquí
  ) {
    super();
  }

  ngOnInit(): void {
    console.log("dataaaaa",this.data);
    this.accion=this.data.accion[0]
    this.usuario$ = this.authFacade.user$;
    this.usuario$.subscribe(usu => {
      this.usuario = usu;
    });

   /* if (this.data.elementosSeleccionados.length === 0) {
      this.observacion.disable();
    }*/
  }

  cancelar(): void {
    this.dialogRef.close('cancel');
  }

  validarObservacion(): boolean {
    if (!this.observacion.valid) {
      this.observacion.markAsTouched();
      return true;
    }
    return false;
  }

  async realizarAccion(tipoAccion: string): Promise<void> {

    this.errores = [];
    let msj = `¿Está seguro de que desea ${tipoAccion.toLowerCase()} la evaluación?`;

    if (this.validarObservacion()) {
      return;
    }

    functionsAlert.questionSiNo(msj).then(async (result) => {
      if (result.isConfirmed) {
        /*this.loadingAccion = true;
        this.progreso = 0;

        const totalContratos = this.data.elementosSeleccionados.length;
        let contratosProcesados = 0;

        for (const contrato of this.data.elementosSeleccionados) {
          const idsAfectados = [contrato.idContrato];

          const requestPayload = {
            ids: [ contrato.idContrato ],                // lista de IDs
            accion: tipoAccion,                          // "APROBAR" o "RECHAZAR"
            observacion: this.observacion.value   // texto de la observación
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
        }*/
      }
    });
  }

}