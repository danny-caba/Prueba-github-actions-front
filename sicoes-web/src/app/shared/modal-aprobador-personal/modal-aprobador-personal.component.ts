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
  nomUs:any;
  codUsuario:any;
  mostrarPopup:boolean=false;
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
    this.codUsuario=this.data.accion;
    this.usuario$ = this.authFacade.user$;
    this.usuario$.subscribe(usu => {
      this.usuario = usu;
    });
    this.idArchivo = this.data.elementosSeleccionados[0]?.idArchivo;
    /* if (this.data.elementosSeleccionados.length === 0) {
       this.observacion.disable();
     }*/
    this.nomUs=sessionStorage.getItem("NOMUS")
    if (typeof window !== 'undefined') {
      window.addEventListener(
        'message',
        this.onFirmaCompletada.bind(this), false);
    }
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
        if (this.accion.includes(this.roles.GER_G2) && this.nomUs=='RVERAC') {
          requerimiento = REQUERIMIENTO.EVAL_INF_APROB_TEC_G2
        } else if (this.accion.includes(this.roles.GER_03)) {
          requerimiento = REQUERIMIENTO.EVAL_INF_APROB_TEC_G3
        } else if (this.codUsuario===UsuariosRoles.EVALUADOR) {
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
      "idDocumento":this.data.elementosSeleccionados[0].idDocumento,
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
      this.cerrar()
    })

  }

  private firmarArchivo(): void {
    let body = {
      "idAdenda": this.data.elementosSeleccionados[0].idAdenda,
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
        this.mostrarPopup=true;
        this.mostrarPop();
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
      "idAdenda": this.data.elementosSeleccionados[0].idAdenda,
      "observacion": this.observacion.value,
      "visto": true,
      "firmaJefe": false,
      "firmaGerente": false

    }

    this.cookie = '2irh2waufqi1_dZN7ZLzZeNPdpN7VgODVDQjeTcfR5Kf1Z6dryrI!1404084662!1756135884462';
    const htm=`<!DOCTYPE html>
 
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>OSIFIRMA</title>
<link type="text/css" rel="stylesheet" href="/osifirma/stylesheets/app/osifirma.css;jsessionid=2irh2waufqi1_dZN7ZLzZeNPdpN7VgODVDQjeTcfR5Kf1Z6dryrI!1404084662"/>
 
<link type="image/x-icon" href="/osifirma/images/osinergmin.ico;jsessionid=2irh2waufqi1_dZN7ZLzZeNPdpN7VgODVDQjeTcfR5Kf1Z6dryrI!1404084662" rel="shortcut icon" id="favicon"/>
 
<script type="text/javascript" src="/osifirma/javascript/third-party/jquery-3.3.1.min.js;jsessionid=2irh2waufqi1_dZN7ZLzZeNPdpN7VgODVDQjeTcfR5Kf1Z6dryrI!1404084662"></script>
 
<script type="text/javascript" src="/osifirma/javascript/third-party/jquery-ui-1.12.1.custom.min.js;jsessionid=2irh2waufqi1_dZN7ZLzZeNPdpN7VgODVDQjeTcfR5Kf1Z6dryrI!1404084662"></script>
 
<script type="text/javascript" src="/osifirma/javascript/third-party/json.min.js;jsessionid=2irh2waufqi1_dZN7ZLzZeNPdpN7VgODVDQjeTcfR5Kf1Z6dryrI!1404084662 "></script>
 
<script type="text/javascript" src="/osifirma/javascript/third-party/jquery.form.js;jsessionid=2irh2waufqi1_dZN7ZLzZeNPdpN7VgODVDQjeTcfR5Kf1Z6dryrI!1404084662"></script>
 
<script type="text/javascript" src="/osifirma/javascript/third-party/json2.js;jsessionid=2irh2waufqi1_dZN7ZLzZeNPdpN7VgODVDQjeTcfR5Kf1Z6dryrI!1404084662"></script>
 
<script type="text/javascript" src="/osifirma/javascript/third-party/array2.js;jsessionid=2irh2waufqi1_dZN7ZLzZeNPdpN7VgODVDQjeTcfR5Kf1Z6dryrI!1404084662"></script>
 
<script type="text/javascript" src="/osifirma/javascript/third-party/hashmap.js;jsessionid=2irh2waufqi1_dZN7ZLzZeNPdpN7VgODVDQjeTcfR5Kf1Z6dryrI!1404084662"></script>
 
<script type="text/javascript" src="/osifirma/javascript/app/Osinergmin.js;jsessionid=2irh2waufqi1_dZN7ZLzZeNPdpN7VgODVDQjeTcfR5Kf1Z6dryrI!1404084662"></script>
 
<script type="text/javascript" src="/osifirma/javascript/app/Osinergmin.ui.utils.js;jsessionid=2irh2waufqi1_dZN7ZLzZeNPdpN7VgODVDQjeTcfR5Kf1Z6dryrI!1404084662"></script>
 
<script type="text/javascript" src="/osifirma/javascript/app/Osinergmin.ui.validations.js;jsessionid=2irh2waufqi1_dZN7ZLzZeNPdpN7VgODVDQjeTcfR5Kf1Z6dryrI!1404084662"></script>
 
<script type="text/javascript" src="/osifirma/javascript/app/Osinergmin.browser.js;jsessionid=2irh2waufqi1_dZN7ZLzZeNPdpN7VgODVDQjeTcfR5Kf1Z6dryrI!1404084662"></script>
 
<script type="text/javascript" src="/osifirma/javascript/app/Osinergmin.loading.js;jsessionid=2irh2waufqi1_dZN7ZLzZeNPdpN7VgODVDQjeTcfR5Kf1Z6dryrI!1404084662"></script>
<script type="text/javascript" src="/osifirma/javascript/firmaDigital/firma.js"></script>
</head>
<body>
<div id="mensajeProcesamientoPostfirma" class="mensaje hidden">Realizando las acciones finales del firmado digital...</div>
<div>
<form>
<input type="hidden" id="codigoSi" value="S" />
<input type="hidden" id="codigoNo" value="N" />
<input type="hidden" id="autenticado" value="N" />
<input type="hidden" id="huboError" value="" />
<input type="hidden" id="error" value="Sus credenciales no son válidas para realizar el firmado digital" />
<input type="hidden" id="mensajeErrorGenericoSignNet" value="Ocurrió un error inesperado en el proceso de firmado digital" />
<input type="hidden" id="mensajeErrorGenericoPostFirma" value="Ocurrió un error inesperado al intentar ejecutar el proceso postfirma" />
</form>
</div>
<div>
<form method="post" id="ssoForm" name="ssoForm" target="iframeFirmaSignNet" action='' accept-charset="ISO-8859-1">
<input type="hidden" name="rutaOrigen" value='' />
<input type="hidden" name="rutaDestino" value='' />
<input type="hidden" name="nombreArchivos" value='' />
<input type="hidden" name="invisible" value='' />
<input type="hidden" name="estiloFirma" value='' />
<input type="hidden" name="rutaImagen" value='' />
<input type="hidden" name="imagen" value='' />
<input type="hidden" name="aplicarImagen" value='' />
<input type="hidden" name="posicionFirma" value='' />
<input type="hidden" name="nombreTag" value='' />
<input type="hidden" name="ubicacionPagina" value='' />
<input type="hidden" name="usarPersonalizado" value='' />
<input type="hidden" name="tamanoFuente" value='' />
<input type="hidden" name="tipoFirma" value='' />
<input type="hidden" name="aplicarTsa" value='' />
<input type="hidden" name="urlTsa" value='' />
<input type="hidden" id="hayMotivo" value='' />
<input type="hidden" name="altoRubrica" value="80" />												
<input type="hidden" name="anchoRubrica" value="70" />	        		
</form>
</div>
<div>
<iframe id="iframeFirmaSignNet" name="iframeFirmaSignNet" frameborder="0" width="550px" height="320px"></iframe>
</div>
<div id="overlayNormal" class="overlayNormal hidden"></div>
<div id="overlayIE" class="overlayIE hidden"></div>
</body>
</html>`;

       const html = this.injectScripts(htm);
        this.iframeUrl = this.createIframeUrl(html);
        this.mostrarPopup=true;
        this.mostrarPop();
    /* this.solicitudService.vistoBueno(body).subscribe({
      next: (resp) => {
        this.cookie = resp.cookie;
        const html = this.injectScripts(resp.html);
        this.iframeUrl = this.createIframeUrl(html);
        this.mostrarPopup=true;
        this.mostrarPop();
      },
      error: (err) => {
        console.error('[Visto Bueno Error]', err);
        let mensaje = 'Ocurrió un error al solicitar el visto bueno.';
        if (err?.error?.errorCode) {
          mensaje = err.error.errorCode;
        }
        this.showError(mensaje);
      }
    });*/
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
    this.mostrarPopup=false;
  }

  showError(msg: string): void {
    alert(msg);
    this.iframeUrl = null;
    this.mostrarPopup=false;
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