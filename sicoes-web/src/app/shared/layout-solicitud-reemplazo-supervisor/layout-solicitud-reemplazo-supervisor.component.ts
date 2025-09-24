import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { BaseComponent } from "../components/base.component";
import { PersonalReemplazoService } from "src/app/service/personal-reemplazo.service";

@Component({
  selector: "vex-layout-solicitud-reemplazo-supervisor",
  templateUrl: "./layout-solicitud-reemplazo-supervisor.component.html",
  styleUrls: ["./layout-solicitud-reemplazo-supervisor.component.scss"],
})
export class LayoutSolicitudReemplazoSupervisorComponent
  extends BaseComponent
  implements OnInit
{
  @Input() idSolicitud: string;
  @Input() isReview: boolean;
  @Input() isReviewExt: boolean;
  @Input() isCargaAdenda: boolean;
  @Input() perfilBaja: any;
  @Input() adjuntoSolicitud: any;
  @Input() idDocSolicitud: number;
  @Input() codRolRevisor: string;
  @Input() obsAdjunto: string;
  @Input() mostrarObs: boolean = true;

  @Input() marcacion: "SI" | "NO" | null = null;
  @Input() evaluadoPor: string | null = null;
  @Input() fechaHora: string | null = null;

  @Output() seccionCompletada = new EventEmitter<any>();
  @Output() allConforme = new EventEmitter<any>();
  @Output() observacionChange = new EventEmitter<string>();

  editable: boolean = false;
  adjuntoCargadoSolicitud: boolean = false;

  observacion: string;

  constructor(private readonly reemplazoService: PersonalReemplazoService) {
    super();
  }

  ngOnInit(): void {
    console.log("inicia")
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["adjuntoSolicitud"]?.currentValue
    ) {
      const nuevoAdjunto = changes["adjuntoSolicitud"].currentValue;
      this.adjuntoSolicitud = nuevoAdjunto;
    }

    if (changes["idDocSolicitud"]?.currentValue) {
      const nuevoIdInforme = changes["idDocSolicitud"].currentValue;
      this.idDocSolicitud = nuevoIdInforme;
    }

    if (changes["codRolRevisor"]?.currentValue) {
      const nuevoCodRolRevisor = changes["codRolRevisor"].currentValue;
      this.codRolRevisor = nuevoCodRolRevisor;
    }

    if (changes["obsAdjunto"]?.currentValue) {
      const nuevaObsAdjunto = changes["obsAdjunto"].currentValue;
      this.obsAdjunto = nuevaObsAdjunto;
    }
  }

  onMarcaSolicitudChange(valor: string) {
    let codigoNum = parseInt(this.codRolRevisor, 10);

    let body = {
      idDocumento: this.idDocSolicitud,
      conformidad: valor,
      idRol: codigoNum,
    };

    this.reemplazoService.grabaConformidad(body).subscribe({
      next: (response) => {
        this.evaluadoPor = response.evaluador;
        this.fechaHora = response.fecEvaluacion;
        this.seccionCompletada.emit(true);
        this.allConforme.emit(
          !this.adjuntoSolicitud.adjunto.archivo || "SI" == valor
        );
      },
    });
  }

  setValueCheckedCartaReemplazo(even) {
    console.log(even)
  }

  onSolicitudAdjunta(valor: boolean) {
    this.adjuntoCargadoSolicitud = valor;
    this.seccionCompletada.emit(valor);
  }

  emitirObservacion() {
    this.observacionChange.emit(this.observacion);
  }
}
