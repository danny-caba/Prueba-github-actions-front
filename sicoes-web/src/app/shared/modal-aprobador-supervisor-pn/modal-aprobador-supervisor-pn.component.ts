import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { EvaluadorService } from 'src/app/service/evaluador.service';
import { AprobadorAccion } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { BaseComponent } from '../components/base.component';

@Component({
  selector: 'vex-modal-aprobador-supervisor-pn',
  templateUrl: './modal-aprobador-supervisor-pn.component.html',
  styleUrls: ['./modal-aprobador-supervisor-pn.component.scss']
})
export class ModalAprobadorSupervisorPnComponent extends BaseComponent {
  AprobadorAccion = AprobadorAccion
  listaSolicitudUuidSeleccionado = []
  errores: { uuid: string; error: any }[] = [];

  formGroup = this.fb.group({
    observacion: [null]
  });

  constructor(
    private dialogRef: MatDialogRef<ModalAprobadorSupervisorPnComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private evaluadorService: EvaluadorService,
    private authFacade: AuthFacade,
    private dialog: MatDialog
  ) {
    super();
    this.listaSolicitudUuidSeleccionado = data.listaSolicitudUuidSeleccionado;
  }

  closeModal() {
    this.dialogRef.close(false);
  }

  validarForm() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched()
      return true;
    }
    return false;
  }

  aprobadores: Observable<any>

  guardar(tipo) {

    this.errores = [];

    let msj = '¿Está seguro de que desea aprobar la evaluación?'

    if (tipo == 'RECHAZADO') {
      msj = '¿Está seguro de que desea rechazar la evaluación?';
      if (this.validarForm()) return;
    }

    functionsAlert.questionSiNo(msj).then(async (result) => {

      if (result.isConfirmed) {


        for (const item of this.listaSolicitudUuidSeleccionado) {
          const payload = {
            estado: {
              idListadoDetalle: item.tipo.idListadoDetalle,
              codigo: msj
            },
            nuSiaf: '0023584512',
            deObservacion: this.formGroup.get('observacion')?.value,
            rol: 'GSE'
          };

          try {
            await this.evaluadorService.requerimientosAprobar(item.requerimiento.requerimientoUuid, payload).toPromise();
          } catch (error) {
            this.errores.push({
              uuid: item.requerimiento.requerimientoUuid,
              error: error?.message || error
            });
          }
        }
        functionsAlert.success('Acción masiva completada con éxito.');
        this.dialogRef.close(true);
      }
    });
  }
}
