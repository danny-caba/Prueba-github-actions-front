import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'vex-carga-docs-inicio-add',
  templateUrl: './carga-docs-inicio-add.component.html',
  styleUrls: ['./carga-docs-inicio-add.component.scss']
})
export class CargaDocsInicioAddComponent extends BaseComponent implements OnInit {

  @Input() idSolicitud: string;
  @Input() uuidSolicitud: string;
  @Input() data:any;

  itemSeccion: number = 0;
  isReview: boolean = false;

  constructor() {
    super();
   }

  ngOnInit(): void {
    console.log("entrando")
  }

}
