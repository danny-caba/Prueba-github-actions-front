import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { ListadoEnum } from 'src/helpers/constantes.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { ProcesoService } from 'src/app/service/proceso.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalAgregarPaceComponent } from 'src/app/shared/modal-agregar-Pace/modal-agregar-Pace.component';
import { GestionUsuarioService } from 'src/app/service/gestion-usuarios.service';
import { Mes } from 'src/app/interface/mes.model';
import { PacesService } from 'src/app/service/paces.service';
import { functionsAlert } from 'src/helpers/functionsAlert';

@Component({
  selector: 'vex-proceso-gestion-Paces',
  templateUrl: './proceso-list-gestionPaces.component.html',
  styleUrls: ['./proceso-list-gestionPaces.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ProcesoIntranetGestionPacesComponent extends BasePageComponent<Solicitud> implements OnInit {

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;

  ACC_HISTORIAL = 'ACC_HISTORIAL';
  ACC_REGISTRAR = 'ACC_REGISTRAR';
  ACC_EDITAR = 'ACC_EDITAR';
  ACC_PROCESAR = 'ACC_PROCESAR';
  ACC_VER = 'ACC_VER';

  //FIXME
  formGroup = this.fb.group({
    areaUsuaria: [null],
    estado: [null]
  });

  public listaDivisiones: any[];

  listEstado: any[]
  listSector: ListadoDetalle[]
  listSubSector: ListadoDetalle[]

  displayedColumns: string[] = [
    'fechaRegistro',
    'numeroProceso',
    'nombreProceso',
    'estadoProceso',
    'actions'
  ];
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

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private fb: FormBuilder,
    private intUrls: InternalUrls,
    private parametriaService: ParametriaService,
    private pacesService: PacesService,
    private procesoService: ProcesoService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private gestioUsuarioService: GestionUsuarioService
  ) {
    super();
    this.intenalUrls = intUrls;
  }

  ngOnInit(): void {
    this.listarDivisiones();
    this.cargarCombo();
    this.cargarTabla();
    // this.formGroup.get('sector').valueChanges.subscribe(value => {
    //   this.onChangeSector(value)
    // })
  }

  public buscarData() {
    // const areaUsuariaValue = this.formGroup.controls.areaUsuaria.value;
    // const estadoValue = this.formGroup.controls.estado.value;

    // if (areaUsuariaValue && estadoValue) {
    //   console.log(areaUsuariaValue);
    //   this.pacesService.buscarPor(
    //     areaUsuariaValue.idDivision,
    //     estadoValue.idListadoDetalle
    //   ).subscribe({
    //     next: (inv) => {
    //       // Accedemos a la propiedad 'content', que contiene los elementos que estamos buscando
    //       console.log(inv);  // 'content' es la propiedad donde están los datos
    //     },
    //     error: err => {
    //       console.error('Error al obtener los datos:', err);
    //     }
    //   });
    // } else {
    //   console.error('Error: Faltan valores en el formulario. Asegúrate de que tanto areaUsuaria como estado estén seleccionados.');
    // }
  }

  public listarDivisiones(): void {

    this.gestioUsuarioService.listarDivisiones()
      .subscribe(respuesta => {

        this.listaDivisiones = respuesta;
        console.log(this.listaDivisiones)
      });
  }
  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      "TIPO_ESTADO_PACES"

    ]).subscribe(listRes => {
      this.listEstado = listRes[0]
    })
  }

  serviceTable(filtro) {
    // const areaUsuariaValue = this.formGroup.controls.areaUsuaria.value;
    // const estadoValue = this.formGroup.controls.estado.value;

    return this.pacesService.buscarPor(filtro)
    //return this.procesoService.buscarProcesos(filtro);
    // return this.pacesService.buscarPor(
    //   areaUsuariaValue.idDivision,
    //   estadoValue.idListadoDetalle
    // )
  }

  buscar() {
    this.paginator.pageIndex = 0;
    this.cargarTabla();
  }

  limpiar() {
    this.formGroup.reset();
    this.buscar();
  }

  obtenerFiltro() {
    if (this.formGroup.controls.areaUsuaria.value != null || this.formGroup.controls.areaUsuaria.value != undefined) {
      var valorDivision = this.formGroup.controls.areaUsuaria.value
    }
    if (this.formGroup.controls.estado.value != null || this.formGroup.controls.estado.value != undefined) {
      var valoriEstado = this.formGroup.controls.estado
        .value
    }

    let filtro: any = {
      idArea: valorDivision ? valorDivision.idDivision : null,
      idEstado: valoriEstado ? valoriEstado.idListadoDetalle : null
    }
    return filtro;
  }



  ver(row: any) {

    this.dialog.open(ModalAgregarPaceComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        pace: row,
        mes: this.meses.find(x => x.idMes == row.deMes).nombre,
        area: this.listaDivisiones.find(x => x.idDivision == row.division).deDivision,
        evento: "M"
      },
    }).afterClosed().subscribe(result => {
      if (result == 'OK') {

      } else {
      }
    });
  }
  editarPace(row: any) {

    this.dialog.open(ModalAgregarPaceComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        pace: row,
        mes: this.meses.find(x => x.idMes == row.deMes).nombre,
        area: this.listaDivisiones.find(x => x.idDivision == row.division).deDivision,
        evento: "E"
      },
    }).afterClosed().subscribe(result => {
      if (result == 'OK') {
        this.ngOnInit();
      } else {
      }
    });
  }

  eliminar(row: any) {
    let msj = '¿Está seguro de que desea eliminar el registro?'
    functionsAlert.questionSiNo(msj).then((result) => {

      if (result.isConfirmed) {
        this.pacesService.eliminar(row.idPaces).subscribe(res2 => {
          this.sleep(5000).then(any => {
            functionsAlert.success('eliminado correctamente').then((result) => {
              this.ngOnInit();
              // if (tipo == 'APROBADO') {
              //   this.activarFirmaDigital();
              // }
            });
          })

        });
      }

      // this.dialog.open(ModalAgregarPaceComponent, {
      //   width: '1200px',
      //   maxHeight: '100%',
      //   data: {
      //     pace: row,
      //     mes: this.meses.find(x => x.idMes == row.deMes).nombre,
      //     area: this.listaDivisiones.find(x => x.idDivision == row.division).deDivision,
      //     evento: "E"
      //   },
      // }).afterClosed().subscribe(result => {
      //   if (result == 'OK') {
      //     this.ngOnInit();
      //   } else {
      //   }
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  mostrarArea(idDivision) {
    return this.listaDivisiones.find(x => x.idDivision == idDivision).deDivision;
  }
  mostrarMes(idMes) {
    return this.meses.find(x => x.idMes == idMes).nombre;
  }

  mostrarEstado(idListadoDetalle) {
     return this.listEstado.find(x => x.idListadoDetalle == idListadoDetalle).nombre;
  }

  validarAbilitarBotonEditarEliminar(row: any) {
    if (this.listEstado.find(x => x.idListadoDetalle == row.idTipoEstado).codigo ==ListadoEnum.CONST_ESTADO_PACE_REGISTRADO
    || this.listEstado.find(x => x.idListadoDetalle == row.idTipoEstado).codigo ==ListadoEnum.CONST_ESTADO_PACE_OBSERVADO ) {
      return true;
    }
    return false;
  }

}
