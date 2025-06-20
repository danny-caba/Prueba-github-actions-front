import { AfterViewInit, Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { DocumentoContratoComponent } from '../documento-contrato/documento-contrato.component';
import { PersonalPropuestoComponent } from '../personal-propuesto/personal-propuesto.component';
import { FielCumplimientoComponent } from '../fiel-cumplimiento/fiel-cumplimiento.component';
import { MontoDiferencialComponent } from '../monto-diferencial/monto-diferencial.component';
import { SeccionService } from 'src/app/service/seccion.service';
import { Seccion } from 'src/app/interface/seccion.model';

@Component({
  selector: 'vex-contrato-seccion',
  templateUrl: './contrato-seccion.component.html'
})
export class ContratoSeccionComponent implements OnInit, AfterViewInit {

  @Input() CONTRATO: any;
  @Input() SECCION: Seccion;
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

  private montoSuperadoVerificado = false;
  private noSuperaAdjudicacion = false;

  constructor(
    private seccionService: SeccionService
  ) { }

  ngAfterViewInit(): void {
    if (this.documentoContrato) {
      this.documentoContratoInitialized.emit(this.documentoContrato);
    }
    if (this.personalPropuesto) {
      this.personalPropuestoInitialized.emit(this.personalPropuesto);
    }
    if (this.fielCumplimiento) {
      this.onFielCumplimientoInit(this.fielCumplimiento);
    }
    if (this.montoDiferencial) {
      this.montoDiferencialInitialized.emit(this.montoDiferencial);
    }
  }

  ngOnInit(): void {
    if (this.seccionFielCumplimiento()) {
      this.verificarMontoAdjudicacion();
    }
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
    return this.SECCION.deSeccion.includes('CARTA FIANZA DEL MONTO DIFERENCIAL');
  }

  noSuperaMontoAdjudicacion() {
    return this.noSuperaAdjudicacion;
  }

  verificarMontoAdjudicacion() {
    if (this.montoSuperadoVerificado) {
      return;
    }

    const adjudicacionStr = this.CONTRATO.valorAdjSimplificada.toString().replace(',', '.');
    const MONTO_FIJO = Number(adjudicacionStr);
    let importeStr = this.CONTRATO?.propuesta?.propuestaEconomica?.importe?.toString().replace(',', '.');
    let importe = Number(importeStr);
    
    this.seccionService.obtenerSeccionMaestraPorId(this.SECCION.idSeccion).subscribe({
      next: (response) => {
        if (response.flVisibleSeccion === '0') {
          this.noSuperaAdjudicacion = importe <= MONTO_FIJO;
        } else {
          this.noSuperaAdjudicacion = false;
        }
        this.montoSuperadoVerificado = true;
      },
      error: (err) => {
        console.error('Error al obtener sección maestra:', err);
        this.montoSuperadoVerificado = true;
        this.noSuperaAdjudicacion = false;
      }
    });
  }

  onFielCumplimientoInit(component: FielCumplimientoComponent) {
    if (!this.noSuperaAdjudicacion) {
      this.fielCumplimientoInitialized.emit(component);
    }
  }
}
