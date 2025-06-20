import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '../components/base.component';
import { AprobadorAccion } from 'src/helpers/constantes.components';
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
import { PacesUpdateDTO } from 'src/app/interface/pace';

@Component({
  selector: 'vex-modal-agregar-Pace-accion',
  templateUrl: './modal-agregar-Pace.component.html',
  styleUrls: ['./modal-agregar-Pace.component.scss']
})
export class ModalAgregarPaceComponent extends BaseComponent implements OnInit {

  meses: Mes[] = [
    { idMes: 1, nombre: "Enero" },
    { idMes: 2, nombre: "Febrero" },
    { idMes: 3, nombre: "Marzo" },
    { idMes: 4, nombre: "Abril" },
    { idMes: 5, nombre: "Mayo" },
    { idMes: 6, nombre: "Junio" },
    { idMes: 7, nombre: "Julio" },
    { idMes: 8, nombre: "Agosto" },
    { idMes: 9, nombre: "Setiembre" },
    { idMes: 10, nombre: "Octubre" },
    { idMes: 11, nombre: "Noviembre" },
    { idMes: 12, nombre: "Diciembre" }
  ];

  // public pace: any
  // public mes: any
  // public area: any
  public data: any
  public evento: any
  public titulo = "";

  formGroup = this.fb.group({
    areaUsuaria: [null],
    mesConvocatoria: [null],
    presupuesto: ["", [Validators.required, Validators.pattern("^[0-9]*\.?[0-9]*$")]],
    sintesis: [null],
    antecedentes: [null],
    relacionProgramaAnualSupervision: [null],
    observacion: [null]
  });

  constructor(
    private dialogRef: MatDialogRef<ModalAgregarPaceComponent>,
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
  }

  ngOnInit() {

    console.log(this.data.mes)
    console.log(this.data.pace)
    if (this.data.evento == 'E') {
      this.titulo = "Editar PACE"
      this.formGroup.controls.areaUsuaria.disable();
    }
    else if (this.data.evento == 'M') {
      this.titulo = "Detalle PACE"
      if (this.data.evento === 'M') {
        this.formGroup.controls.areaUsuaria.disable();
        this.formGroup.controls.antecedentes.disable();
        this.formGroup.controls.mesConvocatoria.disable();
        this.formGroup.controls.presupuesto.disable();
        this.formGroup.controls.sintesis.disable();
        this.formGroup.controls.antecedentes.disable();
        this.formGroup.controls.relacionProgramaAnualSupervision.disable();
      } else {
        this.formGroup.controls.areaUsuaria.disable();
        this.formGroup.controls.antecedentes.enable();
        this.formGroup.controls.mesConvocatoria.enable();
        this.formGroup.controls.presupuesto.enable();
        this.formGroup.controls.sintesis.enable();
        this.formGroup.controls.antecedentes.enable();
        this.formGroup.controls.relacionProgramaAnualSupervision.enable();
      }

    }
    this.formGroup.controls.areaUsuaria.patchValue(this.data.area);
    this.formGroup.controls.mesConvocatoria.patchValue(this.meses.find(x => x.idMes == this.data.pace.deMes));
    this.formGroup.controls.presupuesto.patchValue(this.data.pace.dePresupuesto);
    this.formGroup.controls.sintesis.patchValue(this.data.pace.deItemPaces);
    this.formGroup.controls.antecedentes.patchValue(this.data.pace.noConvocatoria);
    this.formGroup.controls.relacionProgramaAnualSupervision.patchValue(this.data.pace.reProgramaAnualSupervision);

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


    let filtro: PacesUpdateDTO = {
      idPaces: this.data.pace ? this.data.pace.idPaces : null,
      mesConvocatoria: this.formGroup.controls.mesConvocatoria.value ? this.formGroup.controls.mesConvocatoria.value.idMes : null,
      noConvocatoria: this.formGroup.controls.antecedentes ? this.formGroup.controls.antecedentes.value : null,
      dePresupuesto: this.formGroup.controls.presupuesto ? this.formGroup.controls.presupuesto.value : null,
      deItemPaces: this.formGroup.controls.sintesis ? this.formGroup.controls.sintesis.value : null,
      reProgramaAnualSupervision: this.formGroup.controls.relacionProgramaAnualSupervision ? this.formGroup.controls.relacionProgramaAnualSupervision.value : null
    }

    return filtro;
  }


  guardar() {

    let msj = '¿Está seguro de que desea actualizar?'
    functionsAlert.questionSiNo(msj).then((result) => {

      if (result.isConfirmed) {
        console.log(this.obtenerFiltroActualizar())

        this.pacesService.actualizar(this.obtenerFiltroActualizar()).subscribe(res2 => {

          this.sleep(5000).then(any => {
            this.dialogRef.close('OK');
            functionsAlert.success('Guardado').then((result) => {
              // if (tipo == 'APROBADO') {
              //   this.activarFirmaDigital();
              // }
            });
          })

        });
      }
    });
  }

  activarFirmaDigital() {

    let listaIdArchivos = [];

    // for (let j = 0; j < this.listaNroExpedienteSeleccionado.length; j++) {
    //   this.evaluadorService.obtenerIdArchivo(this.listaNroExpedienteSeleccionado[j]).subscribe(res => {
    //     if (res != 0) {
    //       listaIdArchivos.push(res);
    //     }

    //     //Firma digital
    //     if (j == (this.listaNroExpedienteSeleccionado.length - 1)) {
    //       if (listaIdArchivos.length > 0) {
    //         console.log(listaIdArchivos.toString());
    //         let token = {
    //           usuario: sessionStorage.getItem("USUARIO")
    //         }
    //         this.evaluadorService.obtenerParametrosfirmaDigital(token).subscribe(parameter => {
    //           this.dialog.open(ModalFirmaDigitalComponent, {
    //             width: '605px',
    //             maxHeight: '100%',
    //             data: {
    //               action: parameter.action,
    //               loginUsuario: parameter.loginUsuario,
    //               passwordUsuario: parameter.passwordUsuario,
    //               archivosFirmar: listaIdArchivos.toString()
    //             },
    //           })
    //             .afterClosed().subscribe(result => {
    //               if (result == 'OK') {

    //               }
    //             });
    //         })
    //       }
    //     }
    //   });
    // }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
