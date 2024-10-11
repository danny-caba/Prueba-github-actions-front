import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from '../components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { OtroRequisito } from 'src/app/interface/otro-requisito.model';
import { PerfilService } from 'src/app/service/perfil.service';
import { functions } from 'src/helpers/functions';
import { OtroRequisitoService } from 'src/app/service/otro-requisito.service';
import { LayoutResultadoComponent } from '../layout-resultado/layout-resultado.component';

@Component({
  selector: 'vex-modal-otro-requisito-observacion-perfil',
  templateUrl: './modal-otro-requisito-observacion-perfil.component.html',
  styleUrls: ['./modal-otro-requisito-observacion-perfil.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ModalOtroRequisitoObservacionPerfilComponent extends BaseComponent implements OnInit, OnDestroy {

  otroRequisito: OtroRequisito

  booleanAdd: boolean
  booleanEdit: boolean
  booleanView: boolean = false
  respuesta: boolean

  formGroup = this.fb.group({
    observacion: ['', Validators.required]
  });

  valueText = '';
  componente: LayoutResultadoComponent;

  constructor(
    private dialogRef: MatDialogRef<ModalOtroRequisitoObservacionPerfilComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private perfilService: PerfilService,
    private otroRequisitoService: OtroRequisitoService
  ) {
    super();
    this.otroRequisito = data?.otroRequisito;
    this.booleanAdd = data.accion == 'add';
    this.booleanEdit = data.accion == 'edit';
    this.booleanView = data.accion == 'view';
    this.componente = data.componente;

    if (this.booleanView) {
      this.formGroup.disable();
    }

    if(this.otroRequisito.observacion){
      this.formGroup.controls.observacion.setValue(this.otroRequisito.observacion);
    }else{      
      if(functions.noEsVacio(this.otroRequisito.finalizado)){
        this.formGroup.controls.observacion.setValue(this.otroRequisito.observacion);
      }else{
        this.formGroup.controls.observacion.setValue(this.valueText);
      }
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {

  }

  closeModal(respuesta: any): void {
    this.dialogRef.close(respuesta);
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
    
    functionsAlert.questionSiNo('¿Seguro que desea finalizar?').then((result) => {
      if (result.isConfirmed) {
        this.perfilService.evaluarPerfil(this.otroRequisito).subscribe(res => {
          this.otroRequisitoService.finalizarOtroRequisito(this.otroRequisito).subscribe(res => {
            this.closeModal(this.respuesta);
            functionsAlert.success('Requisito Actualizado').then((result) => {
              this.componente.validarFinalizarRevTecni();
              this.componente.listarPerfiles();
            });
          });
        });
      }
    });
  }

}
