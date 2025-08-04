import { Component, Input, OnInit } from '@angular/core';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'vex-docs-inicio-servicio-review',
  templateUrl: './docs-inicio-servicio-review.component.html',
  styleUrls: ['./docs-inicio-servicio-review.component.scss'],
  animations: [
    fadeInRight400ms,
    stagger80ms
  ]
})
export class DocsInicioServicioReviewComponent extends BaseComponent implements OnInit {

  @Input() idSolicitud: string;
  @Input() uuidSolicitud: string;

  itemSeccion: number = 0;
  isReview: boolean = false;

  constructor() {
    super();
   }

  ngOnInit(): void {
  }

}
