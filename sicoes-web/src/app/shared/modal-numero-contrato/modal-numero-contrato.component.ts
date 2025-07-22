import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { EvaluadorService } from 'src/app/service/evaluador.service';
import { AprobadorAccion } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { BaseComponent } from '../components/base.component';

@Component({
  selector: 'vex-modal-numero-contrato',
  templateUrl: './modal-numero-contrato.component.html',
  styleUrls: ['./modal-numero-contrato.component.scss']
})
export class ModalNumeroContratoComponent extends BaseComponent {
  AprobadorAccion = AprobadorAccion
  listaSolicitudUuidSeleccionado = []
  errores: { uuid: string; error: any }[] = [];

  formGroup = this.fb.group({
    numeroContrato: ['', [Validators.required, Validators.maxLength(10)]]
  });

  constructor(
    private dialogRef: MatDialogRef<ModalNumeroContratoComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
  ) {
    super();
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

  guardar() {


    functionsAlert.questionSiNo('¿Está seguro de actualizar el número de contrato?').then(async (result) => {

      if (result.isConfirmed) {


        functionsAlert.success('Número de contrato actualizado correctamente.');
        this.dialogRef.close(true);
      }
    });
  }
}
