import { AfterViewInit, Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { DocumentoContratoComponent } from '../documento-contrato/documento-contrato.component';
import { PersonalPropuestoComponent } from '../personal-propuesto/personal-propuesto.component';
import { FielCumplimientoComponent } from '../fiel-cumplimiento/fiel-cumplimiento.component';
import { MontoDiferencialComponent } from '../monto-diferencial/monto-diferencial.component';

@Component({
  selector: 'vex-contrato-seccion',
  templateUrl: './contrato-seccion.component.html'
})
export class ContratoSeccionComponent implements OnInit, AfterViewInit {

  @Input() CONTRATO: any;
  @Input() SECCION: any;
  @Input() ORDEN: any;
  @Input() tipoContratoSeleccionado: any;
  @Input() evaluar: boolean;
  @Input() esSubsanacion: boolean;
  @Input() editable: boolean;
  @Input() listTipoContrato: any;
  @Input() view: boolean;
  @Output() documentoContratoInitialized = new EventEmitter<DocumentoContratoComponent>();
  @Output() personalPropuestoInitialized = new EventEmitter<PersonalPropuestoComponent>();
  @Output() fielCumplimientoInitialized = new EventEmitter<FielCumplimientoComponent>();
  @Output() montoDiferencialInitialized = new EventEmitter<MontoDiferencialComponent>();
  @ViewChild('documentoContrato', { static: false }) documentoContrato: DocumentoContratoComponent;
  @ViewChild('personalPropuesto', { static: false }) personalPropuesto: PersonalPropuestoComponent;
  @ViewChild('fielCumplimiento', { static: false }) fielCumplimiento: FielCumplimientoComponent;
  @ViewChild('montoDiferencial', { static: false }) montoDiferencial: MontoDiferencialComponent;

  constructor() { }

  ngAfterViewInit(): void {
    if (this.documentoContrato) {
      this.documentoContratoInitialized.emit(this.documentoContrato);
    }
    if (this.personalPropuesto) {
      this.personalPropuestoInitialized.emit(this.personalPropuesto);
    }
    if (this.fielCumplimiento) {
      this.fielCumplimientoInitialized.emit(this.fielCumplimiento);
    }
    if (this.montoDiferencial) {
      this.montoDiferencialInitialized.emit(this.montoDiferencial);
    }
  }

  ngOnInit(): void {
  }

  seccionDocumentoContrato() {
    return this.SECCION.deSeccion.includes('DOCUMENTOS REQUERIDOS PARA SUSCRIBIR EL CONTRATO');
  }

  seccionPersonalPropuesto() {
    return this.SECCION.deSeccion.includes('DEL PERSONAL PROPUESTO');
  }

  seccionFielCumplimiento() {
    return this.SECCION.deSeccion.includes('CARTA FIANZA DE FIEL CUMPLIMIENTO');
  }

  seccionMontoDiferencial() {
    return this.SECCION.deSeccion.includes('4.- CARTA FIANZA DEL MONTO DIFERENCIAL');
  }

}
