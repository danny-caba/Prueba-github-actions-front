import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../components/base.component';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { PersonalReemplazoService } from 'src/app/service/personal-reemplazo.service';
import { PersonalReemplazo } from 'src/app/interface/reemplazo-personal.model';

@Component({
  selector: 'vex-layout-proyecto-adenda',
  templateUrl: './layout-proyecto-adenda.component.html',
  styleUrls: ['./layout-proyecto-adenda.component.scss'],
  animations: [
    fadeInRight400ms,
    stagger80ms
  ]
})
export class LayoutProyectoAdendaComponent extends BaseComponent implements OnInit {

  @Input() isReview: boolean;
  @Input() isReviewExt: boolean;
  @Input() isCargaAdenda: boolean;
  @Input() adjuntoAdenda: any;
  @Input() idAdenda: number;
  @Input() personalReemplazo: PersonalReemplazo;

  @Output() seccionCompletada = new EventEmitter<any>();

  editable: boolean = true;
  marcacion: 'SI' | 'NO' | null = null;

  adjuntoCargadoAdenda: boolean = false;
  evaluadoPor: string = null;
  fechaHora: string = null;
  idReemplazo: string = null;

  constructor(
    private reemplazoService: PersonalReemplazoService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void { 
      if (changes['adjuntoAdenda'] && changes['adjuntoAdenda'].currentValue) {
        const nuevoAdjunto = changes['adjuntoAdenda'].currentValue;
        this.adjuntoAdenda = nuevoAdjunto;
      }
  
      if (changes['idAdenda'] && changes['idAdenda'].currentValue) {
        const nuevoIdAdenda = changes['idAdenda'].currentValue;
        this.idAdenda = nuevoIdAdenda;
      }

      if (changes['personalReemplazo'] && changes['personalReemplazo'].currentValue) {
        const nuevoPersonalReemplazo = changes['personalReemplazo'].currentValue;
        this.personalReemplazo = nuevoPersonalReemplazo;
        this.idReemplazo = this.personalReemplazo?.idReemplazo.toString();
      }
  }

  onMarcaAdendaChange(valor: string) {
    let body = {
      idDocumento: this.idAdenda,
      conformidad: valor,
      idRol: 2
    }

    this.reemplazoService.grabaConformidad(body).subscribe({
          next: (response) => {
            this.evaluadoPor = response.evaluador;
            this.fechaHora = response.fecEvaluacion;
          }
    });


  }

  onAdendaAdjunta(valor: boolean) {
    this.adjuntoCargadoAdenda = valor;
    this.seccionCompletada.emit(valor);
  }

  setValueCheckedCartaReemplazo(even) {
  }

}