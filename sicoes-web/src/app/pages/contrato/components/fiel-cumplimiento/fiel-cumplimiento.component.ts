import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RequisitoService } from 'src/app/service/requisito.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContratoService } from 'src/app/service/contrato.service';
@Component({
  selector: 'vex-fiel-cumplimiento',
  templateUrl: './fiel-cumplimiento.component.html'
})
export class FielCumplimientoComponent implements OnInit, OnChanges {

  formGroup!: FormGroup;
  @Input() SECCION: any;
  @Input() CONTRATO: any;
  @Input() tipoContratoSeleccionado: any;
  @Input() evaluar: boolean;
  @Input() esSubsanacion: boolean;
  @Input() editable: boolean;
  @Input() view: boolean;
  @Input() listTipoContrato: any;
  cartaFianzaFielCumplimiento: boolean;
  requisitoSeleccionado: any;
  esFielCumplimientoSol: boolean;
  tipoCartaSeleccionado: any;
  disableForm: boolean = false;

  requisitos: any[] = [];
  requisitosFiltrado: any[] = [];
  MONTO_FIJO: any = 0;

  constructor(
    private requisitoService: RequisitoService,
    private fb: FormBuilder,
    private contratoService: ContratoService
  ) { }

  ngOnInit(): void {
    this.tipoCartaSeleccionado = '1';
    this.formGroup = this.fb.group({});
    this.cartaFianzaFielCumplimiento = this.tipoContratoSeleccionado;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipoContratoSeleccionado'] && changes['tipoContratoSeleccionado'].currentValue) {
      this.obtenerRequisitos();
    }
  }

  superaMontoFijo() {
    const MONTO_FIJO = Number(this.CONTRATO.valorAdjSimplificada);
    if (this.esFielCumplimientoSol) {
      let importeStr = this.CONTRATO?.propuesta?.propuestaEconomica?.importe?.toString().replace(',', '.');
      let numberMontoFijo = Number(importeStr);
      if (numberMontoFijo > MONTO_FIJO) {
        this.disableForm = false;
        this.requisitos.forEach(requisito => {
          if (requisito.requisito.deSeccionRequisito === 'Monto Contrato') {
            let formattedValueImporte = numberMontoFijo.toFixed(2);
            this.formGroup.get(requisito.idSolicitudSeccion.toString()).setValue(formattedValueImporte);
            this.formGroup.get(requisito.idSolicitudSeccion.toString()).disable();
          }
        });
      } else {
        this.disableForm = true;
        this.requisitos = this.requisitos.filter(requisito => requisito.requisito.flagVisibleFielCumplimiento === '1');
        this.crearFormulario(this.requisitos);
      }
    }
  }

  esArchivo(requisito: any) {
    return requisito.requisito.tipoDatoEntrada.nombre == 'Adjuntar Archivo';
  }

  esDato({requisito}: any) {
    return requisito.tipoDatoEntrada.codigo == 'TEXTO' || 
      requisito.tipoDatoEntrada.codigo == 'NUMERICO' ||
      requisito.tipoDatoEntrada.codigo == 'FECHA';
  }

  obtenerRequisitos() {
    this.requisitoService.obtenerRequisitosPorSeccion(
      this.SECCION.idSolPerConSec, 
      this.tipoContratoSeleccionado, 
      this.evaluar, 
      this.CONTRATO.propuesta.idPropuesta
    ).subscribe(
      (response: any) => {
        this.requisitos = response.content;
        if (this.evaluar) {
          this.requisitos = this.requisitos.filter(requisito => requisito.flagRequisito === '1');
        }
        this.formGroup = this.crearFormulario(this.requisitos);
        if (!this.evaluar) {
          this.esFielCumplimiento();
        }
      }
    );
  }

  getValues() {
    let requisitos;
    const formValues = this.getFormValues();
    
    if (formValues && typeof formValues === 'object') {
      requisitos = this.requisitos.filter(requisito => {
        Object.entries(formValues).forEach(([key, value]) => {
          if (requisito.idSolicitudSeccion.toString() === key && requisito.requisito.tipoDatoEntrada.codigo === 'TEXTO') {
            requisito.texto = value;
          }
          if (requisito.idSolicitudSeccion.toString() === key && requisito.requisito.tipoDatoEntrada.codigo === 'NUMERICO') {
            requisito.valor = value;
          }
        });
    
        if (Object.entries(formValues).length === 0) {
          return !(requisito.requisito.tipoDatoEntrada.codigo === 'TEXTO' || requisito.requisito.tipoDatoEntrada.codigo === 'NUMERICO' || requisito.requisito.tipoDatoEntrada.codigo === 'FECHA');
        }
    
        return true;
      });
    } else {
      console.error('formValues no es un objeto válido:', formValues);
    }
    

    return requisitos;
  }

  crearFormulario(requisitos: any[]): FormGroup {
    const grupo: { [key: string]: any } = {};
  
    // Filtrar los requisitos por tipo de dato de entrada
    const requisitosFiltrados = requisitos.filter(requisito =>
      requisito.requisito.tipoDatoEntrada.codigo === 'TEXTO' || 
      requisito.requisito.tipoDatoEntrada.codigo === 'NUMERICO' || 
      requisito.requisito.tipoDatoEntrada.codigo === 'FECHA'
    );
    

    this.requisitosFiltrado = requisitosFiltrados;
  
    // Construir los controles para los requisitos filtrados
    this.requisitosFiltrado.forEach(requisito => {
      const key = requisito.idSolicitudSeccion.toString();
      if (requisito.requisito.tipoDatoEntrada.codigo === 'TEXTO') {
        grupo[key] = [{
          value: requisito.texto !== null && requisito.texto !== undefined ? requisito.texto : '',
          disabled: this.evaluar || (this.esSubsanacion && requisito?.procRevision === '1') || this.CONTRATO.estadoProcesoSolicitud !== '1'
        }];
      } else if (requisito.requisito.tipoDatoEntrada.codigo === 'NUMERICO') {
        grupo[key] = [{
          value: requisito.valor !== null && requisito.valor !== undefined ? requisito.valor : '',
          disabled: this.evaluar || (this.esSubsanacion && requisito?.procRevision === '1') || this.CONTRATO.estadoProcesoSolicitud !== '1'
        }];
      } else if (requisito.requisito.tipoDatoEntrada.codigo === 'FECHA') {
        grupo[key] = [{
          value: requisito.texto !== null && requisito.texto !== undefined ? requisito.texto : '',
          disabled: this.evaluar || (this.esSubsanacion && requisito?.procRevision === '1') || this.CONTRATO.estadoProcesoSolicitud !== '1'
        }];
      }

    });
  
    return this.fb.group(grupo);
  }

  getFormValues(): any {
    return { ...this.formGroup.getRawValue() };
  }

  esFielCumplimiento() {
    
    let currentValueTipoContrato = this.listTipoContrato.find((tipoContrato: any) => tipoContrato.idListadoDetalle == this.tipoContratoSeleccionado);
    
    // Orden 3 === precio unitario
    if (currentValueTipoContrato.orden === 3) {
      this.esFielCumplimientoSol = true;
      this.tipoCartaSeleccionado = '1';
      this.superaMontoFijo();
    } else {    
      this.contratoService.validarRemype(this.CONTRATO?.propuesta?.supervisora?.numeroDocumento).subscribe(
        (response: any) => {
          if (response) {
            this.esFielCumplimientoSol = false;
            this.tipoCartaSeleccionado = '2';
            this.requisitos = this.requisitos.filter(requisito => requisito.requisito.flagVisibleRetencion === '1');
            this.crearFormulario(this.requisitos);
          } else {
            this.esFielCumplimientoSol = true;
            this.tipoCartaSeleccionado = '1';
            this.superaMontoFijo();
          }
        }
      );

    }
  }

  tipoDatoEntrada({requisito}: any) {
    switch (requisito.tipoDatoEntrada.codigo) {
      case 'TEXTO':
        return 'text';
      case 'NUMERICO':
        return 'number';
      case 'FECHA':
        return 'date';
      default:
        return 'text';
    }
  }

}
