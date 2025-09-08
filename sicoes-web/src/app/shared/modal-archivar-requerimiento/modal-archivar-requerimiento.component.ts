import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from '../components/base.component';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';
import { RequerimientoService } from 'src/app/service/requerimiento.service';

@Component({
  selector: 'vex-modal-archivar-requerimiento',
  templateUrl: './modal-archivar-requerimiento.component.html',
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ModalArchivarRequerimientoComponent extends BaseComponent {

  title: string;
  requerimientoUuid: string;
  
  formGroup = this.fb.group({
    deObservacion: ['', [Validators.required]],
  });


  constructor(
    private readonly dialogRef: MatDialogRef<ModalArchivarRequerimientoComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private readonly fb: FormBuilder,
    private readonly requerimientoService: RequerimientoService
  ) {
    super();
    this.title = data?.accion;
    this.requerimientoUuid = data?.uuid;
  }

  closeModal() {
    this.dialogRef.close();
  }

  accion(acc: string){
    if ( acc === 'GRABAR' ) {
      this.formGroup.markAllAsTouched();
      if (this.formGroup.invalid) {
        return;
      }
      functionsAlertMod2.preguntarSiNo('¿Seguro de archivar el requerimiento? ', 'Sí, archivar').then((result) => {
        if (result.isConfirmed) {
          this.archivar();
        }
      });
    } else {
      this.closeModal();
    }
    
  }

  archivar() {
    this.requerimientoService.archivar(this.requerimientoUuid, this.formGroup.value).subscribe({
      next: (res) => {
        if (res === null) {
          functionsAlertMod2.warningMensage('No se puede archivar el requerimiento');
        } else {
          functionsAlertMod2.success('Requerimiento Archivado').then((result) => {
            this.dialogRef.close(res);
          });
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
