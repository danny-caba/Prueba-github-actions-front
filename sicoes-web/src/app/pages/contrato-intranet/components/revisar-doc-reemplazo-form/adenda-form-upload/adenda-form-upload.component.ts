import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'vex-adenda-form-upload',
  templateUrl: './adenda-form-upload.component.html',
  styleUrls: ['./adenda-form-upload.component.scss']
})
export class AdendaFormUploadComponent extends BaseComponent implements OnInit {

  @Input() idSolicitud: string;
  @Input() uuidSolicitud: string;

  itemSeccion: number = 0;
  isReview: boolean = false;
  isReviewExt: boolean = true;
  isCargaAdenda: boolean = true;

  constructor() {
    super();
   }

  ngOnInit(): void {
  }

}

