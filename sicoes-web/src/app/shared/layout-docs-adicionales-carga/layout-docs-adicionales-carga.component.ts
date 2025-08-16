import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../components/base.component';

@Component({
  selector: 'vex-layout-docs-adicionales-carga',
  templateUrl: './layout-docs-adicionales-carga.component.html',
  styleUrls: ['./layout-docs-adicionales-carga.component.scss']
})
export class LayoutDocsAdicionalesCargaComponent extends BaseComponent implements OnInit {

  @Input() isReview: boolean;
  editable: boolean = true;
  contratoAlquilerRadio: 'si' | 'no' = 'si';
  seguroSoatRadio: 'si' | 'no' = 'no';

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  setValueCheckedContratoLab(even) {
  }

}