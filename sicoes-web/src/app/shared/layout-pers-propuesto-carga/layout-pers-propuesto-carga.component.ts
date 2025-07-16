import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../components/base.component';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';

@Component({
  selector: 'vex-layout-pers-propuesto-carga',
  templateUrl: './layout-pers-propuesto-carga.component.html',
  styleUrls: ['./layout-pers-propuesto-carga.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class LayoutPersPropuestoCargaComponent extends BaseComponent implements OnInit {

  @Input() isReview?: boolean;

  editable: boolean = true;
  marcacion: 'si' | 'no' | null = null;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.isReview =this.isReview ?? false;
    console.log("isReview -> ", this.isReview);
  }

  setValueCheckedContratoLab(even) {
  }

}