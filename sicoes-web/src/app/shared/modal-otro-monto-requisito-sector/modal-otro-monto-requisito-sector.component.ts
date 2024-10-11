import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from '../components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { OtroRequisito } from 'src/app/interface/otro-requisito.model';
import { PerfilService } from 'src/app/service/perfil.service';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { SolicitudService } from 'src/app/service/solicitud.service';


@Component({
  selector: 'vex-modal-otro-monto-requisito-sector',
  templateUrl: './modal-otro-monto-requisito-sector.component.html',
  styleUrls: ['./modal-otro-monto-requisito-sector.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ModalOtroMontoRequisitoSectorComponent extends BaseComponent implements OnInit, OnDestroy {
    solicitud: Solicitud
    solicitudUuid: string
  
    booleanAdd: boolean
    booleanEdit: boolean
    booleanView: boolean = false
  
    formGroup = this.fb.group({
      observacionAdmnistrativa: ['', Validators.required]
    });
  
    valueText = '';
  
    constructor(
      private dialogRef: MatDialogRef<ModalOtroMontoRequisitoSectorComponent>,
      @Inject(MAT_DIALOG_DATA) data,
      private fb: FormBuilder,
      private perfilService: PerfilService,
      private solicitudService: SolicitudService
    ) {
      super();
      this.solicitud = data?.solicitud;
      this.solicitudUuid = data?.solicitudUuid;
      this.booleanAdd = data.accion == 'add';
      this.booleanEdit = data.accion == 'edit';
      this.booleanView = data.accion == 'view';
  
      if (this.booleanView) {
        this.formGroup.disable();
      }
  
      //this.formGroup.patchValue(this.solicitud)
  
      this.solicitudService.obtenerSolicitud(this.solicitudUuid).subscribe( resp => {
        if(resp.observacionAdmnistrativa){
          this.formGroup.controls.observacionAdmnistrativa.setValue(resp.observacionAdmnistrativa);
        }else{
          this.formGroup.controls.observacionAdmnistrativa.setValue(this.valueText);
        } 
      })
      
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
  
    /*guardar() {
      if (this.validarForm()) return;
  
      this.otroRequisito.observacion = this.formGroup.controls.observacion.getRawValue();
  
      this.perfilService.evaluarPerfil(this.otroRequisito).subscribe(res => {
        functionsAlert.success('Observación Registrada').then((result) => {
          this.closeModal()
        });
      });
    }*/
  
    guadarObsAdmin(){
      if(this.validarForm()) return;
  
      let objSol: any = {
        solicitudUuid: this.solicitud.solicitudUuid,
        observacionAdmnistrativa: this.formGroup.controls.observacionAdmnistrativa.getRawValue()
      }
  
      this.solicitudService.registrarObservacionAdm(objSol).subscribe(obj => {
        this.solicitud.observacionAdmnistrativa = obj.observacionAdmnistrativa;
        functionsAlert.successDescargar('Observación Actualizada').then((result) => {
          this.closeModal();
        });
      });
    }
  
  }
  
