import { Component, Input, OnChanges, ViewChild, OnInit, SimpleChanges, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { ProcesoItemsPerfilService } from 'src/app/service/proceso-items-perfil.service';
import { BaseComponent } from '../components/base.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { functionsAlertMod2 } from 'src/helpers/funtionsAlertMod2';
import { functions } from 'src/helpers/functions';

@Component({
  selector: 'vex-layout-item-perfil',
  templateUrl: './layout-item-perfil.component.html',
  styleUrls: ['./layout-item-perfil.component.scss'],
  animations: [
    stagger80ms
  ]
})
export class LayoutItemPerfilComponent extends BaseComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() procesoItem;
  @Input() PROCESO;
  @Input() booleanView: boolean = false

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild('paginator') paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;

  @Input() listProcesoItemPerfil: any[];

  displayedColumns: string[] = [
    'perfil',
    'cantidad',
    'acciones'
  ];

  serviceTable(filtro: any) {
    return this.procesoItemsPerfilService.buscarItemsPerfiles(filtro, this.procesoItem?.procesoItemUuid);
  }

  obtenerFiltro() {
    return {
      size: 1000
    };
  }

  constructor(
    private procesoItemsPerfilService: ProcesoItemsPerfilService
  ) {
    super();
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.listProcesoItemPerfil);
    this.dataSource.paginator = this.paginator;
  }

  actualizarTablaLocal(elem){
    if(functions.esVacio(elem.perfil)) return;

    const elementoExistente = this.listProcesoItemPerfil.find(item => item.perfil.idListadoDetalle === elem.perfil.idListadoDetalle);
    if(elementoExistente){
      functionsAlertMod2.alertArribaDerrecha('Ya existe un registro del perfil seleccionado');
      return;
    }
    this.listProcesoItemPerfil.push(elem);
    this.dataSource = new MatTableDataSource(this.listProcesoItemPerfil);
    this.dataSource.paginator = this.paginator;
    this.table.renderRows();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.procesoItem?.procesoItemUuid){
      //this.cargarTabla();
      this.actualizarTabla();
    }
    if(this.listProcesoItemPerfil){
      this.dataSource = new MatTableDataSource(this.listProcesoItemPerfil);
      this.dataSource.paginator = this.paginator;
      this.actualizarTabla();
    }
  }

  actualizarTabla(){
    /*this.procesoItemsPerfilService.buscarItemsPerfiles(this.obtenerFiltro(), this.procesoItem?.procesoItemUuid).subscribe(res => {
      //this.listProcesoItemPerfil = res.content;
      
    });*/
    this.table?.renderRows();
  }

  ngOnInit(): void {

  }

  agregarPerfil() {
    /*this.dialog.open(ModalPerfilComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        solicitud: this.solitidud,
        accion: 'add',
        esPersonaNat: this.ES_PERS_NAT
      },
    }).afterClosed().subscribe(() => {
      this.cargarTabla();
    });*/
  }

  actualizarVer(obj, action) {
    /*this.dialog.open(ModalPerfilComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        solicitud: this.solitidud,
        accion: action,
        perfil: obj,
        esPersonaNat: this.ES_PERS_NAT
      },
    }).afterClosed().subscribe(() => {
      this.cargarTabla();
    });*/
  }

  eliminarItemPerfil(obj, index) {
    this.listProcesoItemPerfil.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.listProcesoItemPerfil);
    this.dataSource.paginator = this.paginator;
    this.actualizarTabla();
    //console.info(event)
    /*let req = {
      procesoItemUuid: this.procesoItem.procesoItemUuid
    }
    functionsAlert.questionSiNo('¿Seguro que desea eliminar el registro?').then((result) => {
      if (result.isConfirmed) {
        this.procesoItemsPerfilService.eliminarProcesoItemsPerfil(obj.idProcesoItemPerfil, req).subscribe(sol => {
          functionsAlert.success('Registro Eliminado').then((result) => {
            this.actualizarTabla();
          });
        });
      }
    });
    */
  }
}
