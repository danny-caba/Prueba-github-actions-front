import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  @Output() seccionesCompletadas = new EventEmitter<boolean>();
  @Output() codigoRevisor = new EventEmitter<string>();
  @Output() allMarcasConforme = new EventEmitter<boolean>();
  @Output() allObsCompletas = new EventEmitter<boolean>();
  @Output() obsRegistrar = new EventEmitter<any>();

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
  adjuntoProyAdenda: any;

  idInforme: number;
  idDjNepotismo: number;
  idDjImpedimento: number;
  idDJNoVinculo: number;
  idOtros: number;
  idSolicitudReemplazo: number;
  idProyAdenda: number;

  seccionInformeCompletaFlag: boolean = false;
  seccionPersonalPropuestoCompletaFlag: boolean = false;
  seccionSolReemplazoCompletaFlag: boolean = false;
  seccionProyAdendaCompletaFlag: boolean = false;

  existeDocInformeFlag: boolean = false;
  existeDocDjNepotismoFlag: boolean = false;
  existeDocDjImpedimentoFlag: boolean = false;
  existeDocNoVinculoFlag: boolean = false;
  existeDocOtrosFlag: boolean = false;
  existeDocSolReemplazoFlag: boolean = false;
  existeDocProyAdendaFlag: boolean = false;

  allConformeInforme: boolean = false;
  allConformePersonalPropuesto: boolean = false;
  allConformeSolReemplazo: boolean = false;
  allConformeProyAdenda: boolean = false;

  observacionInforme: string;
  observacionDjNepotismo: string;
  observacionDjImpedimento: string;
  observacionDjNoVinculo: string;
  observacionOtros: string;
  observacionSolReemplazo: string;
  observacionProyAdenda: string;

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
    this.codRolRevisor = user?.roles.find(rol => codigosRevisores.includes(rol.codigo))?.codigo;
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
            this.verificarSeccionesCompletadas();
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
    this.setDatosProyAdenda();
  }

  setDatosInforme() {
    const doc = this.listDocumentosReemplazo.find(doc => doc.tipoDocumento.codigo === 'INFORME');
    if (doc) {
      this.existeDocInformeFlag = true;
    }
    
    let informe = {
      adjunto: {
        archivo: doc?.archivo
      }
    }
    this.adjuntoInforme = informe;
    this.observacionInforme = doc?.evaluacion?.observacion;
    this.idInforme = doc?.idDocumento; 
  }

  setDatosDjNepotismo() {
    const doc = this.listDocumentosReemplazo.find(doc => doc.tipoDocumento.codigo === 'DJ_PERSONAL_PROPUESTO');

    if (doc) {
      this.existeDocDjNepotismoFlag = true;
    }
    
    let djNepotismo = {
      adjunto: {
        archivo: doc?.archivo
      }
    }
    this.adjuntoDjNepotismo = djNepotismo;
    this.observacionDjNepotismo = doc?.evaluacion?.observacion;
    this.idDjNepotismo = doc?.idDocumento; 
  }

  setDatosDjImpedimento() {
    const doc = this.listDocumentosReemplazo.find(doc => doc.tipoDocumento.codigo === 'DJ_IMPEDIMENTOS');

    if (doc) {
      this.existeDocDjImpedimentoFlag = true;
    }
    
    let djImpedimento = {
      adjunto: {
        archivo: doc?.archivo
      }
    }
    this.adjuntoDjImpedimento = djImpedimento;
    this.observacionDjImpedimento = doc?.evaluacion?.observacion;
    this.idDjImpedimento = doc?.idDocumento; 
  }

  setDatosDjNoVinculo() {
    const doc = this.listDocumentosReemplazo.find(doc => doc.tipoDocumento.codigo === 'DJ_NO_VINCULO');

    if (doc) {
      this.existeDocNoVinculoFlag = true;
    }
    
    let djNoVinculo = {
      adjunto: {
        archivo: doc?.archivo
      }
    }
    this.adjuntoDjNoVinculo = djNoVinculo;
    this.observacionDjNoVinculo = doc?.evaluacion?.observacion;
    this.idDJNoVinculo = doc?.idDocumento; 
  }

  setDatosOtros() {
    const doc = this.listDocumentosReemplazo.find(doc => doc.tipoDocumento.codigo === 'OTROS_DOCUMENTOS');

    if (doc) {
      this.existeDocOtrosFlag = true;
    }
    
    let otros = {
      adjunto: {
        archivo: doc?.archivo
      }
    }
    this.adjuntoOtros = otros;
    this.observacionOtros = doc?.evaluacion?.observacion;
    this.idOtros = doc?.idDocumento; 
  }

  setDatosSolicitudReemplazo() {
    const doc = this.listDocumentosReemplazo.find(doc => doc.tipoDocumento.codigo === 'OFICIO_CARTA_SOLI_REEMPLAZO');

    if (doc) {
      this.existeDocSolReemplazoFlag = true;
    }
    
    let solicitud = {
      adjunto: {
        archivo: doc?.archivo
      }
    }
    this.adjuntoSolicitudReemplazo = solicitud;
    this.observacionSolReemplazo = doc?.evaluacion?.observacion;
    this.idSolicitudReemplazo = doc?.idDocumento; 
  }

  setDatosProyAdenda() {
    const doc = this.listDocumentosReemplazo.find(doc => doc.tipoDocumento.codigo === 'PROYECTO_ADENDA');

    if (doc) {
      this.existeDocProyAdendaFlag = true;
    }
    
    let solicitud = {
      adjunto: {
        archivo: doc?.archivo
      }
    }
    this.adjuntoProyAdenda = solicitud;
    this.observacionProyAdenda = doc?.evaluacion?.observacion;
    this.idProyAdenda = doc?.idDocumento; 
  }

  seccionInformeCompletada(completada: boolean): void {
    this.seccionInformeCompletaFlag = completada;
    this.verificarSeccionesCompletadas();
  }
  
  validarDocsSeccionInforme(){
    return !this.existeDocInformeFlag;
  }

  seccionPersonalPropuestoCompletada(completada: boolean): void {
    this.seccionPersonalPropuestoCompletaFlag = completada;
    this.verificarSeccionesCompletadas();
  }

  validarDocsSeccionPersonalPropuesto(){
    return !(this.existeDocDjNepotismoFlag 
      || this.existeDocDjImpedimentoFlag 
      || this.existeDocNoVinculoFlag 
      || this.existeDocOtrosFlag);
  }

  seccionSolicitudReemplazoCompletada(completada: boolean): void {
    this.seccionSolReemplazoCompletaFlag = completada;
    this.verificarSeccionesCompletadas();
  }
  
  validarDocsSeccionSolicitudReemplazo(){
    return !this.existeDocSolReemplazoFlag;
  }

  seccionProyAdendaCompletada(completada: boolean): void {
    this.seccionProyAdendaCompletaFlag = completada;
    this.verificarSeccionesCompletadas();
  }

  validarDocsSeccionProyAdenda(){
    return this.existeDocProyAdendaFlag;
  }

  private verificarSeccionesCompletadas(): void {

    console.log("adenda completada", this.seccionProyAdendaCompletaFlag)
    const todasCompletadas = (this.seccionInformeCompletaFlag || this.validarDocsSeccionInforme()) 
      && (this.seccionPersonalPropuestoCompletaFlag || this.validarDocsSeccionPersonalPropuesto())
      && (this.seccionSolReemplazoCompletaFlag || this.validarDocsSeccionSolicitudReemplazo())
      && (this.seccionProyAdendaCompletaFlag);

    const allConforme = this.allConformeInforme 
      && this.allConformePersonalPropuesto 
      && this.allConformeSolReemplazo
      && this.allConformeProyAdenda;

    this.seccionesCompletadas.emit(todasCompletadas);
    this.codigoRevisor.emit(this.codRolRevisor);
    this.allMarcasConforme.emit(allConforme)
  }

  recibirConformidadInforme(allConforme: boolean){
    this.allConformeInforme = allConforme;
  }

  recibirConformidadPersonalPropuesto(allConforme: boolean){
    this.allConformePersonalPropuesto = allConforme;
  }

  recibirConformidadSolReemplazo(allConforme: boolean){
    this.allConformeSolReemplazo = allConforme;
  }

  recibirConformidadProyAdenda(allConforme: boolean){
    this.allConformeProyAdenda = allConforme;
  }


  recibirObservacionInforme(observacion: string){
    this.observacionInforme = observacion;
    this.validarObservacionesCompletadas();
  }

  recibirObservacionDjNepotismo(observacion: string){
    this.observacionDjNepotismo = observacion;
    this.validarObservacionesCompletadas();
  }

  recibirObservacionDjImpedimento(observacion: string){
    this.observacionDjImpedimento = observacion;
    this.validarObservacionesCompletadas();
  }

  recibirObservacionDjNoVinculo(observacion: string){
    this.observacionDjNoVinculo = observacion;
    this.validarObservacionesCompletadas();
  }

  recibirObservacionOtros(observacion: string){
    this.observacionOtros = observacion;
    this.validarObservacionesCompletadas();
  }

  recibirObservacionSolReemplazo(observacion: string){
    this.observacionSolReemplazo = observacion;
    this.validarObservacionesCompletadas();
  }

  recibirObservacionProyAdenda(observacion: string){
    this.observacionProyAdenda = observacion;
    this.validarObservacionesCompletadas();
  }

  validarObservacionesCompletadas() {
    const  obsValidadas = !this.existeDocInformeFlag || this.isNotUndefinedEmpty(this.observacionInforme)
      && !this.existeDocInformeFlag || this.isNotUndefinedEmpty(this.observacionDjNepotismo)
      && !this.existeDocDjNepotismoFlag || this.isNotUndefinedEmpty(this.observacionDjImpedimento)
      && !this.existeDocDjImpedimentoFlag || this.isNotUndefinedEmpty(this.observacionDjNoVinculo)
      && !this.existeDocNoVinculoFlag || this.isNotUndefinedEmpty(this.observacionOtros)
      && !this.existeDocSolReemplazoFlag || this.isNotUndefinedEmpty(this.observacionSolReemplazo)
      && !this.existeDocProyAdendaFlag || this.isNotUndefinedEmpty(this.observacionProyAdenda)

      console.log("obs validadas -> ", obsValidadas)

      if (obsValidadas) {
        const obsList = [
          {
            idDocumento: this.idInforme,
            observacion: this.observacionInforme,
            idRol: 15
          },
          {
            idDocumento: this.idDjNepotismo,
            observacion: this.observacionDjNepotismo,
            idRol: 15
          },
          {
            idDocumento: this.idDjImpedimento,
            observacion: this.observacionDjImpedimento,
            idRol: 15
          },
          {
            idDocumento: this.idDJNoVinculo,
            observacion: this.observacionDjNoVinculo,
            idRol: 15
          },
          {
            idDocumento: this.idOtros,
            observacion: this.observacionOtros,
            idRol: 15
          },
          {
            idDocumento: this.idSolicitudReemplazo,
            observacion: this.observacionSolReemplazo,
            idRol: 15
          },
          {
            idDocumento: this.idProyAdenda,
            observacion: this.observacionProyAdenda,
            idRol: 15
          }
        ];

        this.allObsCompletas.emit(true);
        this.obsRegistrar.emit(obsList.filter(obs => obs.idDocumento != null));
      } else {
        this.allObsCompletas.emit(false);
      }
  }

  isNotUndefinedEmpty(obs: string): boolean {
    return !!obs?.trim();
  }
}
