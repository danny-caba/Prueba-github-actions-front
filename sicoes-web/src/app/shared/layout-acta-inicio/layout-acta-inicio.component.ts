import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../components/base.component';

@Component({
  selector: 'vex-layout-acta-inicio',
  templateUrl: './layout-acta-inicio.component.html',
  styleUrls: ['./layout-acta-inicio.component.scss']
})
export class LayoutActaInicioComponent extends BaseComponent implements OnInit {

  @Input() isReview: boolean;
  @Input() personalReemplazo: any;

  @Output() seccionCompletada = new EventEmitter<boolean>();
  @Output() fechaInicio = new EventEmitter<string>();

  editable: boolean = true;
  adjuntoCargadoActaInicio: boolean = false;

  fechaSeleccionada: string = null;

  marcacion: 'SI' | 'NO' | null = null;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['personalReemplazo'] && changes['personalReemplazo'].currentValue) {
      const nuevoPersonalReemplazo = changes['personalReemplazo'].currentValue;
      this.personalReemplazo = nuevoPersonalReemplazo;
    }
  }

  onActaInicioAdjunto(valor: boolean) {
    this.adjuntoCargadoActaInicio = valor;
    this.seccionCompletada.emit(this.validarSeccionCompletada());
  }

  onFechaChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.fechaSeleccionada = input.value;
    this.fechaInicio.emit(this.fechaSeleccionada);
    this.seccionCompletada.emit(this.validarSeccionCompletada());
  }

  validarSeccionCompletada() {
    return this.adjuntoCargadoActaInicio && !!this.fechaSeleccionada;
  }

  setValueCheckedContratoLab(even) {
  }

}