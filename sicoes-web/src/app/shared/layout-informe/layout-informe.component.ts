import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { BaseComponent } from "../components/base.component";
import { PersonalPropuesto } from "src/app/interface/reemplazo-personal.model";
import { FormBuilder, Validators } from "@angular/forms";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { PersonalReemplazoService } from "src/app/service/personal-reemplazo.service";
import { functionsAlert } from "src/helpers/functionsAlert";

@Component({
  selector: "vex-layout-informe",
  templateUrl: "./layout-informe.component.html",
  styleUrls: ["./layout-informe.component.scss"],
  animations: [fadeInUp400ms, stagger80ms],
})
export class LayoutInformeComponent extends BaseComponent implements OnInit {
  @Input() isReviewExt: boolean;
  @Input() isEvalDocReemplazo: boolean;
  @Input() isCargaAdenda?: boolean;
  @Input() fechaDesvinculacion: string;
  @Input() fecDesvinculacionPrevia: string;
  @Input() adjuntoInforme: any;
  @Input() idDocumento: number;
  @Input() codRolRevisor: string;
  @Input() obsAdjunto: string;
  @Input() personalReemplazo: any;
  @Input() marcaInformeCarta: "SI" | "NO" | null = null;
  @Input() evaluadoPor: string | null = null;
  @Input() fechaHora: string | null = null;

  @Output() seccionCompletada = new EventEmitter<boolean>();
  @Output() allConforme = new EventEmitter<boolean>();
  @Output() observacionChange = new EventEmitter<string>();

  displayedColumns: string[] = [
    "tipoDocumento",
    "numeroDocumento",
    "nombreCompleto",
    "perfil",
    "fechaRegistro",
    "fechaBaja",
    "fechaDesvinculacion",
    "actions",
  ];

  listPersonalPropuesto: PersonalPropuesto[] = null;
  listPersonalAgregado: PersonalPropuesto[] = [];
  adjuntoCargadoInforme: boolean = false;

  //evaluadoPor: string = null;
  //fechaHora: string = null;

  editable: boolean = false;
  isValidFechaDesvinculacion: boolean = false;

  //marcaInformeCarta: 'SI' | 'NO' | null = null;
  observacion: string;

  constructor(
    private fb: FormBuilder,
    private reemplazoService: PersonalReemplazoService
  ) {
    super();
  }

  formGroup = this.fb.group({
    flagInforme: [null, [Validators.required]],
    fechaDesvinculacion: [null],
  });

  ngOnInit(): void {
    const fechaControl = this.formGroup.get("fechaDesvinculacion");
    let primeraVez = true;

    fechaControl?.valueChanges.subscribe((value) => {
      if (primeraVez || !this.isEvalDocReemplazo) {
        primeraVez = false;
        this.isValidFechaDesvinculacion = true;
        return;
      }

      if (!value) {
        this.isValidFechaDesvinculacion = false;
        fechaControl.setErrors({ required: true });
        this.seccionCompletada.emit(
          this.adjuntoCargadoInforme && this.isValidFechaDesvinculacion
        );
      } else {
        this.isValidFechaDesvinculacion = true;
        fechaControl.setErrors(null);
        this.seccionCompletada.emit(
          this.adjuntoCargadoInforme && this.isValidFechaDesvinculacion
        );
        functionsAlert
          .questionSiNo("¿Seguro(a) de modificar la Fecha Desvinculación?")
          .then((result) => {
            if (result.isConfirmed) {
              this.reemplazoService
                .updateFechaDesvinculacion(
                  this.personalReemplazo?.idReemplazo,
                  value
                )
                .subscribe();
            }
          });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["fechaDesvinculacion"] &&
      changes["fechaDesvinculacion"].currentValue
    ) {
      const nuevaFecha = changes["fechaDesvinculacion"].currentValue;
      this.setFechaDesvinculacion(nuevaFecha);
    }

    if (changes["adjuntoInforme"] && changes["adjuntoInforme"].currentValue) {
      const nuevoAdjunto = changes["adjuntoInforme"].currentValue;
      this.adjuntoInforme = nuevoAdjunto;
    }

    if (changes["idDocumento"] && changes["idDocumento"].currentValue) {
      const nuevoIdInforme = changes["idDocumento"].currentValue;
      this.idDocumento = nuevoIdInforme;
    }

    if (changes["codRolRevisor"] && changes["codRolRevisor"].currentValue) {
      const nuevoCodRolRevisor = changes["codRolRevisor"].currentValue;
      this.codRolRevisor = nuevoCodRolRevisor;
    }

    if (changes["obsAdjunto"] && changes["obsAdjunto"].currentValue) {
      const nuevaObsAdjunto = changes["obsAdjunto"].currentValue;
      this.obsAdjunto = nuevaObsAdjunto;
    }

    if (
      changes["personalReemplazo"] &&
      changes["personalReemplazo"].currentValue
    ) {
      const nuevoPersonalReemplazo = changes["personalReemplazo"].currentValue;
      this.personalReemplazo = nuevoPersonalReemplazo;
    }
  }

  setFechaDesvinculacion(fecha: string): void {
    const [dd, mm, yyyy] = fecha.split("/");
    fecha = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;

    this.formGroup.patchValue({
      fechaDesvinculacion: fecha,
    });
    if (!this.isEvalDocReemplazo) {
      this.formGroup.get("fechaDesvinculacion")?.disable();
    }
  }

  onMarcaInformeCartaChange(valor: string) {
    let codigoNum = parseInt(this.codRolRevisor, 10);

    let body = {
      idDocumento: this.idDocumento,
      conformidad: valor,
      idRol: codigoNum,
    };

    this.reemplazoService.grabaConformidad(body).subscribe({
      next: (response) => {
        this.evaluadoPor = response.evaluador;
        this.fechaHora = response.fecEvaluacion;
        this.seccionCompletada.emit(true);
        this.allConforme.emit(
          !this.adjuntoInforme.adjunto.archivo || "SI" == valor
        );
      },
    });
  }

  emitirObservacion() {
    this.observacionChange.emit(this.observacion);
  }

  setValueCheckedInforme(obj, even) {
    obj.flagInforme = even.value;
  }

  onInformeAdjunto(valor: boolean) {
    this.adjuntoCargadoInforme = valor;
    this.seccionCompletada.emit(
      this.adjuntoCargadoInforme && this.isValidFechaDesvinculacion
    );
  }
}
