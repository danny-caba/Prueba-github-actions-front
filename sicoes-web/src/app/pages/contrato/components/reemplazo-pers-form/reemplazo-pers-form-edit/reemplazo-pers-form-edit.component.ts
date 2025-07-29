import { Component, Input, OnInit } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { SeccionReemplazoPersonal } from 'src/app/interface/seccion.model';
import { PersonalReemplazoService } from 'src/app/service/personal-reemplazo.service';
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
  isReview: boolean = false;
  secciones: SeccionReemplazoPersonal[] = [];

  constructor(
    private personalReemplazoService: PersonalReemplazoService
  ) {
    super();
   }

  ngOnInit(): void {
    this.cargarSecciones();
  }

  cargarSecciones(): void {
    this.personalReemplazoService.listarSeccionesPersonalReemplazo().subscribe((response) => {
        this.secciones = Array.isArray(response) ? response : [response];
      });
  }

}
