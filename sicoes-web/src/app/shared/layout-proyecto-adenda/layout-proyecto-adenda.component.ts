import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { BaseComponent } from "../components/base.component";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { PersonalReemplazoService } from "src/app/service/personal-reemplazo.service";
import { PersonalReemplazo } from "src/app/interface/reemplazo-personal.model";

@Component({
  selector: "vex-layout-proyecto-adenda",
  templateUrl: "./layout-proyecto-adenda.component.html",
  styleUrls: ["./layout-proyecto-adenda.component.scss"],
  animations: [fadeInRight400ms, stagger80ms],
})
export class LayoutProyectoAdendaComponent
  extends BaseComponent
  implements OnInit
{
  @Input() isReview: boolean;
  @Input() isReviewExt: boolean;
  @Input() isCargaAdenda: boolean;
  @Input() adjuntoProyAdenda: any;
  @Input() idDocAdenda: number;
  @Input() personalReemplazo: PersonalReemplazo;
  @Input() codRolRevisor: string;
  @Input() obsAdjunto: string;

  @Input() marcacion: "SI" | "NO" | null = null;
  @Input() evaluadoPor: string | null = null;
  @Input() fechaHora: string | null = null;

  @Output() seccionCompletada = new EventEmitter<any>();
  @Output() allConforme = new EventEmitter<boolean>();
  @Output() observacionChange = new EventEmitter<string>();

  editable: boolean = true;
  allowedReviewProyAdenda: boolean = false;
  isEvalContratos: boolean = false;

  observacion: string;

  adjuntoCargadoAdenda: boolean = false;
  idReemplazo: string = null;

  constructor(private reemplazoService: PersonalReemplazoService) {
    super();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["adjuntoProyAdenda"] &&
      changes["adjuntoProyAdenda"].currentValue
    ) {
      const nuevoAdjunto = changes["adjuntoProyAdenda"].currentValue;
      this.adjuntoProyAdenda = nuevoAdjunto;
    }

    if (changes["idDocAdenda"] && changes["idDocAdenda"].currentValue) {
      const nuevoIdDocAdenda = changes["idDocAdenda"].currentValue;
      this.idDocAdenda = nuevoIdDocAdenda;
    }

    if (
      changes["personalReemplazo"] &&
      changes["personalReemplazo"].currentValue
    ) {
      const nuevoPersonalReemplazo = changes["personalReemplazo"].currentValue;
      this.personalReemplazo = nuevoPersonalReemplazo;
      this.idReemplazo = this.personalReemplazo?.idReemplazo.toString();
    }

    if (changes["codRolRevisor"] && changes["codRolRevisor"].currentValue) {
      const nuevoCodRolRevisor = changes["codRolRevisor"].currentValue;
      this.codRolRevisor = nuevoCodRolRevisor;
      if (["15", "12"].some((value) => value === this.codRolRevisor)) {
        this.editable = false;
        this.allowedReviewProyAdenda = true;
      }

      if ("12" === this.codRolRevisor) {
        this.isEvalContratos = true;
        this.editable = false;
        console.log("isEvalContratos -> ", this.isEvalContratos);
      }
    }

    if (changes["obsAdjunto"] && changes["obsAdjunto"].currentValue) {
      const nuevaObsAdjunto = changes["obsAdjunto"].currentValue;
      this.obsAdjunto = nuevaObsAdjunto;
    }
  }

  onMarcaAdendaChange(valor: string) {
    let codigoNum = parseInt(this.codRolRevisor, 10);

    let body = {
      idDocumento: this.idDocAdenda,
      conformidad: valor,
      idRol: codigoNum,
    };

    this.reemplazoService.grabaConformidad(body).subscribe({
      next: (response) => {
        this.evaluadoPor = response.evaluador;
        this.fechaHora = response.fecEvaluacion;
        this.seccionCompletada.emit(true);
        this.allConforme.emit(
          !this.adjuntoProyAdenda.adjunto.archivo || "SI" == valor
        );
      },
    });
  }

  onAdendaAdjunta(valor: boolean) {
    this.adjuntoCargadoAdenda = valor;
    this.seccionCompletada.emit(valor);
    this.allConforme.emit(valor);
  }

  emitirObservacion() {
    this.observacionChange.emit(this.observacion);
  }

  setValueCheckedCartaReemplazo(even) {}
}
