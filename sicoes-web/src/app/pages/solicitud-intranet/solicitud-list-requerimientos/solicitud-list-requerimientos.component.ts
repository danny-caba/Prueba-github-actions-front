import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-solicitud-list-requerimientos', 
  templateUrl: './solicitud-list-requerimientos.component.html',
  styleUrls: ['./solicitud-list-requerimientos.component.scss']
})
export class SolicitudListRequerimientosComponent implements OnInit {
  dataSourceRequerimientos = new MatTableDataSource<any>([]);
  displayedColumnsRequerimientos: string[] = ['numeroExpediente', 'fechaRequerimiento', 'gerenciaDivision', 'perfil', 'nombresApellidos', 'estado', 'acciones'];

  @ViewChild(MatPaginator) paginatorRequerimientos!: MatPaginator;
  @ViewChild(MatSort) sortRequerimientos!: MatSort;

  constructor() { }

  ngOnInit(): void {
    this.dataSourceRequerimientos.data = [
      { numeroExpediente: 'REQ-001', fechaRequerimiento: new Date(), gerenciaDivision: 'Gas Natural', perfil: 'STA_DED-1', nombresApellidos: 'Juan Perez', estado: 'Pendiente' },
      { numeroExpediente: 'REQ-002', fechaRequerimiento: new Date(), gerenciaDivision: 'Electricidad', perfil: 'STA_DED-2', nombresApellidos: 'Maria Lopez', estado: 'Aprobado' }
    ];
  }

  ngAfterViewInit() {
    this.dataSourceRequerimientos.paginator = this.paginatorRequerimientos;
    this.dataSourceRequerimientos.sort = this.sortRequerimientos;
  }

  regresar(): void {
    console.log('Regresar desde requerimientos');
  }
}