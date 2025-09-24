import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AuthFacade } from "src/app/auth/store/auth.facade";
import { AuthUser } from "src/app/auth/store/auth.models";
import { PersonalReemplazo } from "src/app/interface/reemplazo-personal.model";
import { PersonalReemplazoService } from "src/app/service/personal-reemplazo.service";
import { BaseComponent } from "src/app/shared/components/base.component";
type OpcionSiNo = "SI" | "NO" | null;
@Component({
  selector: "vex-adenda-form-upload",
  templateUrl: "./adenda-form-upload.component.html",
  styleUrls: ["./adenda-form-upload.component.scss"],
})
export class AdendaFormUploadComponent extends BaseComponent implements OnInit {
  @Input() idReemplazo: string;
  @Input() idSolicitud: string;
  @Input() uuidSolicitud: string;

  @Output() loadAdenda = new EventEmitter<boolean>();
  @Output() adjuntoData = new EventEmitter<boolean>();

  usuario$ = this.authFacade.user$;
  codRolRevisor: string;

  itemSeccion: number = 0;
  isReview: boolean = false;
  isReviewExt: boolean = true;
  isCargaAdenda: boolean = true;
  listPersonalReemplazo: PersonalReemplazo[] = [];
  personalReemplazo: PersonalReemplazo;
  fecDesvinculacion: string = "";
  listDocumentosReemplazo: any[] = [];

  adjuntoInforme: any;
  adjuntoDjNepotismo: any;
  adjuntoDjImpedimento: any;
  adjuntoDjNoVinculo: any;
  adjuntoOtros: any;
  adjuntoSolicitudReemplazo: any;
  adjuntoProyAdenda: any;

  observacionInforme: string;
  observacionDjNepotismo: string;
  observacionDjImpedimento: string;
  observacionDjNoVinculo: string;
  observacionOtros: string;
  observacionSolReemplazo: string;
  observacionProyAdenda: string;

  idInforme: number;
  idDjNepotismo: number;
  idDjImpedimento: number;
  idDJNoVinculo: number;
  idOtros: number;
  idSolicitudReemplazo: number;
  idProyAdenda: number;

  nombreEvaluador: string = null;
  fechaEvaluacion: string = null;
  nombreEvaluadorDjNepotismo: string = null;
  fechaEvaluacionDjNepotismo: string = null;
  nombreEvaluadorDjImpedimento: string = null;
  fechaEvaluacionDjImpedimento: string = null;
  nombreEvaluadorDjNoVinculo: string = null;
  fechaEvaluacionDjNoVinculo: string = null;
  nombreEvaluadorOtros: string = null;
  fechaEvaluacionOtros: string = null;
  nombreEvaluadorSolReemplazo: string = null;
  fechaEvaluacionSolReemplazo: string = null;
  nombreEvaluadorProyAdenda: string = null;
  fechaEvaluacionProyAdenda: string = null;
  marcaInforme: OpcionSiNo = null;
  marcaDjNepotismo: OpcionSiNo = null;
  marcaDjImpedimento: OpcionSiNo = null;
  marcaDjNoVinculo: OpcionSiNo = null;
  marcaOtros: OpcionSiNo = null;
  marcaSolReemplazo: OpcionSiNo = null;
  marcaProyAdenda: OpcionSiNo = null;

  constructor(
    private readonly authFacade: AuthFacade,
    private readonly personalReemplazoService: PersonalReemplazoService
  ) {
    super();
  }

  ngOnInit(): void {
    this.cargarDatosReemplazo();
    this.usuario$.subscribe((usu) => {
      this.setCodRolRevisor(usu);
    });
  }

  cargarDatosReemplazo(): void {
    this.personalReemplazoService
      .obtenerPersonalReemplazo(Number(this.idReemplazo))
      .subscribe({
        next: (data) => {
          this.personalReemplazo = data;
          this.fecDesvinculacion =
            this.personalReemplazo.feFechaDesvinculacion.toString();
          this.personalReemplazoService
            .listarDocsReemplazo(Number(this.idReemplazo))
            .subscribe({
              next: (response) => {
                this.listDocumentosReemplazo = response.content;
                this.setAdjuntos();
              },
            });
        },
      });
  }

  setAdjuntos(): void {
    this.setDatosInforme();
    this.setDatosDjNepotismo();
    this.setDatosDjImpedimento();
    this.setDatosDjNoVinculo();
    this.setDatosOtros();
    this.setDatosSolicitudReemplazo();
    this.setDatosProyAdenda();
  }

  setDatosInforme() {
    const doc = this.listDocumentosReemplazo.find(
      (doc) => doc.tipoDocumento.codigo === "INFORME"
    );
    const evaluacion = doc?.evaluacion?.find((ev) => ev.rol?.idRol === 15);
    const evalContratos = doc?.evaluacion?.find((ev) => ev.rol?.idRol === 12);

    let informe = {
      adjunto: {
        archivo: doc?.archivo,
      },
    };
    this.adjuntoInforme = informe;
    this.observacionInforme = evaluacion?.observacion;
    this.idInforme = doc?.idDocumento;
    this.nombreEvaluador = evalContratos?.evaluadoPor?.usuario;
    this.fechaEvaluacion = evalContratos?.fechaEvaluacion;
    this.marcaInforme = evalContratos?.conforme;
  }

  setDatosDjNepotismo() {
    const doc = this.listDocumentosReemplazo.find(
      (doc) => doc.tipoDocumento.codigo === "DJ_PERSONAL_PROPUESTO"
    );
    const evaluacion = doc?.evaluacion?.find((ev) => ev.rol?.idRol === 15);
    const evalContratos = doc?.evaluacion?.find((ev) => ev.rol?.idRol === 12);

    let djNepotismo = {
      adjunto: {
        archivo: doc?.archivo,
      },
    };
    this.adjuntoDjNepotismo = djNepotismo;
    this.observacionDjNepotismo = evaluacion?.observacion;
    this.idDjNepotismo = doc?.idDocumento;
    this.nombreEvaluadorDjNepotismo = evalContratos?.evaluadoPor?.usuario;
    this.fechaEvaluacionDjNepotismo = evalContratos?.fechaEvaluacion;
    this.marcaDjNepotismo = evalContratos?.conforme;
  }

  setDatosDjImpedimento() {
    const doc = this.listDocumentosReemplazo.find(
      (doc) => doc.tipoDocumento.codigo === "DJ_IMPEDIMENTOS"
    );
    const evaluacion = doc?.evaluacion?.find((ev) => ev.rol?.idRol === 15);
    const evalContratos = doc?.evaluacion?.find((ev) => ev.rol?.idRol === 12);

    let djImpedimento = {
      adjunto: {
        archivo: doc?.archivo,
      },
    };
    this.adjuntoDjImpedimento = djImpedimento;
    this.observacionDjImpedimento = evaluacion?.observacion;
    this.idDjImpedimento = doc?.idDocumento;
    this.nombreEvaluadorDjImpedimento = evalContratos?.evaluadoPor?.usuario;
    this.fechaEvaluacionDjImpedimento = evalContratos?.fechaEvaluacion;
    this.marcaDjImpedimento = evalContratos?.conforme;
  }

  setDatosDjNoVinculo() {
    const doc = this.listDocumentosReemplazo.find(
      (doc) => doc.tipoDocumento.codigo === "DJ_NO_VINCULO"
    );
    const evaluacion = doc?.evaluacion?.find((ev) => ev.rol?.idRol === 15);
    const evalContratos = doc?.evaluacion?.find((ev) => ev.rol?.idRol === 12);

    let djNoVinculo = {
      adjunto: {
        archivo: doc?.archivo,
      },
    };
    this.adjuntoDjNoVinculo = djNoVinculo;
    this.observacionDjNoVinculo = evaluacion?.observacion;
    this.idDJNoVinculo = doc?.idDocumento;
    this.nombreEvaluadorDjNoVinculo = evalContratos?.evaluadoPor?.usuario;
    this.fechaEvaluacionDjNoVinculo = evalContratos?.fechaEvaluacion;
    this.marcaDjNoVinculo = evalContratos?.conforme;
  }

  setDatosOtros() {
    const doc = this.listDocumentosReemplazo.find(
      (doc) => doc.tipoDocumento.codigo === "OTROS_DOCUMENTOS"
    );
    const evaluacion = doc?.evaluacion?.find((ev) => ev.rol?.idRol === 15);
    const evalContratos = doc?.evaluacion?.find((ev) => ev.rol?.idRol === 12);

    let otros = {
      adjunto: {
        archivo: doc?.archivo,
      },
    };
    this.adjuntoOtros = otros;
    this.observacionOtros = evaluacion?.observacion;
    this.idOtros = doc?.idDocumento;
    this.nombreEvaluadorOtros = evalContratos?.evaluadoPor?.usuario;
    this.fechaEvaluacionOtros = evalContratos?.fechaEvaluacion;
    this.marcaOtros = evalContratos?.conforme;
  }

  setDatosSolicitudReemplazo() {
    const doc = this.listDocumentosReemplazo.find(
      (doc) => doc.tipoDocumento.codigo === "OFICIO_CARTA_SOLI_REEMPLAZO"
    );
    const evaluacion = doc?.evaluacion?.find((ev) => ev.rol?.idRol === 15);
    const evalContratos = doc?.evaluacion?.find((ev) => ev.rol?.idRol === 12);

    let solicitud = {
      adjunto: {
        archivo: doc?.archivo,
      },
    };
    this.adjuntoSolicitudReemplazo = solicitud;
    this.observacionSolReemplazo = evaluacion?.observacion;
    this.idSolicitudReemplazo = doc?.idDocumento;
    this.nombreEvaluadorSolReemplazo = evalContratos?.evaluadoPor?.usuario;
    this.fechaEvaluacionSolReemplazo = evalContratos?.fechaEvaluacion;
    this.marcaSolReemplazo = evalContratos?.conforme;
  }

  setDatosProyAdenda() {
    const doc = this.listDocumentosReemplazo.find(
      (doc) => doc.tipoDocumento.codigo === "PROYECTO_ADENDA"
    );
    const evaluacion = doc?.evaluacion?.find((ev) => ev.rol?.idRol === 15);
    const evalContratos = doc?.evaluacion?.find((ev) => ev.rol?.idRol === 12);

    let solicitud = {
      adjunto: {
        archivo: doc?.archivo,
      },
    };
    this.adjuntoProyAdenda = solicitud;
    this.observacionProyAdenda = evaluacion?.observacion;
    this.idProyAdenda = doc?.idDocumento;
    this.nombreEvaluadorProyAdenda = evalContratos?.evaluadoPor?.usuario;
    this.fechaEvaluacionProyAdenda = evalContratos?.fechaEvaluacion;
    this.marcaProyAdenda = evalContratos?.conforme;
  }

  setCodRolRevisor(user: AuthUser) {
    const codigosRevisores = ["02", "12", "15"];
    this.codRolRevisor = user?.roles.find((rol) =>
      codigosRevisores.includes(rol.codigo)
    )?.codigo;
  }

  onAdjuntoCargado(valor: boolean) {
    this.loadAdenda.emit(valor);
  }

  onChangeUploadData(valor: any) {
    this.adjuntoData.emit(valor);
  }
}
