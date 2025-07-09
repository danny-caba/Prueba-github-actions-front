import { Component, Input, OnInit } from '@angular/core';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'vex-contrato-form-eval-reemp-review',
  templateUrl: './contrato-form-eval-reemp-review.component.html',
  styleUrls: ['./contrato-form-eval-reemp-review.component.scss'],
  animations: [
    fadeInRight400ms,
    stagger80ms
  ]
})
export class ContratoFormEvalReempReviewComponent extends BaseComponent implements OnInit {

  @Input() idSolicitud: string;
  @Input() uuidSolicitud: string;

  itemSeccion: number = 0;
  isReview: boolean = true;

  constructor() {
    super();
   }

  ngOnInit(): void {
  }

}