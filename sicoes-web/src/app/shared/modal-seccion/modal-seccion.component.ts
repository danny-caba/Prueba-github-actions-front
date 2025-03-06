import { Component, Inject, OnInit } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from '../components/base.component';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Seccion } from 'src/app/interface/seccion.model';
import { SeccionService } from 'src/app/service/seccion.service';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';

@Component({
  selector: 'vex-modal-seccion',
  templateUrl: './modal-seccion.component.html',
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ModalSeccionComponent extends BaseComponent implements OnInit {

  title: string;

  ACC_REGISTRAR = 'Registrar';
  ACC_ACTUALIZAR = 'Actualizar';
  btnValue: string;
  seccionRef: any;

  formGroup = this.fb.group({
    descripcion: ['', Validators.required],
    personal: [false],
    activo: [false]
  });

  constructor(
    private dialogRef: MatDialogRef<ModalSeccionComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private seccionService: SeccionService
  ) {
    super();

    this.btnValue = data.accion;
    this.title = data.accion == this.ACC_REGISTRAR ? 'REGISTRO' : 'ACTUALIZACIÓN';
    this.seccionRef = data.seccion;

    if (data.accion === this.ACC_ACTUALIZAR) {
      this.formGroup.patchValue({
        descripcion: data.seccion.deSeccion,
        personal: data.seccion.flReqPersonal === '1' ? true : false,
        activo: data.seccion.esSeccion === '1' ? true : false
      });
    }
  }

  ngOnInit(): void {
  }

  closeModal() {
    this.dialogRef.close();
  }

  accion(acc) {
    if ( acc === 'GUARDAR' ) {
      this.formGroup.markAllAsTouched();
      if (this.formGroup.invalid) {
        return;
      }

      let seccion: any = {
        ...this.formGroup.getRawValue()
      };
      
      if (this.btnValue === this.ACC_REGISTRAR) {
        this.registrarConsulta(seccion);
      } else {
        this.actualizarConsulta(seccion);
      }
      
    } else {
      this.closeModal();
    }
  }

  registrarConsulta(seccion: any) {
    const time = new Date().getTime();
    const newSeccion: Seccion = {
      deSeccion: seccion.descripcion,
      esSeccion: seccion.activo ? '1' : '0',
      flReqPersonal: seccion.personal ? '1' : '0',
      coSeccion: time.toString().substring(0, 6)
    };
    
    this.seccionService.registrar(newSeccion).subscribe(res => {
      if (res === null) {
        functionsAlertMod2.warningMensage('No se puede registrar la sección');
      } else {
        functionsAlertMod2.success('Registrado').then((result) => {
          this.dialogRef.close(res);
        });
      }
    });
  }

  actualizarConsulta(seccion: any) {

    const updSeccion: Seccion = {
      idSeccion: this.seccionRef.idSeccion,
      deSeccion: seccion.descripcion,
      esSeccion: seccion.activo ? '1' : '0',
      flReqPersonal: seccion.personal ? '1' : '0'
    };
    
    this.seccionService.actualizar(updSeccion).subscribe(res => {
      if (res === null) {
        functionsAlertMod2.warningMensage('No se puede actualizar la sección');
      } else {
        functionsAlertMod2.success('Actualizado').then((result) => {
          this.dialogRef.close(res);
        });
      }
    });
  }

}
