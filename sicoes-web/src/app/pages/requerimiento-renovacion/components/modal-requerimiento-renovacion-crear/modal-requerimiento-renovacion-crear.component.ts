import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { OtroRequisito } from 'src/app/interface/otro-requisito.model';
import { OtroRequisitoService } from 'src/app/service/otro-requisito.service';
import { RequisitoService } from 'src/app/service/requisito.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { RequerimientoRenovacionService } from 'src/app/service/requerimiento-renovacion.service';

@Component({
  selector: 'vex-modal-requerimiento-renovacion-crear',
  templateUrl: './modal-requerimiento-renovacion-crear.component.html',
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ModalRequerimientoRenovacionCrearComponent extends BaseComponent implements OnInit, OnDestroy {

  requerimientoRenovacion: any;

  returnValue: any = false;
  formGroup: any;
  
  valueText = '';
  
  constructor(
    private dialogRef: MatDialogRef<ModalRequerimientoRenovacionCrearComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private requerimientoRenovacionService: RequerimientoRenovacionService
  ) {
    super();
    console.log("data",data);
    this.requerimientoRenovacion = data;
    this.formGroup = this.fb.group({
      observacion: ['', Validators.required],
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  closeModal() {
    this.dialogRef.close(this.returnValue);
  }

  validarForm() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched()
      return true;
    }
    return false;
  }

  guardar() {
    if (this.validarForm()) return;
    this.requerimientoRenovacion.evaluacion = this.formGroup.controls.observacion.getRawValue();
      functionsAlert.questionSiNoEval('¿Está seguro de crear requerimiento de renovación?',"Requerimiento renovación").then((result) => {
        if(result.isConfirmed){
          this.requerimientoRenovacion.tipoSector=this.requerimientoRenovacion.sector.codigo
          this.requerimientoRenovacion.tipoSubSector=this.requerimientoRenovacion.sector.codigo
          this.requerimientoRenovacion.deObservacion = this.formGroup.controls.observacion.value
          this.requerimientoRenovacionService.registrarRequerimientoRenovacion(this.requerimientoRenovacion).subscribe(res => {
            functionsAlert.success('Requerimiento de evaluacion Creado').then((result) => {
              // this.requisito = res;
              this.returnValue = res;
              this.closeModal();
            });
          });
        } else {
        }
      });
  }

}
