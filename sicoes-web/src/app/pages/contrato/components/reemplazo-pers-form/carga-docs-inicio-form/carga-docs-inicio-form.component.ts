import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'vex-carga-docs-inicio-form',
  templateUrl: './carga-docs-inicio-form.component.html',
  styleUrls: ['./carga-docs-inicio-form.component.scss']
})
export class CargaDocsInicioFormComponent extends BaseComponent implements OnInit {

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
