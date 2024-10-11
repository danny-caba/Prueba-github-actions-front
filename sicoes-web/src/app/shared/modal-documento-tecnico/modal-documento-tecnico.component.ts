import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from '../components/base.component';
import { EvidenciaService } from 'src/app/service/evidencia.service';
import { Evidencia } from 'src/app/interface/evidencia.model';
import { FormAdjuntosMemoryComponent } from '../form-adjuntos-memory/form-adjuntos-memory.component';
import { Propuesta } from 'src/app/interface/propuesta.model';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';
import { functionsAlert } from 'src/helpers/functionsAlert';

@Component({
  selector: 'vex-documento-tecnico',
  templateUrl: './modal-documento-tecnico.component.html',
  styleUrls: ['./modal-documento-tecnico.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ModalDocumentoTecnicoComponent extends BaseComponent implements OnInit {

  @ViewChild('formAdjuntoBtnTA19', { static: false }) formAdjuntoBtnTA19: FormAdjuntosMemoryComponent;

  propuesta: Propuesta
  evidencia: Evidencia

  booleanAdd: boolean = true
  booleanEdit: boolean = false
  booleanView: boolean = false

  formGroup = this.fb.group({
    descripcion: ['', Validators.required]
  });

  constructor(
    private dialogRef: MatDialogRef<ModalDocumentoTecnicoComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data,
    private evidenciaService: EvidenciaService
  ) {
    super();
    this.propuesta = data?.propuesta;
    this.booleanAdd = data.accion == 'add';
    this.booleanEdit = data.accion == 'edit';
    this.booleanView = data.accion == 'view';

    if (this.booleanView) {
      this.formGroup.disable();
    }

    if (data.evidencia) {
      this.evidenciaService.obtenerEvidencia(data.evidencia.idArchivo).subscribe(res => {
        this.evidencia = res;
        this.formGroup.patchValue(res)
      });
    }
  }

  ngOnInit(): void {

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

  async guardar() {
    if (this.validarForm()) return;

    if(Object.keys(this.formAdjuntoBtnTA19.adjuntoInput).length === 0){
      functionsAlert.error('Adjunte el archivo de la evidencia').then((result) => {
      });
    } else {
      let proceso = await this.formAdjuntoBtnTA19.sendServer(this.formGroup.controls.descripcion.getRawValue(),null,null,null,this.propuesta.propuestaTecnica.idPropuestaTecnica);
      if(proceso){
          this.dialogRef.close(proceso);
          functionsAlertMod2.successButtonDistinto('Tu documento se agregó<br>correctamente', 'Continuar');
      }
    }
  }

  async actualizar() {
    if (this.validarForm()) return;

    if(Object.keys(this.formAdjuntoBtnTA19.adjuntoInput).length === 0){
      functionsAlert.error('Adjunte el archivo de la evidencia').then((result) => {
      });
    } else {
      let proceso = await this.formAdjuntoBtnTA19.sendServerUpdateProceso(this.formGroup.controls.descripcion.getRawValue(), null, this.evidencia.idArchivo,null,this.propuesta.propuestaTecnica.idPropuestaTecnica);
      this.dialogRef.close(proceso);
      if(proceso){
      }
    }
  }
}
