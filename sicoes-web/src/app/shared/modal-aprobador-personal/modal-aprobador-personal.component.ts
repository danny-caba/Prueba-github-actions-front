import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { BaseComponent } from '../components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { firstValueFrom, Observable } from 'rxjs';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { AuthUser } from 'src/app/auth/store/auth.models';
import { SelectedPerfeccionamientoItem } from 'src/app/interface/contrato.model';
import { ContratoService } from 'src/app/service/contrato.service';
import { REQUERIMIENTO, UsuariosRoles } from 'src/helpers/constantes.components';
import { SelectedReemplazarItem } from 'src/app/interface/reemplazo-personal.model';
import { ModalFirmaDigitalComponent } from '../modal-firma-digital/modal-firma-digital.component';
import { EvaluadorService } from 'src/app/service/evaluador.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DialogFirmasComponent } from '../modal-dialog-firmas/modal-dialog-firmas.component';

interface ArchivoFirmado {
  firmaExitosa: string;
  idArchivoOriginal: number;
  idArchivoFirmado: number;
  mensajeError: string | null;
}

interface RespuestaFirma {
  archivos: ArchivoFirmado[];
}
@Component({
  selector: 'app-modal-aprobador-personal',
  templateUrl: './modal-aprobador-personal.component.html',
  styleUrls: ['./modal-aprobador-personal.component.scss']
})
export class ModalAprobadorPersonalComponent extends BaseComponent implements OnInit {

  observacion = new FormControl('', [Validators.maxLength(500)]);

  progreso: number = 0;
  loadingAccion: boolean = false;
  errores: string[] = [];
  usuario$: any;
  usuario: AuthUser;
  accion: any;
  roles = UsuariosRoles;
  idArchivo: any;
  cookie: string = '';
  iframeUrl: SafeResourceUrl | null = null;
  vistoBueno: boolean;
  nomUs: any;
  codUsuario: any;
  mostrarPopup: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<ModalAprobadorPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      accion: any;
      elementosSeleccionados: SelectedReemplazarItem[];
      tipo: any;
    },
    private solicitudService: SolicitudService,
    private authFacade: AuthFacade,
    private evaluadorService: EvaluadorService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    //private ref: DynamicDialogRef
    // MatDialog ya no se inyecta aquí
  ) {
    super();
  }

  ngOnInit(): void {
    console.log("dataaaaa", this.data);
    this.accion = this.data.tipo;
    this.codUsuario = this.data.accion;
    this.usuario$ = this.authFacade.user$;
    this.usuario$.subscribe(usu => {
      this.usuario = usu;
    });
    this.idArchivo = this.data.elementosSeleccionados[0]?.idArchivo;
    /* if (this.data.elementosSeleccionados.length === 0) {
       this.observacion.disable();
     }*/
    this.nomUs = sessionStorage.getItem("NOMUS")
    /*if (typeof window !== 'undefined') {
      window.addEventListener(
        'message',
        this.onFirmaCompletada.bind(this), false);
    }*/
  }

  cancelar(): void {
    this.dialogRef.close('cancel');
  }

  cerrar(): void {
    this.dialogRef.close('OK');
  }

  validarObservacion(): boolean {
    if (!this.observacion.valid) {
      this.observacion.markAsTouched();
      return true;
    }
    return false;
  }

  async realizarAccion(tipoAccion: string, accion: number): Promise<void> {

    this.errores = [];
    let msj = `¿Está seguro de que desea ${tipoAccion} la evaluación?`;

    if (this.validarObservacion()) {
      return;
    }

    functionsAlert.questionSiNo(msj).then(async (result) => {
      if (result.isConfirmed) {
        let requerimiento = "";
        if (this.accion.includes(this.roles.GER_G2) && this.nomUs == 'RVERAC') {
          requerimiento = REQUERIMIENTO.EVAL_INF_APROB_TEC_G2
        } else if (this.accion.includes(this.roles.GER_03)) {
          requerimiento = REQUERIMIENTO.EVAL_INF_APROB_TEC_G3
        } else if (this.codUsuario === UsuariosRoles.EVALUADOR) {
          requerimiento = REQUERIMIENTO.APROB_EVAL_CONTR
        }
        this.loadingAccion = true;
        if (accion == 1) {
          this.firmarArchivo(1);
        } else if (accion == 2) {
          this.firmarVistoBueno();
        } else if (accion == 3) {
          this.aprobar(requerimiento);
        } else if (accion == 4) {
          this.rechazar(requerimiento);
        }else if (accion == 5) {
          this.firmarArchivo(5);
        }


      }
    });
  }

  aprobar(requerimiento: string) {
    let json = {
      "idAprobacion": this.data.elementosSeleccionados[0].idAprobacion,
      "estadoAprob": this.data.elementosSeleccionados[0].estadoAprob,
      "deObservacion": this.observacion.value,
      "requerimiento": requerimiento,
      "idDocumento": this.data.elementosSeleccionados[0].idDocumento,
      "accion": "A",
      "conforme": true
    }
    this.solicitudService.aprobarReemplazo(json).subscribe(resp => {
      this.loadingAccion = false;
      console.log("respuesta", resp);
      this.cerrar()
    })
  }

  rechazar(requerimiento: string) {
    let json = {
      "idAprobacion": this.data.elementosSeleccionados[0].idAprobacion,
      "estadoAprob": this.data.elementosSeleccionados[0].estadoAprob,
      "deObservacion": this.observacion.value,
      "requerimiento": requerimiento,
      "accion": "R",
      "conforme": true
    }
    this.solicitudService.aprobarReemplazo(json).subscribe(resp => {
      this.loadingAccion = false;
      console.log("respuesta", resp);
      functionsAlert.success('Guardado [OK]');
      this.cerrar();
      
    })

  }

  private firmarArchivo(id: number): void {
    const firmaKey = id === 1 ? 'firmaJefe' : 'firmaGerente';

    let body: any = {
      idAdenda: this.data.elementosSeleccionados[0].idAdenda,
      [firmaKey]: true
    };
    const token = { usuario: sessionStorage.getItem("USUARIO") };

    this.solicitudService.buscarDocumentoReemplazo(this.data.elementosSeleccionados[0].idDocumento).subscribe({
      next: (resp) => {
        this.evaluadorService.obtenerParametrosfirmaDigital(token).subscribe({
          next: (parameter) => {
            this.dialog.open(ModalFirmaDigitalComponent, {
              width: '605px',
              data: {
                action: parameter.action,
                loginUsuario: parameter.loginUsuario,
                passwordUsuario: parameter.passwordUsuario,
                archivosFirmar: resp.idArchivoSiged
              }
            }).afterClosed().subscribe(result => {
              console.log("result modal", result)
              if (result == 'OK') {
                this.solicitudService.vistoBuenoFirma(body).subscribe({
                  next: (resp) => {
                    console.log("respuesta finalizar", resp);
                      this.cerrar();
                    
                    
                  },
                  error: (err) => {
                    console.error('[Visto Bueno Error]', err);
                    let mensaje = 'Ocurrió un error al solicitar el visto bueno.';
                    if (err?.error?.errorCode) {
                      mensaje = err.error.errorCode;
                    }
                    this.showError(mensaje);
                  }
                });
              }
            });
          },
          error: (err) => console.error('Error obteniendo parámetros de firma:', err)
        });
      }, error: (err) => console.error('Error id archivo', err)
    });
  }

  private firmarVistoBueno(): void {
    let body = {
      "idAdenda": this.data.elementosSeleccionados[0].idAdenda,
      "observacion": this.observacion.value,
      "visto": true
    }
    const token = { usuario: sessionStorage.getItem("USUARIO") };

    this.solicitudService.buscarDocumentoReemplazo(this.data.elementosSeleccionados[0].idDocumento).subscribe({
      next: (resp) => {
        this.evaluadorService.obtenerParametrosfirmaDigital(token).subscribe({
          next: (parameter) => {
            this.dialog.open(ModalFirmaDigitalComponent, {
              width: '605px',
              data: {
                action: parameter.action,
                loginUsuario: parameter.loginUsuario,
                passwordUsuario: parameter.passwordUsuario,
                archivosFirmar: resp.idArchivoSiged
              }
            }).afterClosed().subscribe(result => {
              console.log("result modal", result)
              if (result == 'OK') {
                this.solicitudService.vistoBuenoFirma(body).subscribe({
                  next: (resp) => {
                    console.log("respuesta finalizar visto bueno", resp);
                      this.cerrar();
                    
                  },
                  error: (err) => {
                    console.error('[Visto Bueno Error]', err);
                    let mensaje = 'Ocurrió un error al solicitar el visto bueno.';
                    if (err?.error?.errorCode) {
                      mensaje = err.error.errorCode;
                    }
                    this.showError(mensaje);
                  }
                });
              }
            });
          },
          error: (err) => console.error('Error obteniendo parámetros de firma:', err)
        });
      }, error: (err) => console.error('Error id archivo', err)
    });

  }


  cerrarPopup(): void {
    this.iframeUrl = null;
    if (this.dialog) {
      this.dialog.closeAll();
    }
    this.mostrarPopup = false;
  }

  showError(msg: string): void {
    alert(msg);
    this.iframeUrl = null;
    this.mostrarPopup = false;
    if (this.dialog) {
      this.dialog.closeAll();
    }
  }

  mostrarPop(): void {
    this.dialog.open(DialogFirmasComponent, {
      width: '60vw',
      height: '80vh',
      panelClass: 'custom-dialog',
      disableClose: true, // Hace que el diálogo sea modal (como [modal]="true")
      data: { iframeUrl: this.iframeUrl }
    });
  }


}