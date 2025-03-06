import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RequisitoService } from 'src/app/service/requisito.service';

@Component({
  selector: 'vex-monto-diferencial',
  templateUrl: './monto-diferencial.component.html'
})
export class MontoDiferencialComponent implements OnInit, OnChanges {

  formGroup!: FormGroup;
  @Input() SECCION: any;
  @Input() CONTRATO: any;
  @Input() tipoContratoSeleccionado: any;
  @Input() evaluar: boolean;
  @Input() esSubsanacion: boolean;
  @Input() editable: boolean;
  @Input() view: boolean;
  requisitoSeleccionado: any;

  requisitos: any[] = [];
  requisitosFiltrado: any[] = [];
  disableForm: boolean = false;

  constructor(
    private requisitoService: RequisitoService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({});
    this.obtenerRequisitos();
  }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['tipoContratoSeleccionado'] && changes['tipoContratoSeleccionado'].currentValue) {
        this.obtenerRequisitos();
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
          this.calcularMontos();
        }
      }
    );
  }

  calcularMontos() {
    const MONTO_PROCESO_ITEM = this.CONTRATO?.propuesta?.procesoItem?.montoReferencial;
    const MONTO_PROPUESTA_ECONOMICA = Number(this.CONTRATO?.propuesta?.propuestaEconomica?.importe);
    const MONTO_DIFERENCIAL = MONTO_PROCESO_ITEM - MONTO_PROPUESTA_ECONOMICA;
    const MONTO_90_PORCIENTO = MONTO_PROCESO_ITEM * 0.9;

    this.requisitos.forEach(requisito => {
    
      if (MONTO_PROPUESTA_ECONOMICA < MONTO_90_PORCIENTO) {
        if (requisito.requisito.deSeccionRequisito === 'Valor estimado') {
          this.formGroup.get(requisito.idSolicitudSeccion.toString()).setValue(MONTO_PROCESO_ITEM);
          this.formGroup.get(requisito.idSolicitudSeccion.toString()).disable();
        }

        if (requisito.requisito.deSeccionRequisito === 'Monto de la propuesta economica') {
          this.formGroup.get(requisito.idSolicitudSeccion.toString()).setValue(MONTO_PROPUESTA_ECONOMICA);
          this.formGroup.get(requisito.idSolicitudSeccion.toString()).disable();
        }

        if (requisito.requisito.deSeccionRequisito === 'Monto Diferencial' || requisito.requisito.deSeccionRequisito === 'Garantía por monto diferencial de la propuesta') {
          this.formGroup.get(requisito.idSolicitudSeccion.toString()).setValue(MONTO_DIFERENCIAL);
          this.formGroup.get(requisito.idSolicitudSeccion.toString()).disable();
        }
      } else {
        this.disableForm = true;
      }

    });
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
          if (requisito.idSolicitudSeccion.toString() === key && requisito.requisito.tipoDatoEntrada.codigo === 'FECHA') {
            requisito.texto = value;
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
          disabled: this.evaluar || (this.esSubsanacion && requisito?.procRevision === '1') || this.CONTRATO.estadoProcesoSolicitud !== '1' || this.disableForm
        }];
      } else if (requisito.requisito.tipoDatoEntrada.codigo === 'NUMERICO') {
        grupo[key] = [{
          value: requisito.valor !== null && requisito.valor !== undefined ? requisito.valor : '',
          disabled: this.evaluar || (this.esSubsanacion && requisito?.procRevision === '1') || this.CONTRATO.estadoProcesoSolicitud !== '1' || this.disableForm
        }];
      } else if (requisito.requisito.tipoDatoEntrada.codigo === 'FECHA') {
        grupo[key] = [{
          value: requisito.texto !== null && requisito.texto !== undefined ? requisito.texto : '',
          disabled: this.evaluar || (this.esSubsanacion && requisito?.procRevision === '1') || this.CONTRATO.estadoProcesoSolicitud !== '1' || this.disableForm
        }];
      }
    });
  
    return this.fb.group(grupo);
  }

  getFormValues(): any {
    if (this.disableForm) {
      return {};
    } else {
      return { ...this.formGroup.getRawValue() };
    }
  }

  setValueChecked(obj, even) {
    
    // obj.flagActivo = even.checked ? true : null;
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
