import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from '../components/base.component';

@Component({
  selector: 'vex-modal-req-documento-observacion',
  templateUrl: './modal-req-documento-observacion.component.html',
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ModalReqDocumentoObservacionComponent extends BaseComponent implements OnInit, OnDestroy {

  observacion: string;
  booleanView: boolean = false

  formGroup = this.fb.group({
    observacion: ['', Validators.required]
  });

  constructor(
    private dialogRef: MatDialogRef<ModalReqDocumentoObservacionComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
  ) {
    super();
    this.booleanView = data.accion == 'view';
    this.observacion = data?.observacion;

    if (this.booleanView) {
      this.formGroup.disable();
    }

    this.formGroup.controls.observacion.setValue(this.observacion || '');

  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  closeModal() {
    this.dialogRef.close();
  }

}
