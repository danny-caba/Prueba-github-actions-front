import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from '../components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { OtroRequisito } from 'src/app/interface/otro-requisito.model';
import { OtroRequisitoService } from 'src/app/service/otro-requisito.service';
import { RequisitoService } from 'src/app/service/requisito.service';

@Component({
  selector: 'vex-modal-evaluacion-contrato-observacion',
  templateUrl: './modal-evaluacion-contrato-observacion.component.html',
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ModalEvaluacionContratoObservacionComponent extends BaseComponent implements OnInit, OnDestroy {

  requisito: any;

  booleanAdd: boolean
  booleanEdit: boolean
  booleanView: boolean = false
  esPersonal: boolean;
  returnValue: any = false;

  formGroup = this.fb.group({
    observacion: ['', Validators.required]
  });

  valueText = '';

  constructor(
    private dialogRef: MatDialogRef<ModalEvaluacionContratoObservacionComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private requisitoService: RequisitoService
  ) {
    super();
    this.requisito = data?.requisito;
    this.booleanAdd = data.accion == 'add';
    this.booleanEdit = data.accion == 'edit';
    this.booleanView = data.accion == 'view';
    this.esPersonal = data.esPersonal;

    if (this.booleanView) {
      this.formGroup.disable();
    }
    
    if(this.requisito.evaluacion){
      this.formGroup.controls.observacion.setValue(this.requisito.evaluacion);
    }else{
      this.formGroup.controls.observacion.setValue(this.valueText);
    }

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

    this.requisito.evaluacion = this.formGroup.controls.observacion.getRawValue();

    if (!this.esPersonal) {
      functionsAlert.questionSiNoEval('¿Está seguro de querer finalizar la revisión de requisitos del formulario de perfeccionamiento del contrato?').then((result) => {
        if(result.isConfirmed){
          this.requisitoService.evaluarRequisito(this.requisito).subscribe(res => {
            functionsAlert.success('Requisito Evaluado').then((result) => {
              // this.requisito = res;
              this.returnValue = res;
              this.closeModal();
            });
          });
        } else {
        }
      });
    } else {
      functionsAlert.questionSiNoEval('¿Está seguro de querer finalizar la revisión de requisitos del formulario de perfeccionamiento del contrato?').then((result) => {
        if(result.isConfirmed){
          this.requisitoService.evaluarRequisitoPersonal(this.requisito).subscribe(res => {
            functionsAlert.success('Requisito Evaluado').then((result) => {
              // this.requisito = res;
              this.returnValue = res;
              this.closeModal();
            });
          });
        }
      });
    }

  }

}
