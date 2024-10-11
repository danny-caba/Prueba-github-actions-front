import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from "@angular/core";

import { AdjuntosService } from "src/app/service/adjuntos.service";
import { catchError, finalize, map } from "rxjs/operators";
import { HttpErrorResponse, HttpEventType } from "@angular/common/http";
import { of } from "rxjs";
import { functions } from "src/helpers/functions";
import { Adjunto, AdjuntoRequisto } from "src/app/interface/adjuntos.model";
import { functionsAlert } from "src/helpers/functionsAlert";
import { OtroRequisito } from "src/app/interface/otro-requisito.model";
import * as uuid from 'uuid';
import { Solicitud } from "src/app/interface/solicitud.model";


@Component({
  selector: "vex-form-adjuntos-btn",
  templateUrl: "./form-adjuntos-btn.component.html",
  styleUrls: ["./form-adjuntos-btn.component.scss"],
})
export class FormAdjuntosBtnComponent implements OnInit {

  @ViewChild("fileInput") fileInput: ElementRef;
  nameInputRamdom = 'nameInputRamdom' + uuid.v4();

  @Input() solicitud: Partial<Solicitud>;
  @Input() adjuntoInput: any = {}
  @Input() titulo: string;
  @Input() codigo: string;
  @Input() editable: boolean;
  @Input() otroRequisito: OtroRequisito;
  @Input() archivos: any;
  @Input() archivo: any;

  validarRequerido: boolean = false;
  modoBorrador = true;
  booleanView: boolean = false;
  nuevo: boolean = true;

  constructor(private adjuntoService: AdjuntosService) { }

  ngOnInit() { }

  clickFile(adj) {
    this.adjuntoInput = adj;
    let element: HTMLElement = document.querySelector(`[name="${this.nameInputRamdom}"]`) as HTMLElement;
    element.click();
  }

  onFileInput(file) {
    let itemAdjunto: any = {};
    itemAdjunto = this.adjuntoInput;

    if (file.target.files.length <= 0) {
      return;
    }
    let attach = file.target.files[0];
    let exts = "jpeg,jpg,png,pdf".split(",");

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
      //this.snackMsg("El archivo excede el peso Permitido!")
      alert("El archivo excede el peso Permitido!");
      return;
    }

    let fileData = file.target.files[0];
    let formData = new FormData();
    formData.append("file", fileData, fileData.name);
    formData.append("codigo", this.codigo);
    if(this.solicitud?.solicitudUuid){
      formData.append("solicitudUuid", this.solicitud?.solicitudUuid + '');
    }


    if (this.nuevo) {
      itemAdjunto.inProgress = true;
      itemAdjunto.error = false;

      this.adjuntoInput.idListadoDetalle = 1;

      let upload$ = this.adjuntoService
        .upload(formData, this.adjuntoInput)
        .pipe(
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
            //alert(`${fileData.name} upload failed.`);
            return of(`${fileData.name} upload failed.`);
          }),
          finalize(() => {
            itemAdjunto.inProgress = false;
          })
        );

      upload$.subscribe((event) => {
        if (typeof event === "object") {
          itemAdjunto.adjunto = event.body;
          itemAdjunto.esRequerido = false;
          if (this.otroRequisito) {
            this.otroRequisito.archivo = event.body;
          }
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
    let nombreAdjunto = adj.nombre != null ? adj.nombre : adj.nombreReal
    this.adjuntoService.descargarWindowsJWT(adj.codigo, nombreAdjunto);
  }

  obtenerAdjuntos() {
    if (!this.adjuntoInput?.adjunto) return null;
    let adj: any = {
      idArchivo: this.adjuntoInput?.adjunto?.idArchivo
    }
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
    listReqAdj.forEach(item => {
      listAdj.forEach(adj => {
        if (item.idListadoDetalle == adj.tipoAdjunto.idListadoDetalle) {
          item.adjunto = adj;
        }
      });
    });
  }

  eliminar(adjunto) {
    functionsAlert.questionSiNo('¿Seguro que desea eliminar adjunto?').then((result) => {
      if (result.isConfirmed) {
        this.adjuntoInput = {};
        if (this.otroRequisito) {
          this.otroRequisito.archivo = null;
        }
      }
    });
  }

  eliminarSinMensaje(adjunto) {
    this.adjuntoInput = {};
    if (this.otroRequisito) {
      this.otroRequisito.archivo = null;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.codigo && this.archivos) {
      let nAdj = this.archivos.find(adj => (adj.tipoArchivo?.codigo === this.codigo));
      if (nAdj) {
        this.adjuntoInput.adjunto = nAdj;
      }
    }
    if (this.codigo && this.archivo) {
      this.adjuntoInput.adjunto = this.archivo;
    }
  }

}
