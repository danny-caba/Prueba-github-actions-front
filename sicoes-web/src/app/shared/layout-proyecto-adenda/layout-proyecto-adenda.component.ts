import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../components/base.component';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';

@Component({
  selector: 'vex-layout-proyecto-adenda',
  templateUrl: './layout-proyecto-adenda.component.html',
  styleUrls: ['./layout-proyecto-adenda.component.scss'],
  animations: [
    fadeInRight400ms,
    stagger80ms
  ]
})
export class LayoutProyectoAdendaComponent extends BaseComponent implements OnInit {

  @Input() isReview: boolean;
  @Input() isReviewExt: boolean;
  @Input() isCargaAdenda: boolean;

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