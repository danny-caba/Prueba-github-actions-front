import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../components/base.component';

@Component({
  selector: 'vex-layout-solicitud-reemplazo-supervisor',
  templateUrl: './layout-solicitud-reemplazo-supervisor.component.html',
  styleUrls: ['./layout-solicitud-reemplazo-supervisor.component.scss']
})
export class LayoutSolicitudReemplazoSupervisorComponent extends BaseComponent implements OnInit {

  @Input() idSolicitud: string;
  @Input() isReview: boolean;
  @Input() isReviewExt: boolean;
  @Input() isCargaAdenda: boolean;
  @Input() perfilBaja: any;

  editable: boolean = true;
  marcacion: 'si' | 'no' | null = null;
  adjuntoCargadoSolicitud: boolean = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  setValueCheckedCartaReemplazo(even) {
  }

  onSolicitudAdjunta(valor: boolean) {
    this.adjuntoCargadoSolicitud = valor;
  }

}
