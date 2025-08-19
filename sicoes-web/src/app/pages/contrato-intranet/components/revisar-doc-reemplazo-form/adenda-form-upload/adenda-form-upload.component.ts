import { Component, Input, OnInit } from "@angular/core";
import { AuthFacade } from "src/app/auth/store/auth.facade";
import { AuthUser } from "src/app/auth/store/auth.models";
import { PersonalReemplazo } from "src/app/interface/reemplazo-personal.model";
import { PersonalReemplazoService } from "src/app/service/personal-reemplazo.service";
import { BaseComponent } from "src/app/shared/components/base.component";
import { SeccionAdenda } from "src/helpers/constantes.components";

@Component({
  selector: "vex-adenda-form-upload",
  templateUrl: "./adenda-form-upload.component.html",
  styleUrls: ["./adenda-form-upload.component.scss"],
})
export class AdendaFormUploadComponent extends BaseComponent implements OnInit {
  @Input() idReemplazo: string;
  @Input() idSolicitud: string;
  @Input() uuidSolicitud: string;

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

  constructor(
    private authFacade: AuthFacade,
    private personalReemplazoService: PersonalReemplazoService
  ) {
    super();
  }

  ngOnInit(): void {
    this.cargarDatosReemplazo();
    this.cargarInforme();
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

    let informe = {
      adjunto: {
        archivo: doc?.archivo,
      },
    };
    this.adjuntoInforme = informe;
    this.observacionInforme = doc?.evaluacion?.observacion;
    this.idInforme = doc?.idDocumento;
  }

  setDatosDjNepotismo() {
    const doc = this.listDocumentosReemplazo.find(
      (doc) => doc.tipoDocumento.codigo === "DJ_PERSONAL_PROPUESTO"
    );

    let djNepotismo = {
      adjunto: {
        archivo: doc?.archivo,
      },
    };
    this.adjuntoDjNepotismo = djNepotismo;
    this.observacionDjNepotismo = doc?.evaluacion?.observacion;
    this.idDjNepotismo = doc?.idDocumento;
  }

  setDatosDjImpedimento() {
    const doc = this.listDocumentosReemplazo.find(
      (doc) => doc.tipoDocumento.codigo === "DJ_IMPEDIMENTOS"
    );

    let djImpedimento = {
      adjunto: {
        archivo: doc?.archivo,
      },
    };
    this.adjuntoDjImpedimento = djImpedimento;
    this.observacionDjImpedimento = doc?.evaluacion?.observacion;
    this.idDjImpedimento = doc?.idDocumento;
  }

  setDatosDjNoVinculo() {
    const doc = this.listDocumentosReemplazo.find(
      (doc) => doc.tipoDocumento.codigo === "DJ_NO_VINCULO"
    );

    let djNoVinculo = {
      adjunto: {
        archivo: doc?.archivo,
      },
    };
    this.adjuntoDjNoVinculo = djNoVinculo;
    this.observacionDjNoVinculo = doc?.evaluacion?.observacion;
    this.idDJNoVinculo = doc?.idDocumento;
  }

  setDatosOtros() {
    const doc = this.listDocumentosReemplazo.find(
      (doc) => doc.tipoDocumento.codigo === "OTROS_DOCUMENTOS"
    );

    let otros = {
      adjunto: {
        archivo: doc?.archivo,
      },
    };
    this.adjuntoOtros = otros;
    this.observacionOtros = doc?.evaluacion?.observacion;
    this.idOtros = doc?.idDocumento;
  }

  setDatosSolicitudReemplazo() {
    const doc = this.listDocumentosReemplazo.find(
      (doc) => doc.tipoDocumento.codigo === "OFICIO_CARTA_SOLI_REEMPLAZO"
    );

    let solicitud = {
      adjunto: {
        archivo: doc?.archivo,
      },
    };
    this.adjuntoSolicitudReemplazo = solicitud;
    this.observacionSolReemplazo = doc?.evaluacion?.observacion;
    this.idSolicitudReemplazo = doc?.idDocumento;
  }

  setDatosProyAdenda() {
    const doc = this.listDocumentosReemplazo.find(
      (doc) => doc.tipoDocumento.codigo === "PROYECTO_ADENDA"
    );

    let solicitud = {
      adjunto: {
        archivo: doc?.archivo,
      },
    };
    this.adjuntoProyAdenda = solicitud;
    this.observacionProyAdenda = doc?.evaluacion?.observacion;
    this.idProyAdenda = doc?.idDocumento;
  }

  setCodRolRevisor(user: AuthUser) {
    const codigosRevisores = ["02", "12", "15"];
    this.codRolRevisor = user?.roles.find((rol) =>
      codigosRevisores.includes(rol.codigo)
    )?.codigo;
  }

  private cargarInforme() {
    this.personalReemplazoService
      .obtenerSeccionAdenda(this.idReemplazo, SeccionAdenda.INFORME)
      .subscribe({
        next: (data) => {
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>", data);
        },
        error: (err) => console.error("Error cargando informe", err),
      });
  }
}
