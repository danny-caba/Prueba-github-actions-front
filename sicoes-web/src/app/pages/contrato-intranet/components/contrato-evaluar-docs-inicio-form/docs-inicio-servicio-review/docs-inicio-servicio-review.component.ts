import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { AuthUser } from 'src/app/auth/store/auth.models';
import { PersonalReemplazo } from 'src/app/interface/reemplazo-personal.model';
import { Supervisora } from 'src/app/interface/supervisora.model';
import { PersonalReemplazoService } from 'src/app/service/personal-reemplazo.service';
import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'vex-docs-inicio-servicio-review',
  templateUrl: './docs-inicio-servicio-review.component.html',
  styleUrls: ['./docs-inicio-servicio-review.component.scss'],
  animations: [
    fadeInRight400ms,
    stagger80ms
  ]
})
export class DocsInicioServicioReviewComponent extends BaseComponent implements OnInit {

  @Input() idSolicitud: string;
  @Input() idReemplazo: string;

  @Output() seccionesCompletadas = new EventEmitter<boolean>();
  @Output() codigoRevisor = new EventEmitter<string>();
  @Output() allMarcasConforme = new EventEmitter<boolean>();

  usuario$ = this.authFacade.user$;
  codRolRevisor: string

  personalReemplazo: PersonalReemplazo;
  listDocumentosReemplazo: any[] = [];

  adjContLaboral: any;
  adjsSctr: any[];
  adjsPoliza: any;
  adjExMedico: any;
  adjContAlqCamioneta: any;
  adjSoat: any;

  existeDocContLaboralFlag: boolean = false;
  existenDocsSctrFlag: boolean = false;
  existenDocsPolizaFlag: boolean = false;
  existeDocExMedicoFlag: boolean = false;
  existeDocContAlqCamionetaFlag: boolean = false;
  existeDocSoatFlag: boolean = false;

  seccionPersonalPropuestoCompletaFlag: boolean = false;
  seccionDocsAdicionalesFlag: boolean = false;

  allConformePersonalPropuesto: boolean = false;
  allConformeDocsAdicionales: boolean = false;

  itemSeccion: number = 0;

  isReview: boolean = false;

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

  cargarDatosReemplazo(): void {
    this.reemplazoService.obtenerPersonalReemplazo(Number(this.idReemplazo)).subscribe({
      next: (data) => { 
        this.personalReemplazo = data;
        this.reemplazoService.listarDocsReemplazo(Number(this.idReemplazo)).subscribe({
          next: (response) => {
            this.listDocumentosReemplazo = response.content;
            this.setAdjuntos();
            this.verificarSeccionesCompletadas();
          }
        })
      }
    });
  }

  setAdjuntos(): void {
    this.setDatosContratoLaboral();
    this.setDatosSctr();
    this.setDatosPoliza();
    this.setDatosExMedico();
    this.setDatosContAlqCamioneta();
    this.setDatosSoat();    
  }

  setDatosContratoLaboral(){
    const doc = this.listDocumentosReemplazo.find(
      doc => doc.tipoDocumento.codigo === 'CONTRATO_LABORAL');
    if (doc) {
      this.existeDocContLaboralFlag = true;
    }
    
    this.adjContLaboral = {
      idDocumento: doc?.idDocumento,
      fechaInicio: doc?.feFechaInicioValidez,
      fechaFin: doc?.feFechaFinValidez,
      adjunto: {
        archivo: doc?.archivo
      }
    };
  }

  setDatosSctr(){
    const docs: any[] = this.listDocumentosReemplazo.filter(doc => doc.tipoDocumento.codigo === 'SCTR');
    
    if (docs.length === 2) {
      this.existenDocsSctrFlag = true;
    }
    
    this.adjsSctr = docs.map(doc => ({
        idDocumento: doc?.idDocumento,
        fechaInicio: doc?.feFechaInicioValidez,
        fechaFin: doc?.feFechaFinValidez,
        adjunto: {
        archivo: doc?.archivo
      }
    }));
  }

  setDatosPoliza(){
    const docs: any[] = this.listDocumentosReemplazo.filter(doc => doc.tipoDocumento.codigo === 'POLIZA');
    
    if (docs.length === 2) {
      this.existenDocsPolizaFlag = true;
    }
    
    this.adjsPoliza = docs.map(doc => ({
        idDocumento: doc?.idDocumento,
        fechaInicio: doc?.feFechaInicioValidez,
        fechaFin: doc?.feFechaFinValidez,
        adjunto: {
        archivo: doc?.archivo
      }
    }));
  }

  setDatosExMedico(){
    const doc = this.listDocumentosReemplazo.find(
      doc => doc.tipoDocumento.codigo === 'EXAMEN_MEDICO');

    if (doc) {
      this.existeDocExMedicoFlag = true;
    }
    
    this.adjExMedico = {
      idDocumento: doc?.idDocumento,
      fechaInicio: doc?.feFechaInicioValidez,
      fechaFin: doc?.feFechaFinValidez,
      adjunto: {
        archivo: doc?.archivo
      }
    }; 
  }

  setDatosContAlqCamioneta(){
    const doc = this.listDocumentosReemplazo.find(
      doc => doc.tipoDocumento.codigo === 'CONTRATO_ALQUILER_CAMIONETA');

    if (doc) {
      this.existeDocContAlqCamionetaFlag = true;
    }
    
    this.adjContAlqCamioneta = {
      idDocumento: doc?.idDocumento,
      fechaInicio: doc?.feFechaInicioValidez,
      fechaFin: doc?.feFechaFinValidez,
      adjunto: {
        archivo: doc?.archivo
      }
    };
  }

  setDatosSoat(){
    const doc = this.listDocumentosReemplazo.find(
      doc => doc.tipoDocumento.codigo === 'SEGURO_SOAT');

    if (doc) {
      this.existeDocSoatFlag = true;
    }
    
    this.adjSoat = {
      idDocumento: doc?.idDocumento,
      fechaInicio: doc?.feFechaInicioValidez,
      fechaFin: doc?.feFechaFinValidez,
      adjunto: {
        archivo: doc?.archivo
      }
    };
  }

  setCodRolRevisor(user: AuthUser){
    this.codRolRevisor = user?.roles.find(rol => '02' === rol.codigo);
  }

  seccionPersonalPropuestoCompletada(completada: boolean): void {
    console.log('seccion pers propuesto completa -> ', completada)
    this.seccionPersonalPropuestoCompletaFlag = completada;
    this.verificarSeccionesCompletadas();
  }

  validarDocsSeccionPersonalPropuesto(){
    return !(this.existeDocContLaboralFlag 
      || this.existenDocsSctrFlag 
      || this.existenDocsPolizaFlag 
      || this.existeDocExMedicoFlag);
  }

  seccionDocsAdicionalesCompletada(completada: boolean): void {
    this.seccionDocsAdicionalesFlag = completada;
    this.verificarSeccionesCompletadas();
  }

  validarDocsSeccionDocsAdicionales(){
    return !(this.existeDocContAlqCamionetaFlag 
      || this.existeDocSoatFlag);
  }

  private verificarSeccionesCompletadas(): void {
    const todasCompletadas = (this.seccionPersonalPropuestoCompletaFlag || this.validarDocsSeccionPersonalPropuesto()) 
      && (this.seccionDocsAdicionalesFlag || this.validarDocsSeccionDocsAdicionales());

    console.log("conforme pers propuesto -> ", this.allConformePersonalPropuesto)
    console.log("conforme docs adicionales -> ", this.allConformeDocsAdicionales)

    const allConforme = this.allConformePersonalPropuesto 
      && this.allConformeDocsAdicionales;

    this.seccionesCompletadas.emit(todasCompletadas);
    this.codigoRevisor.emit(this.codRolRevisor);
    this.allMarcasConforme.emit(allConforme)
  }

  recibirConformidadPersonalPropuesto(allConforme: boolean){
    console.log('conformidad recibida pers propuesto -> ', allConforme)
    this.allConformePersonalPropuesto = allConforme;
  }

  recibirConformidadDocsAdicionales(allConforme: boolean){
    this.allConformeDocsAdicionales = allConforme;
  }

  getNombreCompleto(persona: Supervisora): string {
    if (!persona) return '';
    return `${persona.nombres} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`.trim();
  }

  getCantidadDocsInicioServicio(){
    const tiposDocsInicioServicio = [
      'CONTRATO_LABORAL',
      'SCTR',
      'POLIZA',
      'EXAMEN_MEDICO'
    ];
    return this.listDocumentosReemplazo.filter(
      doc => tiposDocsInicioServicio.includes(doc.tipoDocumento.codigo)).length;
  }
}
