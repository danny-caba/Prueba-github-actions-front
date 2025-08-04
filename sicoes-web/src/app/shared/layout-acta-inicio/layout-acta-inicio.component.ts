import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../components/base.component';

@Component({
  selector: 'vex-layout-acta-inicio',
  templateUrl: './layout-acta-inicio.component.html',
  styleUrls: ['./layout-acta-inicio.component.scss']
})
export class LayoutActaInicioComponent extends BaseComponent implements OnInit {

  @Input() isReview: boolean;

  editable: boolean = true;
  marcacion: 'si' | 'no' | null = null;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  setValueCheckedContratoLab(even) {
  }

}