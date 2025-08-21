import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { BaseComponent } from "../components/base.component";
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import {
  PersonalPropuesto,
  PersonalReemplazo,
} from "src/app/interface/reemplazo-personal.model";
import { ActivatedRoute } from "@angular/router";
import { SeccionService } from "src/app/service/seccion.service";
import { ContratoService } from "src/app/service/contrato.service";
import { Seccion } from "src/app/interface/seccion.model";
import * as CryptoJS from "crypto-js";
import { SolicitudService } from "src/app/service/solicitud.service";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { PersonalReemplazoService } from "src/app/service/personal-reemplazo.service";
import {
  Supervisora,
  SupervisoraPerfil,
} from "src/app/interface/supervisora.model";
import { AdjuntosService } from "src/app/service/adjuntos.service";

const URL_DECRYPT = "3ncr1pt10nK3yuR1";

function alMenosUnDocumentoMarcado(
  control: AbstractControl
): ValidationErrors | null {
  const { flagDjNepotismo, flagDjImpedimento, flagDjNoVinculo, flagOtros } =
    control.value;

  return flagDjNepotismo || flagDjImpedimento || flagDjNoVinculo || flagOtros
    ? null
    : { alMenosUnoRequerido: true };
}

@Component({
  selector: "vex-layout-personal-propuesto",
  templateUrl: "./layout-personal-propuesto.component.html",
  styleUrls: ["./layout-personal-propuesto.component.scss"],
  animations: [fadeInUp400ms, stagger80ms],
})
export class LayoutPersonalPropuestoComponent
  extends BaseComponent
  implements OnInit
{
  @Input() isReview: boolean;
  @Input() isReviewExt: boolean;
  @Input() isCargaAdenda: boolean;
  @Input() idSolicitud: string;
  @Input() uuidSolicitud: string;
  @Input() perfilBaja: any;
  @Input() idDocDjNepotismo: number;
  @Input() idDocDjImpedimento: number;
  @Input() idDocDjNoVinculo: number;
  @Input() idDocOtros: number;
  @Input() adjuntoDjNepotismo: any;
  @Input() adjuntoDjImpedimento: any;
  @Input() adjuntoDjNoVinculo: any;
  @Input() adjuntoOtros: any;
  @Input() personalReemplazo: PersonalReemplazo;
  @Input() codRolRevisor: string;
  @Input() obsAdjuntoDjNepotismo: string;
  @Input() obsAdjuntoDjImpedimento: string;
  @Input() obsAdjuntoDjNoVinculo: string;
  @Input() obsAdjuntoOtros: string;
  @Input() mostrarObs: boolean = true;

  @Input() djNepotismoEvaluadoPor: string | null = null;
  @Input() djImpedimentoEvaluadoPor: string | null = null;
  @Input() djNoVinculoEvaluadoPor: string | null = null;
  @Input() otrosEvaluadoPor: string | null = null;

  @Input() djNepotismoFechaHora: string | null = null;
  @Input() djImpedimentoFechaHora: string | null = null;
  @Input() djNoVinculoFechaHora: string | null = null;
  @Input() otrosFechaHora: string | null = null;

  @Input() marcaDjNepotismo: "SI" | "NO" | null = null;
  @Input() marcaDjImpedimento: "SI" | "NO" | null = null;
  @Input() marcaDjNoVinculo: "SI" | "NO" | null = null;
  @Input() marcaOtros: "SI" | "NO" | null = null;

  @Output() seccionCompletada = new EventEmitter<any>();
  @Output() allConforme = new EventEmitter<any>();
  @Output() observacionDjNepotismoChange = new EventEmitter<string>();
  @Output() observacionDjImpedimentoChange = new EventEmitter<string>();
  @Output() observacionDjNoVinculoChange = new EventEmitter<string>();
  @Output() observacionOtrosChange = new EventEmitter<string>();

  displayedColumns: string[] = [
    "tipoDocumento",
    "numeroDocumento",
    "nombreCompleto",
    "djNepotismo",
    "djImpedimento",
    "djNoVinculo",
    "otrosDocumentos",
    "actions",
  ];
  displayedColumnsReview: string[] = [
    "tipoDocumento",
    "numeroDocumento",
    "nombreCompleto",
  ];

  listPersonalApto: SupervisoraPerfil[] = [];
  listPersonalPropuesto: PersonalReemplazo[] = [];
  listPersonalPropuestoReview: PersonalReemplazo[] = [];
  listPersonalAgregado: PersonalPropuesto[] = [];
  listDocumentosReemplazo: any[] = [];

  editable: boolean = true;
  evaluar: boolean;
  view: boolean;
  mostrarTemplates: boolean = true;
  codRolRevisorNum: number;

  adjuntoCargadoDjNepotismo: boolean = false;
  adjuntoCargadoDjImpedimento: boolean = false;
  adjuntoCargadoDjNoVinculo: boolean = false;
  adjuntoCargadoOtros: boolean = false;

  docNepotismoRevisado: boolean = false;
  docImpedimentoRevisado: boolean = false;
  docNoVinculoRevisado: boolean = false;
  docOtrosRevisado: boolean = false;

  observacionDjNepotismo: string;
  observacionDjImpedimento: string;
  observacionDjNoVinculo: string;
  observacionOtros: string;

  constructor(
    private fb: FormBuilder,
    private reemplazoService: PersonalReemplazoService,
    private adjuntoService: AdjuntosService
  ) {
    super();
  }

  formGroup = this.fb.group(
    {
      nombreCompleto: [null, Validators.required],
      flagDjNepotismo: [false, Validators.required],
      flagDjImpedimento: [false, Validators.required],
      flagDjNoVinculo: [false, Validators.required],
      flagOtros: [false, Validators.required],
    },
    { validators: alMenosUnDocumentoMarcado }
  );

  ngOnInit(): void {
    if (!this.isReviewExt) {
      this.cargarCombo();
    }
    this.editable = !this.isReviewExt;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.perfilBaja) {
      this.cargarCombo();
    }

    if (
      changes["idDocDjNepotismo"] &&
      changes["idDocDjNepotismo"].currentValue
    ) {
      const nuevoIdDocumento = changes["idDocDjNepotismo"].currentValue;
      this.idDocDjNepotismo = nuevoIdDocumento;
    }

    if (
      changes["idDocDjImpedimento"] &&
      changes["idDocDjImpedimento"].currentValue
    ) {
      const nuevoIdDocumento = changes["idDocDjImpedimento"].currentValue;
      this.idDocDjImpedimento = nuevoIdDocumento;
    }

    if (
      changes["idDocDjNoVinculo"] &&
      changes["idDocDjNoVinculo"].currentValue
    ) {
      const nuevoIdDocumento = changes["idDocDjNoVinculo"].currentValue;
      this.idDocDjNoVinculo = nuevoIdDocumento;
    }

    if (changes["idDocOtros"] && changes["idDocOtros"].currentValue) {
      const nuevoIdDocumento = changes["idDocOtros"].currentValue;
      this.idDocOtros = nuevoIdDocumento;
    }

    if (
      changes["adjuntoDjNepotismo"] &&
      changes["adjuntoDjNepotismo"].currentValue
    ) {
      const nuevoAdjunto = changes["adjuntoDjNepotismo"].currentValue;
      this.adjuntoDjNepotismo = nuevoAdjunto;
      this.adjuntoCargadoDjNepotismo = nuevoAdjunto?.adjunto?.archivo != null;
    }

    if (
      changes["adjuntoDjImpedimento"] &&
      changes["adjuntoDjImpedimento"].currentValue
    ) {
      const nuevoAdjunto = changes["adjuntoDjImpedimento"].currentValue;
      this.adjuntoDjImpedimento = nuevoAdjunto;
      this.adjuntoCargadoDjImpedimento = nuevoAdjunto?.adjunto?.archivo != null;
    }

    if (
      changes["adjuntoDjNoVinculo"] &&
      changes["adjuntoDjNoVinculo"].currentValue
    ) {
      const nuevoAdjunto = changes["adjuntoDjNoVinculo"].currentValue;
      this.adjuntoDjNoVinculo = nuevoAdjunto;
      this.adjuntoCargadoDjNoVinculo = nuevoAdjunto?.adjunto?.archivo != null;
    }

    if (changes["adjuntoOtros"] && changes["adjuntoOtros"].currentValue) {
      const nuevoAdjunto = changes["adjuntoOtros"].currentValue;
      this.adjuntoOtros = nuevoAdjunto;
      this.adjuntoCargadoOtros = nuevoAdjunto?.adjunto?.archivo != null;
    }

    if (
      changes["personalReemplazo"] &&
      changes["personalReemplazo"].currentValue
    ) {
      const nuevoPersonalReemplazo = changes["personalReemplazo"].currentValue;
      this.cargarTablaReview(nuevoPersonalReemplazo);
    }

    if (changes["codRolRevisor"] && changes["codRolRevisor"].currentValue) {
      const nuevoCodRolRevisor = changes["codRolRevisor"].currentValue;
      this.codRolRevisor = nuevoCodRolRevisor;
      this.codRolRevisorNum = parseInt(this.codRolRevisor, 10);
    }

    if (
      changes["obsAdjuntoDjNepotismo"] &&
      changes["obsAdjuntoDjNepotismo"].currentValue
    ) {
      const nuevaObsAdjunto = changes["obsAdjuntoDjNepotismo"].currentValue;
      this.obsAdjuntoDjNepotismo = nuevaObsAdjunto;
    }

    if (
      changes["obsAdjuntoDjImpedimento"] &&
      changes["obsAdjuntoDjImpedimento"].currentValue
    ) {
      const nuevaObsAdjunto = changes["obsAdjuntoDjImpedimento"].currentValue;
      this.obsAdjuntoDjImpedimento = nuevaObsAdjunto;
    }

    if (
      changes["obsAdjuntoDjNoVinculo"] &&
      changes["obsAdjuntoDjNoVinculo"].currentValue
    ) {
      const nuevaObsAdjunto = changes["obsAdjuntoDjNoVinculo"].currentValue;
      this.obsAdjuntoDjNoVinculo = nuevaObsAdjunto;
    }

    if (changes["obsAdjuntoOtros"] && changes["obsAdjuntoOtros"].currentValue) {
      const nuevaObsAdjunto = changes["obsAdjuntoOtros"].currentValue;
      this.obsAdjuntoOtros = nuevaObsAdjunto;
    }
  }

  guardarPersonalPropuesto(): void {
    if (this.formGroup.valid) {
      const seleccionado: SupervisoraPerfil = this.formGroup.get(
        "nombreCompleto"
      )!.value as unknown as SupervisoraPerfil;

      if (seleccionado) {
        let personalPropuesto: any = {
          idReemplazo: this.perfilBaja?.idReemplazo,
          personaPropuesta: seleccionado.supervisora,
          perfil: seleccionado.perfil,
        };

        this.reemplazoService
          .guardarPersonalPropuesto(personalPropuesto)
          .subscribe({
            next: () => {
              this.cargarTabla();
              this.cargarDocumentosReemplazo();
              this.resetButtons();
              this.seccionCompletada.emit(true);
            },
            error: (err) => {
              console.error("Error al registrar propuesto", err);
            },
          });
      }

      this.cargarTabla();
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  eliminarPersonalPropuesto(row: PersonalReemplazo): void {
    const body = {
      idReemplazo: this.perfilBaja?.idReemplazo,
    };

    this.reemplazoService.eliminarPersonalPropuesto(body).subscribe({
      next: () => {
        this.cargarTabla();
        this.seccionCompletada.emit(false);
      },
    });
  }

  cargarCombo(): void {
    if (this.perfilBaja) {
      this.reemplazoService
        .listarSupervisoraApto(this.perfilBaja.perfilBaja.idListadoDetalle)
        .subscribe((response) => {
          this.listPersonalApto = response.content;
        });
    } else {
      this.listPersonalApto = [];
    }
  }

  cargarTabla() {
    const idSolicitudDecrypt = Number(this.decrypt(this.idSolicitud));

    this.reemplazoService
      .listarPersonalReemplazo(idSolicitudDecrypt)
      .subscribe((response) => {
        this.listPersonalPropuesto = response.content.filter(
          (item) =>
            !!item.personaPropuesta &&
            item.idReemplazo == this.perfilBaja?.idReemplazo
        );
      });
  }

  cargarTablaReview(personalReemplazo: PersonalReemplazo): void {
    this.listPersonalPropuestoReview = [
      ...this.listPersonalPropuestoReview,
      personalReemplazo,
    ];
  }

  cargarDocumentosReemplazo() {
    this.reemplazoService
      .listarDocsReemplazo(this.perfilBaja.idReemplazo)
      .subscribe((response) => {
        this.listDocumentosReemplazo = response.content;
      });
  }

  onMarcaDJNepotismoChange(valor: string) {
    let body = {
      idDocumento: this.idDocDjNepotismo,
      conformidad: valor,
      idRol: this.codRolRevisorNum,
    };

    this.reemplazoService.grabaConformidad(body).subscribe({
      next: (response) => {
        this.djNepotismoEvaluadoPor = response.evaluador;
        this.djNepotismoFechaHora = response.fecEvaluacion;
        this.docNepotismoRevisado = true;
        this.validarConformidades();
        this.allConforme.emit(this.validarMarcas());
      },
    });
  }

  onMarcaDJImpedimentoChange(valor: string) {
    let body = {
      idDocumento: this.idDocDjImpedimento,
      conformidad: valor,
      idRol: this.codRolRevisorNum,
    };

    this.reemplazoService.grabaConformidad(body).subscribe({
      next: (response) => {
        this.djImpedimentoEvaluadoPor = response.evaluador;
        this.djImpedimentoFechaHora = response.fecEvaluacion;
        this.docImpedimentoRevisado = true;
        this.validarConformidades();
        this.allConforme.emit(this.validarMarcas());
      },
    });
  }

  onMarcaDJNoVinculoChange(valor: string) {
    let body = {
      idDocumento: this.idDocDjNoVinculo,
      conformidad: valor,
      idRol: this.codRolRevisorNum,
    };

    this.reemplazoService.grabaConformidad(body).subscribe({
      next: (response) => {
        this.djNoVinculoEvaluadoPor = response.evaluador;
        this.djNoVinculoFechaHora = response.fecEvaluacion;
        this.docNoVinculoRevisado = true;
        this.validarConformidades();
        this.allConforme.emit(this.validarMarcas());
      },
    });
  }

  onMarcaOtrosChange(valor: string) {
    let body = {
      idDocumento: this.idDocOtros,
      conformidad: valor,
      idRol: this.codRolRevisorNum,
    };

    this.reemplazoService.grabaConformidad(body).subscribe({
      next: (response) => {
        this.otrosEvaluadoPor = response.evaluador;
        this.otrosFechaHora = response.fecEvaluacion;
        this.docOtrosRevisado = true;
        this.validarConformidades();
        this.allConforme.emit(this.validarMarcas());
      },
    });
  }

  validarConformidades() {
    const docNepotismoValido =
      !this.adjuntoDjNepotismo.adjunto.archivo || this.docNepotismoRevisado;
    const docImpedimentoValido =
      !this.adjuntoDjImpedimento.adjunto.archivo || this.docImpedimentoRevisado;
    const docNoVinculoValido =
      !this.adjuntoDjNoVinculo.adjunto.archivo || this.docNoVinculoRevisado;
    const docOtrosValido =
      !this.adjuntoOtros.adjunto.archivo || this.docOtrosRevisado;

    this.seccionCompletada.emit(
      docNepotismoValido &&
        docImpedimentoValido &&
        docNoVinculoValido &&
        docOtrosValido
    );
  }

  validarMarcas(): boolean {
    return [
      this.marcaDjNepotismo,
      this.marcaDjImpedimento,
      this.marcaDjNoVinculo,
      this.marcaOtros,
    ]
      .filter((marca) => marca != null)
      .every((valor) => valor === "SI");
  }

  setValueCheckedDjNepotismo(obj, even) {
    obj.flagDjNepotismo = even.value;
  }

  setValueCheckedDjImpedimento(obj, even) {
    obj.flagDjImpedimento = even.value;
  }

  setValueCheckedDjNoVinculo(obj, even) {
    obj.flagDjNoVinculo = even.value;
  }

  setValueCheckedOtros(obj, even) {
    obj.flagOtros = even.value;
  }

  onDjNepotismoAdjunta(valor: boolean) {
    this.adjuntoCargadoDjNepotismo = valor;
    this.formGroup.get("flagDjNepotismo")?.setValue(valor);
  }

  onDjImpedimentoAdjunta(valor: boolean) {
    this.adjuntoCargadoDjImpedimento = valor;
    this.formGroup.get("flagDjImpedimento")?.setValue(valor);
  }

  onDjNoVinculoAdjunta(valor: boolean) {
    this.adjuntoCargadoDjNoVinculo = valor;
    this.formGroup.get("flagDjNoVinculo")?.setValue(valor);
  }

  onOtrosAdjunta(valor: boolean) {
    this.adjuntoCargadoOtros = valor;
    this.formGroup.get("flagOtros")?.setValue(valor);
  }

  emitirObservacionDjNepotismo() {
    this.observacionDjNepotismoChange.emit(this.observacionDjNepotismo);
  }

  emitirObservacionDjImpedimento() {
    this.observacionDjImpedimentoChange.emit(this.observacionDjImpedimento);
  }

  emitirObservacionDjNoVinculo() {
    this.observacionDjNoVinculoChange.emit(this.observacionDjNoVinculo);
  }

  emitirObservacionOtros() {
    this.observacionOtrosChange.emit(this.observacionOtros);
  }

  getNombreCompleto(persona: Supervisora): string {
    if (!persona) return "";
    return `${persona.nombres} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`.trim();
  }

  decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, URL_DECRYPT);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  }

  resetButtons() {
    this.adjuntoCargadoDjNepotismo = false;
    this.adjuntoCargadoDjImpedimento = false;
    this.adjuntoCargadoDjNoVinculo = false;
    this.adjuntoCargadoOtros = false;
    this.mostrarTemplates = false;
    setTimeout(() => (this.mostrarTemplates = true), 0);
  }

  tieneArchivo(tipoDoc: string): boolean {
    return this.listDocumentosReemplazo.some(
      (item) => !!item.archivo && item.deNombreDocumento === tipoDoc
    );
  }

  descargar(tipoDoc: string) {
    const found = this.listDocumentosReemplazo.find(
      (item) => !!item.archivo && item.deNombreDocumento == tipoDoc
    );
    if (found) {
      let nombreAdjunto = found.archivo.nombreReal;
      this.adjuntoService.descargarWindowsJWT(
        found.archivo.codigo,
        nombreAdjunto
      );
    }
  }
}
