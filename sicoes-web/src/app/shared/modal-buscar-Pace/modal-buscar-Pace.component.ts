
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { ListadoEnum } from 'src/helpers/constantes.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Mes } from 'src/app/interface/mes.model';
import { PacesService } from 'src/app/service/paces.service';

@Component({
  selector: 'vex-modal-buscar-Pace-accion',
  templateUrl: './modal-buscar-Pace.component.html',
  styleUrls: ['./modal-buscar-Pace.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})

export class ModalBuscarPaceComponent extends BasePageComponent<Solicitud> implements OnInit {



  //FIXME
  formGroup = this.fb.group({
    areaUsuaria: [null],
    estado: [null],
    mes: [null]
  });

  public listaDivisiones: any[];

  listEstado: any[]
  listSector: ListadoDetalle[]
  listSubSector: ListadoDetalle[]

  displayedColumns: string[] = [
    'seleccionar',
    'area',
    'pace',
    'mes'
    // 'estadoProceso'
    // 'actions'
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
    private fb: FormBuilder,
    private pacesService: PacesService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ModalBuscarPaceComponent>,
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    super();
    this.listEstado = data.listEstado;
    this.listaDivisiones = data.listaDivisiones;
  }

  ngOnInit(): void {
    this.cargarTabla();

  }

  public buscarData() {

  }

  serviceTable(filtro) {
    return this.pacesService.buscarAceptadosEnviadosPor(filtro)
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
    if (this.listaDivisiones != undefined && this.listaDivisiones != null) {
      return this.listaDivisiones.find(x => x.idDivision == idDivision).deDivision;
    }
    return '';
  }
  mostrarMes(idMes) {
    return this.meses.find(x => x.idMes == idMes).nombre;
  }

  mostrarEstado(idListadoDetalle) {
    return this.listEstado.find(x => x.idListadoDetalle == idListadoDetalle).nombre;
  }

  validarAbilitarBotonEditarEliminar(row: any) {
    if (this.listEstado.find(x => x.idListadoDetalle == row.idTipoEstado).codigo == ListadoEnum.CONST_ESTADO_PACE_REGISTRADO
      || this.listEstado.find(x => x.idListadoDetalle == row.idTipoEstado).codigo == ListadoEnum.CONST_ESTADO_PACE_OBSERVADO) {
      return true;
    }
    return false;
  }

  guardar() {
    console.log(this.selectedElement)
    this.dialogRef.close(this.selectedElement);


  }
  closeModal() {
    console.log(this.selectedElement)
    this.dialogRef.close(null);
  }

  selectionCheckBox: any[] = []
  selectedElement: any = null;
  selectElement(element: any): void {
    this.selectedElement = element;
  }

  habilitarImportar() {
    if (this.selectedElement) {
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
}
