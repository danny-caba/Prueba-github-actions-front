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
  adjuntoDjNepotismo: any;
  adjuntoDjImpedimento: any;
  adjuntoDjNoVinculo: any;
  adjuntoOtros: any;

  idInforme: number;
  idDjNepotismo: number;
  idDjImpedimento: number;
  idDJNoVinculo: number;
  idOtros: number;

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
    this.setDatosInforme();
    this.setDatosDjNepotismo();
    this.setDatosDjImpedimento();
    this.setDatosDjNoVinculo();
    this.setDatosOtros();
  }

  setDatosInforme() {
    const doc = this.listDocumentosReemplazo.find(doc => doc.seccion.codigo === 'INFORME');
    
    let informe = {
      adjunto: {
        archivo: doc?.archivo
      }
    }
    this.adjuntoInforme = informe;
    this.idInforme = doc?.idDocumento; 
  }

  setDatosDjNepotismo() {
    const doc = this.listDocumentosReemplazo.find(doc => doc.seccion.codigo === 'DJ_PERSONAL_PROPUESTO');
    
    let djNepotismo = {
      adjunto: {
        archivo: doc?.archivo
      }
    }
    this.adjuntoDjNepotismo = djNepotismo;
    this.idDjNepotismo = doc?.idDocumento; 
  }

  setDatosDjImpedimento() {
    const doc = this.listDocumentosReemplazo.find(doc => doc.seccion.codigo === 'DJ_IMPEDIMENTOS');
    
    let djImpedimento = {
      adjunto: {
        archivo: doc?.archivo
      }
    }
    this.adjuntoDjImpedimento = djImpedimento;
    this.idDjImpedimento = doc?.idDocumento; 
  }

  setDatosDjNoVinculo() {
    const doc = this.listDocumentosReemplazo.find(doc => doc.seccion.codigo === 'DJ_NO_VINCULO');
    
    let djNoVinculo = {
      adjunto: {
        archivo: doc?.archivo
      }
    }
    this.adjuntoDjNoVinculo = djNoVinculo;
    this.idDJNoVinculo = doc?.idDocumento; 
  }

  setDatosOtros() {
    const doc = this.listDocumentosReemplazo.find(doc => doc.seccion.codigo === 'OTROS_DOCUMENTOS');
    
    let otros = {
      adjunto: {
        archivo: doc?.archivo
      }
    }
    this.adjuntoOtros = otros;
    this.idOtros = doc?.idDocumento; 
  }
}
