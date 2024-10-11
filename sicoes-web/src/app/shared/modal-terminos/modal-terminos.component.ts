import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from '../components/base.component';

@Component({
  selector: 'vex-modal-terminos',
  templateUrl: './modal-terminos.component.html',
  styleUrls: ['./modal-terminos.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ModalTerminosComponent extends BaseComponent implements OnInit {

  boolRechazar: boolean = true;
  obj;

  constructor(
    private dialogRef: MatDialogRef<ModalTerminosComponent>,
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    super();

    this.obj = data?.obj;
    if(data?.accion == 'view'){
      this.boolRechazar = false;
    }
  }

  ngOnInit(): void {
  }

  closeModal() {
    this.dialogRef.close();
  }

  accion(acc){
    this.dialogRef.close(acc);
    let flag = null;
    if('ACEPTAR'.includes(acc)){
      flag = '1';
    }

    if(this.obj){
      this.obj.flagActivo = flag;
    }
    
  }
}
