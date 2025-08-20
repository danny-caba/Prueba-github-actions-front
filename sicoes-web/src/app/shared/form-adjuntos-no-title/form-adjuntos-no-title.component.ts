import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { AdjuntosService } from "src/app/service/adjuntos.service";
import { catchError, finalize, map, of } from "rxjs";
import { EvidenciaService } from "src/app/service/evidencia.service";
import { HttpErrorResponse, HttpEventType } from "@angular/common/http";
import { functions } from "src/helpers/functions";
import { Adjunto, AdjuntoRequisto } from "src/app/interface/adjuntos.model";
import { LayoutMiemboComponent } from "../layout-datos-proceso/layout-miembro/layout-miembro.component";
import { functionsAlert } from "src/helpers/functionsAlert";
import * as uuid from "uuid";
import { Solicitud } from "src/app/interface/solicitud.model";
import { OtroRequisito } from "src/app/interface/otro-requisito.model";
import { PersonalReemplazoService } from "src/app/service/personal-reemplazo.service";

@Component({
  selector: "vex-form-adjuntos-no-title",
  templateUrl: "./form-adjuntos-no-title.component.html",
  styleUrls: ["./form-adjuntos-no-title.component.scss"],
})
export class FormAdjuntosNoTitleComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;
  nameInputRamdom = "nameInputRamdom" + uuid.v4();

  @Input() solicitud: Partial<Solicitud>;
  @Input() adjuntoInput: any = {};
  @Input() titulo: string;
  @Input() codigo: string;
  @Input() editable: boolean;
  @Input() otroRequisito: OtroRequisito;
  @Input() archivos: any;
  @Input() archivo: any;
  @Input() proceso: any;
  @Input() contrato: any;
  @Input() isOriginalEval: boolean;

  @Input() idSeccion: string;
  @Input() idTipoDocumento: string;
  @Input() idReemplazoPersonal: string;
  @Input() deNombreDocumento: string;
  @Input() feFechaRegistro: string;
  @Input() archivoDescripcion: string;
  @Input() fechaIn: string;
  @Input() fechaFin: string;

  @Output() archivoAdjuntado = new EventEmitter<boolean>();
  @Output() adjuntoData = new EventEmitter<any>();

  validarRequerido: boolean = false;
  modoBorrador = true;
  booleanView: boolean = false;
  nuevo: boolean = true;

  constructor(
    private adjuntoService: AdjuntosService,
    private reemplazoService: PersonalReemplazoService
  ) {}

  ngOnInit() {}

  clickFile(adj) {
    this.adjuntoInput = adj;
    let element: HTMLElement = document.querySelector(
      `[name="${this.nameInputRamdom}"]`
    ) as HTMLElement;
    element.click();
  }

  onFileInput(file) {
    let itemAdjunto: any = {};
    itemAdjunto = this.adjuntoInput;

    if (file.target.files.length <= 0) {
      return;
    }
    let attach = file.target.files[0];
    let exts = "pdf".split(",");

    let docva = false;
    for (let s of exts) {
      if (this.validateFile(attach.name, s)) {
        docva = true;
        break;
      }
    }
    if (!docva) {
      alert("El tipo o formato de archivo no es Valido!");
      return;
    }

    if (attach.size / 1024 >= 40000) {
      alert("El archivo excede el peso Permitido!");
      return;
    }

    let fileData = file.target.files[0];
    let formData = new FormData();
    formData.append("seccion.idListadoDetalle", this.idSeccion);
    formData.append("tipoDocumento.idListadoDetalle", this.idTipoDocumento);
    formData.append("idReemplazoPersonal", this.idReemplazoPersonal);
    formData.append("deNombreDocumento", this.deNombreDocumento);
    formData.append("feFechaRegistro", this.feFechaRegistro);
    formData.append("archivo.descripcion", this.archivoDescripcion);
    formData.append("file", fileData, fileData.name);
    if (this.fechaIn != null && this.fechaIn != "") {
      formData.append("fechaIn", this.fechaIn);
    }
    if (this.fechaFin != null && this.fechaFin != "") {
      formData.append("fechaFin", this.fechaFin);
    }

    if (this.nuevo) {
      itemAdjunto.inProgress = true;
      itemAdjunto.error = false;

      this.adjuntoInput.idListadoDetalle = 1;

      let upload$ = this.reemplazoService.adjuntarArchivo(formData).pipe(
        map((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              file.progress = Math.round((event.loaded * 100) / event.total);
              break;
            case HttpEventType.Response:
              return event;
          }
        }),
        catchError((error: HttpErrorResponse) => {
          itemAdjunto.inProgress = false;
          itemAdjunto.error = true;
          file.inProgress = false;
          this.archivoAdjuntado.emit(false);
          return of(`${fileData.name} upload failed.`);
        }),
        finalize(() => {
          itemAdjunto.inProgress = false;
        })
      );

      upload$.subscribe((event) => {
        if (typeof event === "object") {
          this.archivoAdjuntado.emit(true);
          this.adjuntoData.emit(event.body);
          itemAdjunto.adjunto = event.body;
          itemAdjunto.esRequerido = false;
        }
      });
    }
  }

  validateFile(name: String, ext_: String) {
    var ext = name.substring(name.lastIndexOf(".") + 1);
    if (ext.toLowerCase() == ext_) {
      return true;
    } else {
      return false;
    }
  }

  descargar(adj) {
    let nombreAdjunto = adj.nombre != null ? adj.nombre : adj.nombreReal;
    this.adjuntoService.descargarWindowsJWT(adj.archivo.codigo, nombreAdjunto);
  }

  obtenerAdjuntos() {
    if (!this.adjuntoInput?.adjunto) return null;
    let adj: any = {
      idArchivo: this.adjuntoInput?.adjunto?.idArchivo,
    };
    return adj;
  }

  validarAdjuntoItem(adj) {
    return this.validarRequerido && functions.noEsVacio(adj.adjunto);
  }

  esValido() {
    return true;
  }

  soloVista() {
    this.editable = false;
  }

  setValues(listReqAdj: AdjuntoRequisto[], listAdj: Adjunto[]) {
    listReqAdj.forEach((item) => {
      listAdj.forEach((adj) => {
        if (item.idListadoDetalle == adj.tipoAdjunto.idListadoDetalle) {
          item.adjunto = adj;
        }
      });
    });
  }

  eliminar(adjunto) {
    functionsAlert
      .questionSiNo("¿Seguro que desea eliminar adjunto?")
      .then((result) => {
        if (result.isConfirmed) {
          this.adjuntoInput = {};
          this.reemplazoService
            .eliminarAdjunto(adjunto?.adjunto.idDocumento)
            .subscribe((res) => {});
          this.archivoAdjuntado.emit(false);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.codigo && this.archivos) {
      let nAdj = this.archivos.find(
        (adj) => adj.tipoArchivo?.codigo === this.codigo
      );
      if (nAdj) {
        this.adjuntoInput.adjunto = nAdj;
      }
    }
    if (this.codigo && this.archivo) {
      this.adjuntoInput.adjunto = this.archivo;
    }
  }
}
