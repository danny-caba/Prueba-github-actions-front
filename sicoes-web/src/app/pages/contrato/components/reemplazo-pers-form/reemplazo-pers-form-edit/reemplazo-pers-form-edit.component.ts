import { Component, Input, OnInit } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'vex-reemplazo-pers-form-edit',
  templateUrl: './reemplazo-pers-form-edit.component.html',
  styleUrls: ['./reemplazo-pers-form-edit.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ReemplazoPersFormEditComponent extends BaseComponent implements OnInit {

  @Input() idSolicitud: string;
  @Input() uuidSolicitud: string;
  itemSeccion: number = 0;

  constructor() {
    super();
   }

  ngOnInit(): void {
  }

}
