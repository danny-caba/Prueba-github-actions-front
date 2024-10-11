import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from '../components/base.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { functionsAlert } from 'src/helpers/functionsAlert';

@Component({
  selector: 'app-modal-result-monto-eva-tec',
  templateUrl: './modal-result-monto-eva-tec.component.html',
  styleUrls: ['./modal-result-monto-eva-tec.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ModalResultMontoEvaTecComponent extends BaseComponent implements OnInit, OnDestroy {

  constructor(
    private dialogRef: MatDialogRef<ModalResultMontoEvaTecComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
  ){
    super();
    this.booleanAdd = data.accion == 'add';
  }
  booleanAdd: boolean
  formGroup = this.fb.group({
    montoFacturadoSector: [0, Validators.required]
  });

  ngOnDestroy(): void {
  }

  ngOnInit() {
  }

  guardar(){
    if(this.formGroup.value.montoFacturadoSector <= 0){
      return functionsAlert.info("Monto tiene que ser mayor a cero")
    }
    this.dialogRef.close(this.formGroup.value.montoFacturadoSector);
  }
  closeModal(respuesta: any): void {
    this.dialogRef.close(respuesta);
  }
}
