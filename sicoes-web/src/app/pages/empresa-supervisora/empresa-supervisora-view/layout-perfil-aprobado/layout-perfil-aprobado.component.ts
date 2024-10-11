import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { TipoPersonaEnum } from 'src/helpers/constantes.components';

@Component({
  selector: 'vex-layout-perfil-aprobado',
  templateUrl: './layout-perfil-aprobado.component.html',
  styleUrls: ['./layout-perfil-aprobado.component.scss']
})
export class LayoutPerfilAprobadoComponent implements OnInit {

  tipoPersonaEnum = TipoPersonaEnum
  @Input() SUPERVISORA: any;

  displayedColumns: string[] = [
    'expediente',
    'perfiles',
    'fecha'
  ];

  @Input() ELEMENT_DATA: any[] = [];
  dataSource: any
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(
  ) {
    
  }

  ngOnInit(): void {
    this.ELEMENT_DATA = this.SUPERVISORA.supervisoraPerfiles;
    this.dataSource = this.ELEMENT_DATA;
  }

}
