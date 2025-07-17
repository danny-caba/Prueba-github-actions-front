import { Component, Input } from '@angular/core';
import { RequerimientoDocumentoDetalle } from 'src/app/interface/requerimiento.model';

@Component({
  selector: 'vex-documento-pn-detalle',
  templateUrl: './documento-pn-detalle.component.html'
})
export class DocumentoPnDetalleComponent {

  @Input() add: boolean;
  @Input() evaluate: boolean;
  @Input() requisito: RequerimientoDocumentoDetalle;
  @Input() rutaEvaluarDetalle: string[];

  constructor() {}

  onChangeCheckbox(event: any, requisito: RequerimientoDocumentoDetalle) {
    requisito.archivo = event.checked ? null : requisito.archivo;
  }

}
