import {Component, Input } from '@angular/core';


@Component({
  selector: 'vex-modal-title-2',
  templateUrl: './modal-title-2.component.html',
  styleUrls: ['./modal-title-2.component.scss']
})
export class ModalTileComponent2 {

  @Input() titulo:string = '';
}
