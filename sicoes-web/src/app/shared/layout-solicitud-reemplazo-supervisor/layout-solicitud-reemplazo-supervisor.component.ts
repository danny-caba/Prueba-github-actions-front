import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../components/base.component';

@Component({
  selector: 'vex-layout-solicitud-reemplazo-supervisor',
  templateUrl: './layout-solicitud-reemplazo-supervisor.component.html',
  styleUrls: ['./layout-solicitud-reemplazo-supervisor.component.scss']
})
export class LayoutSolicitudReemplazoSupervisorComponent extends BaseComponent implements OnInit {

  @Input() isReview: boolean;

  editable: boolean = true;
  marcacion: 'si' | 'no' | null = null;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  setValueCheckedCartaReemplazo(even) {
  }

}
