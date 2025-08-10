import { Component, Input, OnInit } from '@angular/core';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { AuthUser } from 'src/app/auth/store/auth.models';
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

  usuario$ = this.authFacade.user$;
  codRolRevisor: string
  
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
  adjuntoSolicitudReemplazo: any;

  idInforme: number;
  idDjNepotismo: number;
  idDjImpedimento: number;
  idDJNoVinculo: number;
  idOtros: number;
  idSolicitudReemplazo: number;

  constructor(
    private reemplazoService: PersonalReemplazoService,
    private authFacade: AuthFacade
  ) {
    super();
   }

  ngOnInit(): void {
    this.cargarDatosReemplazo();
    this.usuario$.subscribe(usu => {
      this.setCodRolRevisor(usu);
    })
  }

  setCodRolRevisor(user: AuthUser){
    const codigosRevisores = ['02', '12', '15']
    this.codRolRevisor = user.roles.find(rol => codigosRevisores.includes(rol.codigo))?.codigo;
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
    this.setDatosSolicitudReemplazo();
  }

  setDatosInforme() {
    const doc = this.listDocumentosReemplazo.find(doc => doc.tipoDocumento.codigo === 'INFORME');
    
    let informe = {
      adjunto: {
        archivo: doc?.archivo
      }
    }
    this.adjuntoInforme = informe;
    this.idInforme = doc?.idDocumento; 
  }

  setDatosDjNepotismo() {
    const doc = this.listDocumentosReemplazo.find(doc => doc.tipoDocumento.codigo === 'DJ_PERSONAL_PROPUESTO');
    
    let djNepotismo = {
      adjunto: {
        archivo: doc?.archivo
      }
    }
    this.adjuntoDjNepotismo = djNepotismo;
    this.idDjNepotismo = doc?.idDocumento; 
  }

  setDatosDjImpedimento() {
    const doc = this.listDocumentosReemplazo.find(doc => doc.tipoDocumento.codigo === 'DJ_IMPEDIMENTOS');
    
    let djImpedimento = {
      adjunto: {
        archivo: doc?.archivo
      }
    }
    this.adjuntoDjImpedimento = djImpedimento;
    this.idDjImpedimento = doc?.idDocumento; 
  }

  setDatosDjNoVinculo() {
    const doc = this.listDocumentosReemplazo.find(doc => doc.tipoDocumento.codigo === 'DJ_NO_VINCULO');
    
    let djNoVinculo = {
      adjunto: {
        archivo: doc?.archivo
      }
    }
    this.adjuntoDjNoVinculo = djNoVinculo;
    this.idDJNoVinculo = doc?.idDocumento; 
  }

  setDatosOtros() {
    const doc = this.listDocumentosReemplazo.find(doc => doc.tipoDocumento.codigo === 'OTROS_DOCUMENTOS');
    
    let otros = {
      adjunto: {
        archivo: doc?.archivo
      }
    }
    this.adjuntoOtros = otros;
    this.idOtros = doc?.idDocumento; 
  }

  setDatosSolicitudReemplazo() {
    const doc = this.listDocumentosReemplazo.find(doc => doc.tipoDocumento.codigo === 'OFICIO_CARTA_SOLI_REEMPLAZO');
    
    let solicitud = {
      adjunto: {
        archivo: doc?.archivo
      }
    }
    this.adjuntoSolicitudReemplazo = solicitud;
    this.idSolicitudReemplazo = doc?.idDocumento; 
  }
}
