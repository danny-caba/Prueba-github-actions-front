import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '../components/base.component';
import { AprobadorAccion } from 'src/helpers/constantes.components';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { EvaluadorService } from 'src/app/service/evaluador.service';
import { Asignacion } from 'src/app/interface/asignacion';
import { map, Observable, startWith } from 'rxjs';
import { EvaluadorRol } from 'src/helpers/constantes.components';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { AuthUser } from 'src/app/auth/store/auth.models';
import { MatDialog } from '@angular/material/dialog';
import { ModalFirmaDigitalComponent } from 'src/app/shared/modal-firma-digital/modal-firma-digital.component';
import { Mes } from 'src/app/interface/mes.model';
import { PacesService } from 'src/app/service/paces.service';
import { AprobadoresDTO, PacesUpdateDTO } from 'src/app/interface/pace';

@Component({
  selector: 'vex-modal-configurar-Pace-accion',
  templateUrl: './modal-configurar-Pace.component.html',
  styleUrls: ['./modal-configurar-Pace.component.scss']
})
export class ModalConfigurarPaceComponent extends BaseComponent implements OnInit {

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


  formGroup = this.fb.group({
    aprobadorG2: [null],
    aprobadorG3: [null],
  });

  constructor(
    private dialogRef: MatDialogRef<ModalConfigurarPaceComponent>,
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
    this.listarEvaluadores();
  }

  ngOnInit() {
    // this.formGroup.controls.aprobadorG2.patchValue(this.data.pace.idAprobadorg2);
    // this.formGroup.controls.aprobadorG3.patchValue(this.data.pace.idAprobadorg3);
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

    let filtro: AprobadoresDTO = {
      idPace: this.data.pace ? this.data.pace.idPaces : null,
      idAprobadorG2: this.formGroup.controls.aprobadorG2 ? this.formGroup.controls.aprobadorG2.value.idUsuario : null,
      idAprobadorG3: this.formGroup.controls.aprobadorG3 ? this.formGroup.controls.aprobadorG3.value.idUsuario : null
    }

    return filtro;
  }


  guardar() {

    let msj = '¿Está seguro de que desea actualizar?'
    functionsAlert.questionSiNo(msj).then((result) => {

      if (result.isConfirmed) {
        console.log(this.obtenerFiltroActualizar())

        this.pacesService.actualizarAprobadores(this.obtenerFiltroActualizar()).subscribe(res2 => {

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
  }

  filteredStatesTecnico$: Observable<any[]>;
  filteredStatesTecnicoG3$: Observable<any[]>;
  listAprobadoresALL: any[] = [];

  listarEvaluadores() {
    this.evaluadorService.buscarEvaluadores([
      EvaluadorRol.APROBADOR_TECNICO
    ]).subscribe(listRes => {
      this.listAprobadoresALL = listRes.content;

      this.filteredStatesTecnico$ = this.formGroup.controls.aprobadorG2.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value?.nombreUsuario),
        map(state => state ? this.filterStatesTec(state) : this.listAprobadoresALL.slice())
      );

      this.filteredStatesTecnicoG3$ = this.formGroup.controls.aprobadorG3.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value?.nombreUsuario),
        map(state => state ? this.filterStatesTec(state) : this.listAprobadoresALL.slice())
      );

      // Asignar valores iniciales (buscar el objeto correspondiente)
      const aprobadorG2 = this.listAprobadoresALL.find(
        (state) => state.idUsuario === this.data.pace.idAprobadorg2
      );
      const aprobadorG3 = this.listAprobadoresALL.find(
        (state) => state.idUsuario === this.data.pace.idAprobadorg3
      );

      // Patch value con los objetos encontrados
      this.formGroup.controls.aprobadorG2.patchValue(aprobadorG2 || null);
      this.formGroup.controls.aprobadorG3.patchValue(aprobadorG3 || null);
    })


  }


  filterStatesTec(nombreUsuario: string) {
    return this.listAprobadoresALL.filter(state =>
      state.nombreUsuario?.toLowerCase().indexOf(nombreUsuario?.toLowerCase()) >= 0);
  }
  blurEvaluadorTecnicoG2() {
    setTimeout(() => {
      if (!(this.formGroup.controls.aprobadorG2.value instanceof Object)) {
        this.formGroup.controls.aprobadorG2.setValue("");
        this.formGroup.controls.aprobadorG2.markAsTouched();
      }
    }, 200);
  }

  blurEvaluadorTecnicoG3() {
    setTimeout(() => {
      if (!(this.formGroup.controls.aprobadorG3.value instanceof Object)) {
        this.formGroup.controls.aprobadorG3.setValue("");
        this.formGroup.controls.aprobadorG3.markAsTouched();
      }
    }, 200);
  }

  displayFn(codi: any): string {
    return codi && codi.nombreUsuario ? codi.nombreUsuario : '';
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
