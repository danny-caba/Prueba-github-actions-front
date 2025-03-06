import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { ListadoEnum, SolicitudEstadoEnum } from 'src/helpers/constantes.components';
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
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ModalObservarPaceDivisionComponent } from 'src/app/shared/modal-Observar-Pace-Division/modal-observar-Pace-division.component';
import { PacesAprobarDivisionDTO } from 'src/app/interface/pace';

@Component({
  selector: 'vex-proceso-aprobacion-Paces',
  templateUrl: './proceso-list-aprobacionPaces.component.html',
  styleUrls: ['./proceso-list-aprobacionPaces.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ProcesoIntranetAprobacionPacesComponent extends BasePageComponent<Solicitud> implements OnInit {

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
    'seleccionar',
    // 'fechaRegistro',
    'numeroProceso',
    'nombreProceso',
    'estadoProceso',
    'actions',
    'aprobador'
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
  // selection = new SelectionModel<any>(true, []);

  selectionCheckBox: any[] = []

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
      this.listEstado = this.listEstado.filter(x => x.codigo == ListadoEnum.CONST_ESTADO_PACE_REGISTRADO ||
        x.codigo == ListadoEnum.CONST_ESTADO_PACE_ACTUALIZADO ||
        x.codigo == ListadoEnum.CONST_ESTADO_PACE_APROBADO_DIVISION ||
        x.codigo ==ListadoEnum.CONST_ESTADO_PACE_OBSERVADO)
    })
  }

  serviceTable(filtro) {
    return this.pacesService.buscarAsignacionG2Por(filtro)
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




  validarCheckBoxAprobar(row: any) {
    if (this.listEstado.find(x => x.idListadoDetalle == row.idTipoEstado).codigo == ListadoEnum.CONST_ESTADO_PACE_REGISTRADO ||
      this.listEstado.find(x => x.idListadoDetalle == row.idTipoEstado).codigo == ListadoEnum.CONST_ESTADO_PACE_ACTUALIZADO) {
      return false;
    }
    return true;
  }

  CheckBoxVisible(row: any) {
    if (this.listEstado.find(x => x.idListadoDetalle == row.idTipoEstado).codigo == ListadoEnum.CONST_ESTADO_PACE_APROBADO_DIVISION
    || this.listEstado.find(x => x.idListadoDetalle == row.idTipoEstado).codigo == ListadoEnum.CONST_ESTADO_PACE_OBSERVADO) {
      return false;
    }
    return true;
  }

  CheckBoxActivarAprobar(row: any) {
    if (this.listEstado.find(x => x.idListadoDetalle == row.idTipoEstado).codigo == ListadoEnum.CONST_ESTADO_PACE_APROBADO_DIVISION) {
      return true;
    }
    return false;
  }
  CheckBoxActivarObservado(row: any) {
    if (this.listEstado.find(x => x.idListadoDetalle == row.idTipoEstado).codigo == ListadoEnum.CONST_ESTADO_PACE_OBSERVADO) {
      return true;
    }
    return false;
  }

  desactivarBotonResultado(row: any) {
    if (this.listEstado.find(x => x.idListadoDetalle == row.idTipoEstado).codigo == ListadoEnum.CONST_ESTADO_PACE_REGISTRADO) {
      return true;
    }
    return false;
  }

  toggleSelectElement(element: any): void {
    if (this.selectionCheckBox.find(x => x == element.idPaces) != undefined || this.selectionCheckBox.find(x => x == element.idPaces) != null) {
      this.selectionCheckBox = this.selectionCheckBox.filter(item => item !== element.idPaces);
    } else {
      this.selectionCheckBox.push(element.idPaces);
    }
    console.log(this.selectionCheckBox);
  }

  habilitarAprobarMasivo(): boolean {

    if (this.selectionCheckBox.length > 0) {
      return true;
    }
    return false;
  }

  habilitarBotonResultado(row: any): boolean {

    if (this.listEstado.find(x => x.idListadoDetalle == row.idTipoEstado).codigo == ListadoEnum.CONST_ESTADO_PACE_OBSERVADO) {
      return true;
    }
    return false;
  }

  public mostrarAccion(row: any) { }

  public onActionChange(event: any, row: any) {
    try {
      const selectedValue = event.value;
      if (selectedValue == '2') {
        this.dialog.open(ModalObservarPaceDivisionComponent, {
          width: '800px',
          maxHeight: '100%',
          data: {
            pace: row,
            evento: "E"
          },
        }).afterClosed().subscribe(result => {
          if (result == 'OK') {
            this.ngOnInit();
          } else {
            this.ngOnInit();
          }
        });
      }

      if (selectedValue == '1') {
        let msj = '¿Está seguro de que desea aprobar el PACE?'
        functionsAlert.questionSiNo(msj).then((result) => {

          if (result.isConfirmed) {

            let filtro: PacesAprobarDivisionDTO = {
              idPaces: row ? row.idPaces : null,
              observacion: ""
            }

            this.pacesService.aprobarPaceDivision(filtro).subscribe(res2 => {
              this.sleep(1000).then(any => {
                functionsAlert.success('Se aprobó correctamente.').then((result) => {
                  this.ngOnInit();
                });
              })

            });
          }
          else {
            this.ngOnInit();
          }
        });
      }
    } catch (error) {
      functionsAlert.success('ocurrio un error.').then((result) => {
        this.ngOnInit();
      });
    }
  }

  getActionForRow(row: any): string | null {
    if (this.listEstado.find(x => x.idListadoDetalle == row.idTipoEstado).codigo == ListadoEnum.CONST_ESTADO_PACE_APROBADO_DIVISION) {
      return '1'; // Aprobar
    } else if (this.listEstado.find(x => x.idListadoDetalle == row.idTipoEstado).codigo == ListadoEnum.CONST_ESTADO_PACE_OBSERVADO) {
      return '2'; // Observar
    }
    return null; // Ninguna selección
  }

  public verObservacion(row) {
    this.dialog.open(ModalObservarPaceDivisionComponent, {
      width: '800px',
      maxHeight: '100%',
      data: {
        pace: row,
        evento: "M",
        listEstado:this.listEstado
      },
    }).afterClosed().subscribe(result => {
      if (result == 'OK') {
        this.ngOnInit();
      } else {
        this.ngOnInit();
      }
    });
  }
  public aprobacionMasiva() {

    try {
      let msj = '¿Está seguro de que desea aprobar de forma masiva?'
      functionsAlert.questionSiNo(msj).then((result) => {

        if (result.isConfirmed) {

          let listaPaces: PacesAprobarDivisionDTO[] = []

          this.selectionCheckBox.forEach(element => {

            let pace: PacesAprobarDivisionDTO = {
              idPaces: element,
              observacion: ""
            }
            listaPaces.push(pace);
          });


          this.pacesService.aprobacionMasivaPaceDivision(listaPaces).subscribe(res2 => {
            this.sleep(2000).then(any => {
              functionsAlert.success('Se aprobó correctamente.').then((result) => {
                this.ngOnInit();
              });
            })
          });
        }
        else {
          this.ngOnInit();
        }
      });
    } catch (error) {
      functionsAlert.success('ocurrio un error.').then((result) => {
        this.ngOnInit();
      });
    }
  }

}
