import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from '../components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { OtroRequisito } from 'src/app/interface/otro-requisito.model';
import { OtroRequisitoService } from 'src/app/service/otro-requisito.service';

@Component({
  selector: 'vex-modal-otro-requisito-observacion',
  templateUrl: './modal-otro-requisito-observacion.component.html',
  styleUrls: ['./modal-otro-requisito-observacion.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ModalOtroRequisitoObservacionComponent extends BaseComponent implements OnInit, OnDestroy {

  otroRequisito: OtroRequisito

  booleanAdd: boolean
  booleanEdit: boolean
  booleanView: boolean = false

  formGroup = this.fb.group({
    observacion: ['', Validators.required]
  });

  valueText = '';

  constructor(
    private dialogRef: MatDialogRef<ModalOtroRequisitoObservacionComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private otroRequisitoService: OtroRequisitoService
  ) {
    super();
    this.otroRequisito = data?.otroRequisito;
    this.booleanAdd = data.accion == 'add';
    this.booleanEdit = data.accion == 'edit';
    this.booleanView = data.accion == 'view';

    if (this.booleanView) {
      this.formGroup.disable();
    }

    //this.formGroup.patchValue(this.otroRequisito)
    console.info(this.otroRequisito)
    console.info(this.otroRequisito.observacion)
    if(this.otroRequisito.observacion){
      this.formGroup.controls.observacion.setValue(this.otroRequisito.observacion);
    }else{
      this.formGroup.controls.observacion.setValue(this.valueText);
    }

  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  closeModal() {
    this.dialogRef.close();
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

    this.otroRequisito.observacion = this.formGroup.controls.observacion.getRawValue();

    this.otroRequisitoService.evaluarOtroRequisito(this.otroRequisito).subscribe(res => {
      functionsAlert.success('Observación Registrada').then((result) => {
        this.closeModal()
      });
    });
  }

}
