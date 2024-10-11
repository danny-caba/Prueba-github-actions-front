import {Component, Input } from '@angular/core';


@Component({
  selector: 'vex-modal-title',
  templateUrl: './modal-title.component.html',
  styleUrls: ['./modal-title.component.scss']
})
export class ModalTileComponent {

  @Input() titulo:string = '';
}
