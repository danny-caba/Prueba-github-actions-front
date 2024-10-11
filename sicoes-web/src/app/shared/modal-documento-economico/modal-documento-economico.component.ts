import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { ListadoEnum } from 'src/helpers/constantes.components';
import { BaseComponent } from '../components/base.component';
import { ParametriaService } from 'src/app/service/parametria.service';
import { DatePipe } from '@angular/common';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { EvidenciaService } from 'src/app/service/evidencia.service';
import { Evidencia } from 'src/app/interface/evidencia.model';
import { FormAdjuntosMemoryComponent } from '../form-adjuntos-memory/form-adjuntos-memory.component';
import { Propuesta } from 'src/app/interface/propuesta.model';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';
import { functionsAlert } from 'src/helpers/functionsAlert';

@Component({
  selector: 'vex-documento-economico',
  templateUrl: './modal-documento-economico.component.html',
  styleUrls: ['./modal-documento-economico.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ModalDocumentoEconomicoComponent extends BaseComponent implements OnInit {

  @ViewChild('formAdjuntoBtnTA20', { static: false }) formAdjuntoBtnTA20: FormAdjuntosMemoryComponent;

  propuesta: Propuesta
  evidencia: Evidencia

  booleanAdd: boolean = true
  booleanEdit: boolean = false
  booleanView: boolean = false

  formGroup = this.fb.group({
    descripcion: ['', Validators.required]
  });

  listTipo: ListadoDetalle[]

  constructor(
    private dialogRef: MatDialogRef<ModalDocumentoEconomicoComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data,
    private parametriaService: ParametriaService,
    private evidenciaService: EvidenciaService,
    private datePipe: DatePipe
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
    this.cargarCombo();
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([ListadoEnum.ESTADO_SOLICITUD]).subscribe(listRes => {
      this.listTipo = listRes[0];
    })
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

    if(Object.keys(this.formAdjuntoBtnTA20.adjuntoInput).length === 0){
      functionsAlert.error('Adjunte el archivo de la evidencia').then((result) => {
      });
    } else {
      let proceso = await this.formAdjuntoBtnTA20.sendServer(this.formGroup.controls.descripcion.getRawValue(), null, null,this.propuesta.propuestaEconomica?.idPropuestaEconomica,null);
      if(proceso){
        this.closeModal();
        functionsAlertMod2.successButtonDistinto('Tu documento se agregó<br>correctamente', 'Continuar');
      }
    }
  }

  async actualizar() {
    if (this.validarForm()) return;

    if(Object.keys(this.formAdjuntoBtnTA20.adjuntoInput).length === 0){
      functionsAlert.error('Adjunte el archivo de la evidencia').then((result) => {
      });
    } else {
      let proceso = await this.formAdjuntoBtnTA20.sendServerUpdateProceso(this.formGroup.controls.descripcion.getRawValue(),null, this.evidencia.idArchivo,null,this.propuesta.propuestaEconomica?.idPropuestaEconomica);
      if(proceso){
        this.closeModal();
      }
    }
  }
}
