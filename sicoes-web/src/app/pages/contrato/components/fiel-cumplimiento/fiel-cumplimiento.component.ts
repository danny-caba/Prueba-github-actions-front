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

  constructor(
    private requisitoService: RequisitoService,
    private fb: FormBuilder,
    private contratoService: ContratoService
  ) { }

  ngOnInit(): void {
    this.tipoCartaSeleccionado = '1';
    this.formGroup = this.fb.group({});
    this.obtenerRequisitos();
    this.cartaFianzaFielCumplimiento = this.tipoContratoSeleccionado;
    this.esFielCumplimiento();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipoContratoSeleccionado'] && changes['tipoContratoSeleccionado'].currentValue) {
      this.obtenerRequisitos();
      this.esFielCumplimiento();
    }
  }

  superaMontoFijo() {
    const MONTO_FIJO = 240000;
    if (this.esFielCumplimientoSol) {
      let NumberMontoFijo = Number(this.CONTRATO?.propuesta?.propuestaEconomica?.importe);
      if (NumberMontoFijo > MONTO_FIJO) {
        this.disableForm = false;
        this.requisitos.forEach(requisito => {
          if (requisito.requisito.deSeccionRequisito === 'Monto Contrato') {
            this.formGroup.get(requisito.idSolicitudSeccion.toString()).setValue(this.CONTRATO?.propuesta?.propuestaEconomica?.importe);
            this.formGroup.get(requisito.idSolicitudSeccion.toString()).disable();
          }
        });
      } else {
        this.disableForm = true;
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
    this.requisitoService.obtenerRequisitosPorSeccion(this.SECCION.idSolPerConSec, this.tipoContratoSeleccionado).subscribe(
      (response: any) => {
        this.requisitos = response.content;
        if (this.evaluar) {
          this.requisitos = this.requisitos.filter(requisito => requisito.flagRequisito === '1');
        }
        this.formGroup = this.crearFormulario(this.requisitos);
        if (!this.evaluar) {
          this.superaMontoFijo();
        }
      }
    );
  }

  getValues() {
    let requisitos;
    const formValues = this.getFormValues();
    // return formValues; 
    
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
    
        // Eliminar si formValues está vacío y cumple la condición
        if (Object.entries(formValues).length === 0) {
          return !(requisito.requisito.tipoDatoEntrada.codigo === 'TEXTO' || requisito.requisito.tipoDatoEntrada.codigo === 'NUMERICO' || requisito.requisito.tipoDatoEntrada.codigo === 'FECHA');
        }

        //INICIO borrar cuando se implemente input de fecha
        // else {
        //   return !(requisito.requisito.tipoDatoEntrada.codigo === 'FECHA');
        // }
        //FIN borrar cuando se implemente input de fecha
    
        return true; // Mantener si no cumple la condición de eliminación
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
    requisitosFiltrados.forEach(requisito => {
      const key = requisito.idSolicitudSeccion.toString();
      if (requisito.requisito.tipoDatoEntrada.codigo === 'TEXTO') {
        grupo[key] = [{
          value: requisito.texto !== null && requisito.texto !== undefined ? requisito.texto : '',
          disabled: this.evaluar || (this.esSubsanacion && requisito?.procRevision === '1') || this.CONTRATO.estadoProcesoSolicitud !== '1' || !this.esFielCumplimientoSol || this.disableForm
        }];
      } else if (requisito.requisito.tipoDatoEntrada.codigo === 'NUMERICO') {
        grupo[key] = [{
          value: requisito.valor !== null && requisito.valor !== undefined ? requisito.valor : '',
          disabled: this.evaluar || (this.esSubsanacion && requisito?.procRevision === '1') || this.CONTRATO.estadoProcesoSolicitud !== '1' || !this.esFielCumplimientoSol || this.disableForm
        }];
      } else if (requisito.requisito.tipoDatoEntrada.codigo === 'FECHA') {
        grupo[key] = [{
          value: requisito.texto !== null && requisito.texto !== undefined ? requisito.texto : '',
          disabled: this.evaluar || (this.esSubsanacion && requisito?.procRevision === '1') || this.CONTRATO.estadoProcesoSolicitud !== '1' || !this.esFielCumplimientoSol || this.disableForm
        }];
      }

    });
  
    return this.fb.group(grupo);
  }

  getFormValues(): any {
    if (this.disableForm || this.esFielCumplimientoSol === false) {
      return {};
    } else {
      return { ...this.formGroup.getRawValue() };
    }
  }

  setValueChecked(obj, even) {
    
    // obj.flagActivo = even.checked ? true : null;
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
