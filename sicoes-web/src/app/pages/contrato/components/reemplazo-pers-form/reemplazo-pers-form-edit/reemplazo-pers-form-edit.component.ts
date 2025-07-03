import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'vex-reemplazo-pers-form-edit',
  templateUrl: './reemplazo-pers-form-edit.component.html'
})
export class ReemplazoPersFormEditComponent extends BaseComponent implements OnInit {


  itemSeccion: number = 0;

  constructor() {
    super();
   }

  ngOnInit(): void {
  }

}
