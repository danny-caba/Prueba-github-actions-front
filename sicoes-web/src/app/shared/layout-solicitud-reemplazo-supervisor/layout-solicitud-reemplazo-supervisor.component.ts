import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../components/base.component';

@Component({
  selector: 'vex-layout-solicitud-reemplazo-supervisor',
  templateUrl: './layout-solicitud-reemplazo-supervisor.component.html',
  styleUrls: ['./layout-solicitud-reemplazo-supervisor.component.scss']
})
export class LayoutSolicitudReemplazoSupervisorComponent extends BaseComponent implements OnInit {

  editable: boolean = true;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  setValueCheckedCartaReemplazo(even) {
  }

}
