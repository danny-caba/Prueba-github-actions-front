import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '../components/base.component';
import { ParametriaService } from 'src/app/service/parametria.service';
import { DatePipe } from '@angular/common';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { Proceso } from 'src/app/interface/proceso.model';
import { ProcesoItemsService } from 'src/app/service/proceso-items.service';
import { MatTable } from '@angular/material/table';
import { ProcesoItemsPerfilService } from 'src/app/service/proceso-items-perfil.service';
import { BasePageComponent } from '../components/base-page.component';
import { MatPaginator } from '@angular/material/paginator';
import { MovimientoService } from 'src/app/service/movimiento.service';

@Component({
  selector: 'vex-modal-historial-profesional',
  templateUrl: './modal-historial-profesional.component.html',
  styleUrls: ['./modal-historial-profesional.component.scss']
})
export class ModalHistorialProfesionalComponent extends BasePageComponent<any> implements OnInit {

  PROCESO: Proceso
  procesoItem: any
  data: any
  filtro: any

  //idPropuestaProfesional:number;
  idSupervisora:number;
  listTipoCambio: ListadoDetalle[]
  listEstadoItem: ListadoDetalle[]
  listProcesoItemPerfil: any[] = []
  
  booleanAdd: boolean = true
  booleanEdit: boolean = false
  booleanView: boolean = false
  booleanViewPerfil: boolean = false

  displayedColumns: string[] = [
    'accion',
    'fecha',
    'usuario',
    'sector',
    'subsector',
    'perfil',
    'proceso',
    'item',
    'postor',
    'motivo'
  ];

  listTipo: ListadoDetalle[]

  constructor(
    private dialogRef: MatDialogRef<ModalHistorialProfesionalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private procesoItemsService: ProcesoItemsService,
    private movimiento: MovimientoService
  ) {
    super();

    this.data = data;
    this.filtro = data.filtro;
    console.log(this.data);
    this.PROCESO = data?.proceso;

    if (data.movimiento) {
      //console.log("idPropuestaProfesional-- :", data.movimiento.propuestaProfesional.idPropuestaProfesional);
      //this.idPropuestaProfesional = data.movimiento.propuestaProfesional.idPropuestaProfesional;
      this.idSupervisora = data.movimiento.idSupervisora;
      console.log(data);
      console.log(this.idSupervisora);
    }else{
      this.booleanViewPerfil = false;
    }

  }

  serviceTable(filtro) {
    return this.movimiento.buscarHistorial(this.idSupervisora,filtro);
  }

  obtenerFiltro() {
    return this.filtro;
  }

  ngOnInit(): void {
    this.cargarCombo();
    this.paginator.pageIndex = 0;
    this.cargarTabla();
  }

  cargarCombo() {
    
  }

  closeModal() {
    this.dialogRef.close();
  }

  verMotivo(element){
    const codigoMotivo = element?.tipoMotivo?.codigo; 
    if(codigoMotivo === 'MANUAL'){
      return element?.motivoDescripcion; 
    }
    return element?.motivo?.nombre;
  }


}
