import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { EvaluadorService } from 'src/app/service/evaluador.service';
import { AprobadorAccion, AprobadorRequerimientoAccionEnum as accion, ListadoEnum } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { BaseComponent } from '../components/base.component';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { ModalFirmaDigitalComponent } from '../modal-firma-digital/modal-firma-digital.component';
import { RequerimientoService } from 'src/app/service/requerimiento.service';

@Component({
  selector: 'vex-modal-aprobador-supervisor-pn',
  templateUrl: './modal-aprobador-supervisor-pn.component.html',
  styleUrls: ['./modal-aprobador-supervisor-pn.component.scss']
})
export class ModalAprobadorSupervisorPnComponent extends BaseComponent implements OnInit {
  AprobadorAccion = AprobadorAccion
  listaSolicitudUuidSeleccionado = []
  errores: { uuid: string; error: any }[] = [];
  estadosAprobacion: ListadoDetalle[] = [];
  someResponsableSIAF = false;

  formGroup = this.fb.group({
    observacion: [null],
    nuSiaf: [null]
  });

  constructor(
    private dialogRef: MatDialogRef<ModalAprobadorSupervisorPnComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private evaluadorService: EvaluadorService,
    private authFacade: AuthFacade,
    private dialog: MatDialog,
    private parametriaService: ParametriaService,
    private requerimientoService: RequerimientoService
  ) {
    super();
    this.listaSolicitudUuidSeleccionado = data.listaSolicitudUuidSeleccionado;

    if (this.listaSolicitudUuidSeleccionado.some(item => item.responsableSIAF))
      this.someResponsableSIAF = true;
  }

  ngOnInit(): void {
    this.cargarCombo();
  }

  cargarCombo() {
    const dataString = sessionStorage.getItem('ESTADO_APROBACION');
    if (dataString) {
      this.estadosAprobacion = JSON.parse(dataString);
    } else {
      this.parametriaService.obtenerMultipleListadoDetalle([
        ListadoEnum.ESTADO_APROBACION
      ]).subscribe(res => {
        this.estadosAprobacion = res[0];
      });
    }
  }

  closeModal() {
    this.dialogRef.close(false);
  }

  validarForm() {
    // Si someResponsableSIAF es true, validar que nuSiaf no esté vacío
    if (this.someResponsableSIAF && !this.formGroup.get('nuSiaf')?.value) {
      this.formGroup.get('nuSiaf')?.markAsTouched();
      return true;
    }
    
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched()
      return true;
    }
    return false;
  }

  aprobadores: Observable<any>

  guardar(tipo) {

    this.errores = [];

    let msj = tipo == 'RECHAZADO' 
      ? '¿Está seguro de que desea rechazar la evaluación?' 
      : '¿Está seguro de que desea aprobar la evaluación?';

    if (this.validarForm()) return;

    functionsAlert.questionSiNo(msj).then(async (result) => {

      let estado = this.estadosAprobacion.find(e => e.codigo === accion.APROBADO);

      if (result.isConfirmed) {
        estado = tipo === accion.APROBADO 
        ? this.estadosAprobacion.find(e => e.codigo === accion.APROBADO) 
        : this.estadosAprobacion.find(e => e.codigo === accion.DESAPROBADO);

        for (const item of this.listaSolicitudUuidSeleccionado) {
          // const { idRequerimientoAprobacion } = item;
          // let payload = {
          //   idRequerimientoAprobacion,
          //   estado,
          //   observacion: this.formGroup.get('observacion')?.value,
          //   idEstadoRevision: item.idEstadoRevision,
          // };

          // if (this.someResponsableSIAF) {
          //   payload = {
          //     ...payload,
          //     requerimiento: {
          //       nuSiaf: this.formGroup.get('nuSiaf')?.value
          //     }
          //   } as any;
          // }

          // try {
          //   this.evaluadorService.requerimientosAprobar(item.requerimiento.requerimientoUuid, payload).subscribe({
          //     next: () => {
          //       functionsAlert.success('Acción masiva completada con éxito.');
          //       this.dialogRef.close(true);
          //     },
          //     error: (error) => {
          //       console.log(error);
          //     }
          //   });
            this.activarFirmaDigital();
          // } catch (error) {
          //   this.errores.push({
          //     uuid: item.requerimiento.requerimientoUuid,
          //     error: error?.message || error
          //   });
          // }
        }
        // functionsAlert.success('Acción masiva completada con éxito.');
        // this.dialogRef.close(true);
      }
    });
  }

  activarFirmaDigital() {
    let listaIdArchivosSiged = [];
    // listaIdArchivosSiged.push(6257082);
    // this.abrirModalFirmaDigital(listaIdArchivosSiged);

    for (const item of this.listaSolicitudUuidSeleccionado) {
      this.requerimientoService.obtenerIdInformeSiged(item.requerimiento.nuExpediente).subscribe({
        next: (res) => {
          console.log(res);
          if (res != 0) {
            listaIdArchivosSiged.push(res);
          }
          this.abrirModalFirmaDigital(listaIdArchivosSiged);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  abrirModalFirmaDigital(listaIdArchivosSiged: number[]) {
    let token = {
      usuario: sessionStorage.getItem("USUARIO")
    }
    this.evaluadorService.obtenerParametrosfirmaDigital(token).subscribe(parameter => {
      this.dialog.open(ModalFirmaDigitalComponent, {
        width: '605px',
        maxHeight: '100%',
        data: {
          action: parameter.action,
          loginUsuario: parameter.loginUsuario,
          passwordUsuario: parameter.passwordUsuario,
          archivosFirmar: listaIdArchivosSiged.toString()
        }, 
      })
      .afterClosed().subscribe(result => {
        if (result == 'OK') {
          // this.dialogRef.close(true);
        }
      });
    });
  }

}
