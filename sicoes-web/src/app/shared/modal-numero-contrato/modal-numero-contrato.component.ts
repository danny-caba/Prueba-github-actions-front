import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AprobadorAccion } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { BaseComponent } from '../components/base.component';
import { RequerimientoService } from 'src/app/service/requerimiento.service';
import { Requerimiento } from 'src/app/interface/requerimiento.model';

@Component({
  selector: 'vex-modal-numero-contrato',
  templateUrl: './modal-numero-contrato.component.html'
})
export class ModalNumeroContratoComponent extends BaseComponent {
  AprobadorAccion = AprobadorAccion
  listaSolicitudUuidSeleccionado = []
  errores: { uuid: string; error: any }[] = [];
  
  requerimiento: Requerimiento;

  formGroup = this.fb.group({
    numeroContrato: ['', [Validators.required, Validators.maxLength(10)]]
  });

  constructor(
    private readonly dialogRef: MatDialogRef<ModalNumeroContratoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { requerimiento: Requerimiento },
    private readonly fb: FormBuilder,
    private readonly requerimientoService: RequerimientoService,
  ) {
    super();
    this.requerimiento = data.requerimiento;
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
      const { idRequerimiento } = this.requerimiento;

      if (result.isConfirmed) {
        const payload = {
          requerimiento: { idRequerimiento },
          numeroContrato: this.formGroup.value.numeroContrato
        };

        this.requerimientoService.registrarContrato(payload).subscribe({
          next: () => {
            functionsAlert.success('Número de contrato actualizado correctamente.');
            this.dialogRef.close(true);
          },
          error: () => {
            console.error('Error al registrar el número de contrato.');
          }
        })

      }
    });
  }
}
