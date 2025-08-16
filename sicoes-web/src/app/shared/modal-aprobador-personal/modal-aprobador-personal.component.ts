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
    this.usuario$ = this.authFacade.user$;
    this.usuario$.subscribe(usu => {
      this.usuario = usu;
    });
    this.idArchivo = this.data.elementosSeleccionados[0]?.idArchivo;
    /* if (this.data.elementosSeleccionados.length === 0) {
       this.observacion.disable();
     }*/

    if (typeof window !== 'undefined') {
      window.addEventListener(
        'message',
        this.onFirmaCompletada.bind(this), false);
    }
  }

  cancelar(): void {
    this.dialogRef.close('cancel');
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
        if (this.accion.includes(this.roles.GER_G2)) {
          requerimiento = REQUERIMIENTO.EVAL_INF_APROB_TEC_G2
        } else if (this.accion.includes(this.roles.APROBADOR_G3)) {
          requerimiento = REQUERIMIENTO.EVAL_INF_APROB_TEC_G3
        } else if (this.accion.includes(this.roles.EVALUADOR)) {
          requerimiento = REQUERIMIENTO.APROB_EVAL_CONTR
        }
        this.loadingAccion = true;
        if (accion == 1) {
          this.firmarArchivo();
        } else if (accion == 2) {
          this.firmarVistoBueno();
        } else if (accion == 3) {
          this.aprobar(requerimiento);
        } else if (accion == 4) {
          this.rechazar(requerimiento);
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
      "accion": "A",
      "conforme": true
    }
    this.solicitudService.aprobarReemplazo(json).subscribe(resp => {
      this.loadingAccion = false;
      console.log("respuesta", resp);
      this.cancelar()
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
      this.cancelar()
    })

  }

  private firmarArchivo(): void {
    let body = {
      "idAdenda": this.data.elementosSeleccionados[0].idAprobacion,
      "observacion": this.observacion.value,
      "cookie": "ABC123XYZ",
      "visto": true,
      "firmaJefe": true,
      "firmaGerente": false
    }
    this.solicitudService.firmaDigital(body).subscribe({
      next: (resp) => {
        this.cookie = resp.cookie;
        const html = this.injectScripts(resp.html);
        this.iframeUrl = this.createIframeUrl(html);
      },
      error: (err) => {
        console.error('[Firma Error]', err);
        let mensaje = 'Ocurrió un error al firmar el archivo.';
        if (err?.error?.errorCode) {
          mensaje = err.error.errorCode;
        }
        this.showError(mensaje);
      }
    });
  }

  private firmarVistoBueno(): void {
    let body = {
      "idAdenda": this.data.elementosSeleccionados[0].idAprobacion,
      "observacion": this.observacion.value,
      "cookie": "ABC123XYZ",
      "visto": true,
      "firmaJefe": false,
      "firmaGerente": false
    
    }
    this.solicitudService.vistoBueno(body).subscribe({
      next: (resp) => {
        this.cookie = resp.cookie;
        const html = this.injectScripts(resp.html);
        this.iframeUrl = this.createIframeUrl(html);
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

  private injectScripts(html: string): string {
    const postMessageScript = `
      <script>
        console.log('[SignNet] Script de comunicación cargado');
  
        const EXITO = 0, FRACASO = -1, CANCELADO = 1;
  
        function sendMessage(resultado, mensaje) {
          console.log('[SignNet] Enviando mensaje al padre:', { resultado, mensaje });
          window.parent.postMessage(JSON.stringify({ resultado, mensaje }), '*');
        }
  
        function handleSignNetMessage(e) {
          console.log('[SignNet] Mensaje recibido:', e.data);
          try {
            const data = JSON.parse(e.data);
            console.log('[SignNet] JSON parseado:', data);
  
            if (data.resultado == EXITO) {
              console.log('[SignNet] Firma exitosa');
              sendMessage(EXITO, 'Firma completada');
            } else {
              console.warn('[SignNet] Firma fallida o cancelada:', data.estado);
              sendMessage(FRACASO, data.estado || 'Firma cancelada o fallida');
            }
          } catch (err) {
            console.error('[SignNet] Error al parsear JSON del mensaje:', err, e.data);
            sendMessage(FRACASO, 'Respuesta de firma inválida');
          }
        }
  
        window.addEventListener('message', handleSignNetMessage, false);
      </script>
    `;

    const autoSubmitScript = `
    <script>
      console.log('[SignNet] Ejecutando auto-submit');
  
      window.addEventListener('load', function () {
        if (!window.__alreadySubmitted) {
          window.__alreadySubmitted = true;
          const form = document.getElementById('ssoForm');
          if (form) {
            console.log('[SignNet] Formulario encontrado. Enviando...');
            form.submit();
            console.log('[SignNet] submit() ejecutado');
          } else {
            console.warn('[SignNet] Formulario no encontrado');
          }
        } else {
          console.warn('[SignNet] Auto-submit ya fue ejecutado. Evitando doble envío.');
        }
      });
    </script>
  `;

    return html.replace(
      '</body>',
      `${autoSubmitScript}${postMessageScript}</body>`
    );
  }

  private createIframeUrl(html: string): SafeResourceUrl {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private onFirmaCompletada(event: MessageEvent) {
    try {
      console.log("event:------------------------>", event)
      const data = JSON.parse(event.data);
      console.log("Data recibida_onFirma:", data);
      if (data.resultado == -1) {
        this.onFailureCallbackOsifirma(data.mensaje);
      } else if (data.resultado == 1) {
        this.onFailureCallbackOsifirma(data.mensaje);
      } else if (data.resultado == 0) {
        this.onSuccessCallbackOsifirma();
      } else {
        this.onFailureCallbackOsifirma(data.mensaje);
      }
    } catch {
      console.error('[Mensaje inválido recibido]', event.data);
    }
  }

  private onSuccessCallbackOsifirma() {
    const esVistoBueno = this.vistoBueno;
    if (esVistoBueno) {
      this.finalizarVisto(esVistoBueno)
    } else {
      this.finalizarFirma(esVistoBueno);
    }
  }

  private finalizarFirma(hayMotivo: boolean): void {
    this.finalizarAccion(

      this.solicitudService.finalizarFirma.bind(this.solicitudService),
      hayMotivo
    );
  }

  private finalizarVisto(hayMotivo: boolean): void {
    this.finalizarAccion(
      this.solicitudService.finalizarVistoBueno.bind(this.solicitudService),
      hayMotivo
    );
  }

  private onFailureCallbackOsifirma(mensaje: string): void {
    alert(mensaje);
    this.cerrarPopup();
  }

  private finalizarAccion(
    servicio: (body) => Observable<RespuestaFirma>,
    hayMotivo: boolean): void {

    //console.log('[Finalizar Acción] ID Documento:', this.idDocumento);
    console.log('[Finalizar Acción] Cookie:', this.cookie);
    console.log('[Finalizar Acción] Hay Motivo:', hayMotivo);
    let body = {}
    servicio(body).subscribe({
      next: (res: RespuestaFirma) => {
        if (res?.archivos?.length) {
          const archivosConError = res.archivos.filter(a => a.mensajeError);
          if (archivosConError.length > 0) {
            let mensajeError = 'Errores en archivos firmados:\n';
            archivosConError.forEach((a, i) => {
              mensajeError += `${i + 1}.- ID archivo ${a.idArchivoOriginal}: ${a.mensajeError}\n`;
            });
            this.showError(mensajeError);
          } else {
            let mensaje = '';
            res.archivos.forEach((archivo, i) => {
              mensaje += `${i + 1}.- ID archivo original: ${archivo.idArchivoOriginal}, ID archivo firmado: ${archivo.idArchivoFirmado}.\n`;
            });
            alert(mensaje);
            this.cerrarPopup();
          }
        } else {
          alert('No se encontraron archivos firmados.');
          this.cerrarPopup();
        }
      },
      error: (err) => {
        console.error('[Error al finalizar acción]', err);
        let mensaje = 'Ocurrió un error al finalizar la acción.';
        if (err?.error?.errorCode) {
          mensaje = err.error.errorCode;
        }
        this.showError(mensaje);
      }
    });
  }

  cerrarPopup(): void {
    this.iframeUrl = null;
    if (this.dialog) {
      this.dialog.closeAll();
    }
  }

  showError(msg: string): void {
    alert(msg);
    this.iframeUrl = null;
    if (this.dialog) {
      this.dialog.closeAll();
    }
  }



}