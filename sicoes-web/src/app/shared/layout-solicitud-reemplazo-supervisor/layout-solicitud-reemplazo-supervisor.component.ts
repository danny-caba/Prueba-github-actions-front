import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../components/base.component';
import { PersonalReemplazoService } from 'src/app/service/personal-reemplazo.service';

@Component({
  selector: 'vex-layout-solicitud-reemplazo-supervisor',
  templateUrl: './layout-solicitud-reemplazo-supervisor.component.html',
  styleUrls: ['./layout-solicitud-reemplazo-supervisor.component.scss']
})
export class LayoutSolicitudReemplazoSupervisorComponent extends BaseComponent implements OnInit {

  @Input() idSolicitud: string;
  @Input() isReview: boolean;
  @Input() isReviewExt: boolean;
  @Input() isCargaAdenda: boolean;
  @Input() perfilBaja: any;
  @Input() adjuntoSolicitud: any;
  @Input() idDocSolicitud: number;
   @Input() codRolRevisor: string;

  @Output() seccionCompletada = new EventEmitter<any>();

  editable: boolean = false;
  marcacion: 'SI' | 'NO' | null = null;
  adjuntoCargadoSolicitud: boolean = false;
  evaluadoPor: string = null;
  fechaHora: string = null;


  constructor(
    private reemplazoService: PersonalReemplazoService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {  
    if (changes['adjuntoSolicitud'] && changes['adjuntoSolicitud'].currentValue) {
      const nuevoAdjunto = changes['adjuntoSolicitud'].currentValue;
      this.adjuntoSolicitud = nuevoAdjunto;
    }
  
    if (changes['idDocSolicitud'] && changes['idDocSolicitud'].currentValue) {
      const nuevoIdInforme = changes['idDocSolicitud'].currentValue;
      this.idDocSolicitud = nuevoIdInforme;
    }
  }

  onMarcaSolicitudChange(valor: string) {

    let codigoNum = parseInt(this.codRolRevisor, 10);

    let body = {
      idDocumento: this.idDocSolicitud,
      conformidad: valor,
      idRol: codigoNum
    }

    this.reemplazoService.grabaConformidad(body).subscribe({
          next: (response) => {
            this.evaluadoPor = response.evaluador;
            this.fechaHora = response.fecEvaluacion;
            this.seccionCompletada.emit(true);
          }
    });
  }

  setValueCheckedCartaReemplazo(even) {
  }

  onSolicitudAdjunta(valor: boolean) {
    this.adjuntoCargadoSolicitud = valor;
    this.seccionCompletada.emit(valor);
  }

}
