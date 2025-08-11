import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { BaseComponent } from '../components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { firstValueFrom } from 'rxjs';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { AuthUser } from 'src/app/auth/store/auth.models';
import { SelectedPerfeccionamientoItem } from 'src/app/interface/contrato.model';
import { ContratoService } from 'src/app/service/contrato.service';
import { REQUERIMIENTO, UsuariosRoles } from 'src/helpers/constantes.components';
import { SelectedReemplazarItem } from 'src/app/interface/reemplazo-personal.model';

@Component({
  selector: 'app-modal-aprobador-personal',
  templateUrl: './modal-aprobador-personal.component.html',
  styleUrls: ['./modal-aprobador-personal.component.scss']
})
export class ModalAprobadorPersonalComponent extends BaseComponent implements OnInit {

  observacion = new FormControl('', [Validators.maxLength(500)]);

  progreso: number = 0;
  loadingAccion: boolean = false;
  errores: string[] = [];

  usuario$: any;
  usuario: AuthUser;
  accion: any;
  roles = UsuariosRoles

  constructor(
    private dialogRef: MatDialogRef<ModalAprobadorPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      accion: any;
      elementosSeleccionados: SelectedReemplazarItem[];
      tipo: any;
    },
    private solicitudService: SolicitudService,
    private authFacade: AuthFacade
    // MatDialog ya no se inyecta aquí
  ) {
    super();
  }

  ngOnInit(): void {
    console.log("dataaaaa", this.data);
    this.accion = this.data.tipo;
    this.usuario$ = this.authFacade.user$;
    this.usuario$.subscribe(usu => {
      this.usuario = usu;
    });

    /* if (this.data.elementosSeleccionados.length === 0) {
       this.observacion.disable();
     }*/
  }

  cancelar(): void {
    this.dialogRef.close('cancel');
  }

  validarObservacion(): boolean {
    if (!this.observacion.valid) {
      this.observacion.markAsTouched();
      return true;
    }
    return false;
  }

  async realizarAccion(tipoAccion: string, accion: number): Promise<void> {

    this.errores = [];
    let msj = `¿Está seguro de que desea ${tipoAccion} la evaluación?`;

    if (this.validarObservacion()) {
      return;
    }

    functionsAlert.questionSiNo(msj).then(async (result) => {
      if (result.isConfirmed) {
        let requerimiento="";
        if(this.accion.includes(this.roles.GER_G2)){
          requerimiento=REQUERIMIENTO.EVAL_INF_APROB_TEC_G2
        }else if (this.accion.includes(this.roles.APROBADOR_G3)){
          requerimiento=REQUERIMIENTO.EVAL_INF_APROB_TEC_G3
        }else if(this.accion.includes(this.roles.EVALUADOR)){
          requerimiento=REQUERIMIENTO.APROB_EVAL_CONTR
        }
        this.loadingAccion = true;
        if (accion == 1) {
          this.firmar();
        } else if (accion == 2) {
          this.vistoBueno();
        } else if (accion == 3) {
          this.aprobar(requerimiento);
        } else if (accion == 4) {
          this.rechazar(requerimiento);
        }


      }
    });
  }

  aprobar(requerimiento:string) {
    let json = {
      "idAprobacion": this.data.elementosSeleccionados[0].idAprobacion,
      "estadoAprob": this.data.elementosSeleccionados[0].estadoAprob,
      "deObservacion": this.observacion.value,
      "requerimiento": requerimiento,
      "accion": "A",
      "conforme": true
    }
    this.solicitudService.aprobarReemplazo(json).subscribe(resp=>{
      this.loadingAccion = false;
      console.log("respuesta",resp);
      this.cancelar()
    })
  }

  rechazar(requerimiento:string) {
    let json = {
      "idAprobacion": this.data.elementosSeleccionados[0].idAprobacion,
      "estadoAprob": this.data.elementosSeleccionados[0].estadoAprob,
      "deObservacion": this.observacion.value,
      "requerimiento": requerimiento,
      "accion": "R",
      "conforme": true
    }
    this.solicitudService.aprobarReemplazo(json).subscribe(resp=>{
      this.loadingAccion = false;
      console.log("respuesta",resp);
      this.cancelar()
    })
    
  }

  firmar() {
    this.loadingAccion = false;
  }

  vistoBueno() {
    this.loadingAccion = false;
  }

}