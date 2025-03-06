import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RequisitoService } from 'src/app/service/requisito.service';

@Component({
  selector: 'vex-documento-contrato',
  templateUrl: './documento-contrato.component.html'
})
export class DocumentoContratoComponent implements OnInit, OnChanges {

  @Input() SECCION: any;
  @Input() CONTRATO: any;
  @Input() tipoContratoSeleccionado: any;
  @Input() evaluar: boolean;
  @Input() esSubsanacion: boolean;
  @Input() editable: boolean;
  @Input() view: boolean;
  requisitoSeleccionado: any;

  requisitos: any[] = [];

  constructor(
    private requisitoService: RequisitoService,
        private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (this.tipoContratoSeleccionado) {
      this.obtenerRequisitos();
    } else {
      console.error('tipoContratoSeleccionado no tiene valor al iniciar');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipoContratoSeleccionado'] && changes['tipoContratoSeleccionado'].currentValue) {
      this.obtenerRequisitos();
    }
    this.cdr.detectChanges();
    this.ngOnInit();
  }

  esArchivo(requisito: any) {
    return requisito.requisito.tipoDatoEntrada.nombre == 'Adjuntar Archivo';
  }

  obtenerRequisitos() {
    this.requisitoService.obtenerRequisitosPorSeccion(this.SECCION.idSolPerConSec, this.tipoContratoSeleccionado).subscribe(
      (response: any) => {
        this.requisitos = response.content;

        if (this.evaluar) {
          this.requisitos = this.requisitos.filter(requisito => requisito.flagRequisito === '1');
        }
      }
    );
  }

  setValueChecked(obj, even) {
    
    // obj.flagActivo = even.checked ? true : null;
  }

  getValues() {
    return this.requisitos;
  }

}
