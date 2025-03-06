import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '../components/base.component';
import { AprobadorAccion, ListadoEnum } from 'src/helpers/constantes.components';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { EvaluadorService } from 'src/app/service/evaluador.service';
import { Asignacion } from 'src/app/interface/asignacion';
import { Observable } from 'rxjs';
import { EvaluadorRol } from 'src/helpers/constantes.components';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { AuthUser } from 'src/app/auth/store/auth.models';
import { MatDialog } from '@angular/material/dialog';
import { ModalFirmaDigitalComponent } from 'src/app/shared/modal-firma-digital/modal-firma-digital.component';
import { Mes } from 'src/app/interface/mes.model';
import { PacesService } from 'src/app/service/paces.service';
import { PacesObservarDivisionDTO, PacesUpdateDTO } from 'src/app/interface/pace';

@Component({
  selector: 'vex-modal-observar-Pace-Division',
  templateUrl: './modal-observar-Pace-division.component.html',
  styleUrls: ['./modal-observar-Pace-division.component.scss']
})
export class ModalObservarPaceDivisionComponent extends BaseComponent implements OnInit {



  // public pace: any
  // public mes: any
  // public area: any
  public data: any
  public evento: any
  public listEstado: any

  formGroup = this.fb.group({
    observacion: [null]
  });

  constructor(
    private dialogRef: MatDialogRef<ModalObservarPaceDivisionComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private evaluadorService: EvaluadorService,
    private authFacade: AuthFacade,
    private dialog: MatDialog,
    private pacesService: PacesService,
  ) {
    super();
    //Borrar        }
    this.data = data
    console.log(this.data);
    this.evento = this.data.evento
    this.listEstado = this.data.listEstado

  }

  ngOnInit() {

    console.log(this.data.mes)
    console.log(this.data.pace)
    if (this.data.evento == 'E') {

    }
    else if (this.data.evento == 'M') {

      if (this.data.evento === 'M') {
        this.formGroup.controls.observacion.disable();
        if (this.listEstado.find(x => x.idListadoDetalle == this.data.pace.idTipoEstado).codigo == ListadoEnum.CONST_ESTADO_PACE_APROBADO_DIVISION) {
          this.formGroup.controls.observacion.patchValue("Aprobado de acuerdo a la norma")
          return
        }
      } else {
        this.formGroup.controls.observacion.enable();
      }
      this.formGroup.controls.observacion.patchValue(this.data.pace.observacion);
    }
  }

  closeModal() {
    this.dialogRef.close("close");
  }

  validarForm() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched()
      return true;
    }
    return false;
  }

  aprobadores: Observable<any>

  obtenerFiltroActualizar() {


    let filtro: PacesObservarDivisionDTO = {
      idPaces: this.data.pace ? this.data.pace.idPaces : null,
      observacion: this.formGroup.controls.observacion ? this.formGroup.controls.observacion.value : null
    }

    return filtro;
  }


  guardar() {
    let msj = '¿Está seguro de que desea observar este PACE?'
    functionsAlert.questionSiNo(msj).then((result) => {

      if (result.isConfirmed) {
        console.log(this.obtenerFiltroActualizar())
        this.pacesService.observarPaceDivision(this.obtenerFiltroActualizar()).subscribe(res2 => {
          this.dialogRef.close('OK');
        });
      }
    })
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
