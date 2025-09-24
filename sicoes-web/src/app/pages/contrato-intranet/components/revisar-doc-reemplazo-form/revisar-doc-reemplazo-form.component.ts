import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { AdjuntosService } from "src/app/service/adjuntos.service";
import { PersonalReemplazoService } from "src/app/service/personal-reemplazo.service";
import { BaseComponent } from "src/app/shared/components/base.component";
import { functionsAlert } from "src/helpers/functionsAlert";
import { Link } from "src/helpers/internal-urls.components";

@Component({
  selector: "vex-revisar-doc-reemplazo-form",
  templateUrl: "./revisar-doc-reemplazo-form.component.html",
  styleUrls: ["./revisar-doc-reemplazo-form.component.scss"],
  animations: [fadeInRight400ms, stagger80ms],
})
export class RevisarDocReemplazoFormComponent
  extends BaseComponent
  implements OnInit {
  btnRegister: string = "Registrar";
  btnGuardarAdenda: string = "Guardar Adenda";
  idSolicitud: string = "";
  idReemplazoPersonal: string = "";
  uuidSolicitud: string = "";
  codRolRevisor: string = null;
  listaObservaciones: any;

  isCargaAdenda: boolean = false;
  puedeRegistrar: boolean = false;
  allDocsConforme: boolean = false;
  obsCompletas: boolean = false;

  isAdendaComplete: boolean = false;
  uploadData: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly reemplazoService: PersonalReemplazoService,
    private readonly adjunto: AdjuntosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      if (data.isCargaAdenda) {
        this.isCargaAdenda = data.isCargaAdenda;
      }
    });
    this.getParams();
  }

  toGoBandejaContratos() {
    functionsAlert
      .questionSiNo(
        "¿Desea regresar a la sección de Revisar documento de Personal de Reemplazo?"
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.router.navigate([
            Link.INTRANET,
            Link.CONTRATOS_LIST,
            Link.REEMPLAZO_PERSONAL_REVIEW,
            this.idSolicitud,
          ]);
        }
      });
  }

  getParams(): void {
    this.idSolicitud = this.route.snapshot.paramMap.get("idSolicitud");
    this.idReemplazoPersonal = this.route.snapshot.paramMap.get("idReemplazo");
  }

  registrarRevision(): void {
    if ("15" === this.codRolRevisor) {
      functionsAlert
        .questionSiNo(
          "Seguro de registrar las observaciones de la revisión de documentos del personal propuesto de reemplazo"
        )
        .then((result) => {
          if (result.isConfirmed) {
            this.reemplazoService
              .registrarObservaciones(this.listaObservaciones)
              .subscribe((response) => {
                if (response.archivo != undefined && response.archivo != null) {
                  this.adjunto.descargarWindowsJWT(response.archivo.codigo, response.archivo.nombreReal);

                }
                this.router.navigate([
                  Link.INTRANET,
                  Link.CONTRATOS_LIST,
                  Link.REEMPLAZO_PERSONAL_REVIEW,
                  this.idSolicitud,
                ]);
              });
          }
        });
    } else {
      const body = {
        idReemplazo: Number(this.idReemplazoPersonal),
        codRol: this.codRolRevisor,
      };

      const mensajeConfirmacion = this.obtenerMensajeConfirmacion();

      functionsAlert.questionSiNo(mensajeConfirmacion).then((result) => {
        if (result.isConfirmed) {
          this.reemplazoService
            .guardarRevDocumentos(body)
            .subscribe((response) => {
              if (response.archivo != undefined && response.archivo != null) {
                this.adjunto.descargarWindowsJWT(response.archivo.codigo, response.archivo.nombreReal);

              }
              this.router.navigate([
                Link.INTRANET,
                Link.CONTRATOS_LIST,
                Link.REEMPLAZO_PERSONAL_REVIEW,
                this.idSolicitud,
              ]);
            });
        }
      });
    }
  }

  registrarAdenda(): void {
    functionsAlert
      .questionSiNo(
        "¿Seguro de guardar la adenda para el reemplazo del personal propuesto?"
      )
      .then((result) => {
        if (result.isConfirmed) {
          const body = {
            idReemplazoPersonal: Number(this.idReemplazoPersonal),
            idDocumento: this.uploadData.idDocumento,
          };
          this.reemplazoService.guardarAdenda(body).subscribe({
            next: () => {
              this.router.navigate([
                Link.INTRANET,
                Link.CONTRATOS_LIST,
                Link.REEMPLAZO_PERSONAL_REVIEW,
                this.idSolicitud,
              ]);
            },
          });
        }
      });
  }

  obtenerMensajeConfirmacion() {
    if (this.allDocsConforme) {
      return "¿Seguro de registrar la revisión de documentos del personal propuesto de reemplazo?";
    } else {
      return "Se encontró al menos un No, seguro de enviar para que subsane la empresa supervisora";
    }
  }

  recibirFlagSeccionesCompletadas(flag: boolean): void {
    this.puedeRegistrar = flag;
  }

  recibirCodigoRevisor(codigoRevisor: string) {
    this.codRolRevisor = codigoRevisor;
  }

  recibirConformidades(allConforme: boolean) {
    this.allDocsConforme = allConforme;
  }

  recibirFlagObsCompletas(obsCompletas: boolean) {
    this.obsCompletas = obsCompletas;
    this.puedeRegistrar = obsCompletas;
  }

  recibirListaObservaciones(listaObs: any) {
    this.listaObservaciones = listaObs;
  }

  dataFileUpload(data: any): void {
    this.uploadData = data;
  }
}
