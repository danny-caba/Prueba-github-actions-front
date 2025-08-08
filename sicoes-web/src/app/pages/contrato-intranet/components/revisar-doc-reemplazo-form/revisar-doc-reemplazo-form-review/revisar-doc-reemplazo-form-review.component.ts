import { Component, Input, OnInit } from '@angular/core';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { PersonalReemplazo } from 'src/app/interface/reemplazo-personal.model';
import { PersonalReemplazoService } from 'src/app/service/personal-reemplazo.service';
import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'vex-revisar-doc-reemplazo-form-review',
  templateUrl: './revisar-doc-reemplazo-form-review.component.html',
  styleUrls: ['./revisar-doc-reemplazo-form-review.component.scss'],
  animations: [
    fadeInRight400ms,
    stagger80ms
  ]
})
export class RevisarDocReemplazoFormReviewComponent extends BaseComponent implements OnInit {

  @Input() idReemplazo: string;
  @Input() idSolicitud: string;
  @Input() uuidSolicitud: string;

  itemSeccion: number = 0;
  isReview: boolean = false;
  isReviewExt: boolean = true;
  fecDesvinculacion: string = '';

  personalReemplazo: PersonalReemplazo;
  listDocumentosReemplazo: any[] = [];
  adjuntoInforme: any;
  idInforme: number;

  constructor(
    private reemplazoService: PersonalReemplazoService
  ) {
    super();
   }

  ngOnInit(): void {
    this.cargarDatosReemplazo();
  }

  cargarDatosReemplazo(): void {
    this.reemplazoService.obtenerPersonalReemplazo(Number(this.idReemplazo)).subscribe({
      next: (data) => { 
        this.personalReemplazo = data;
        this.fecDesvinculacion = this.personalReemplazo.feFechaDesvinculacion.toString();
        this.reemplazoService.listarDocsReemplazo(Number(this.idReemplazo)).subscribe({
          next: (response) => {
            this.listDocumentosReemplazo = response.content;
            this.setAdjuntos();
          }
        })
      }
    });
  }

  setAdjuntos(): void {
    const doc = this.listDocumentosReemplazo.find(doc => doc.seccion.codigo === 'SOLICITUD_REEMPLAZO_SUPERVISOR');
    
    let informe = {
      adjunto: {
        archivo: doc?.archivo
      }
    }
    this.adjuntoInforme = informe;
    this.idInforme = doc?.idDocumento;
  }
}
