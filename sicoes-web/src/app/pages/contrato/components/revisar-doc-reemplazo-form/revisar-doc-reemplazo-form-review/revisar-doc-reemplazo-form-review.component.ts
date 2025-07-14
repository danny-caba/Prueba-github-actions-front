import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'vex-revisar-doc-reemplazo-form-review',
  templateUrl: './revisar-doc-reemplazo-form-review.component.html',
  styleUrls: ['./revisar-doc-reemplazo-form-review.component.scss']
})
export class RevisarDocReemplazoFormReviewComponent extends BaseComponent implements OnInit {

  @Input() idSolicitud: string;
  @Input() uuidSolicitud: string;

  itemSeccion: number = 0;
  isReview: boolean = false;
  isReviewExt: boolean = true;

  constructor() {
    super();
   }

  ngOnInit(): void {
  }

}
