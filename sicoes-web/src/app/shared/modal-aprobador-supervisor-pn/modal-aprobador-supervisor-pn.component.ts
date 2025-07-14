import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom, Observable } from 'rxjs';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { AuthUser } from 'src/app/auth/store/auth.models';
import { Asignacion } from 'src/app/interface/asignacion';
import { EvaluadorService } from 'src/app/service/evaluador.service';
import { AprobadorAccion, EvaluadorRol } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { BaseComponent } from '../components/base.component';

@Component({
  selector: 'vex-modal-aprobador-supervisor-pn',
  templateUrl: './modal-aprobador-supervisor-pn.component.html',
  styleUrls: ['./modal-aprobador-supervisor-pn.component.scss']
})
export class ModalAprobadorSupervisorPnComponent extends BaseComponent implements OnInit {

  asignacion: Asignacion

  AprobadorAccion = AprobadorAccion

  listaSolicitudUuidSeleccionado = []
  usuario$ = this.authFacade.user$;
  usuario: AuthUser



  progreso: number = 0;
  loadingAprobacion: boolean = false;
  errores: string[] = [];

  formGroup = this.fb.group({
    observacion: [null]
  });

  constructor(
    private dialogRef: MatDialogRef<ModalAprobadorSupervisorPnComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private evaluadorService: EvaluadorService,
    private authFacade: AuthFacade,
    private dialog: MatDialog
  ) {
    super();

    this.listaSolicitudUuidSeleccionado = data.listaSolicitudUuidSeleccionado;



  }

  ngOnInit() {

    this.usuario$.subscribe(usu => {
      this.usuario = usu;
    })
  }

  closeModal() {
    this.dialogRef.close(false);
  }

  validarForm() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched()
      return true;
    }
    return false;
  }

  aprobadores: Observable<any>

  guardar(tipo) {

    this.errores = [];

    let msj = '¿Está seguro de que desea aprobar la evaluación?'

    if (tipo == 'RECHAZADO') {
      msj = '¿Está seguro de que desea rechazar la evaluación?';
      if (this.validarForm()) return;
    }

    functionsAlert.questionSiNo(msj).then(async (result) => {

      if (result.isConfirmed) {
        this.loadingAprobacion = true;
        for (let i = 0; i < this.listaSolicitudUuidSeleccionado.length; i++) {

          let filtro = {
            codigoTipoAprobador: EvaluadorRol.APROBADOR_TECNICO_COD,
            solicitudUuid: this.listaSolicitudUuidSeleccionado[i]
          };

          //this.evaluadorService.requerimientosAprobar


          let data$ = this.evaluadorService.listarAsignacionesAprobadores(filtro);
          let res: any = await firstValueFrom(data$);

          //this.dialogRef.close(true);
        }
      }
    });
  }
}
