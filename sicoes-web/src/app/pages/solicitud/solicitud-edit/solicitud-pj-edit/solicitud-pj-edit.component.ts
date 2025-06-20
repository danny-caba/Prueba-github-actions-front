import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { PidoService } from 'src/app/service/pido.service';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { ActivatedRoute, Router } from '@angular/router';
import { Link } from 'src/helpers/internal-urls.components';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { LayoutDatosPersJurComponent } from 'src/app/shared/layout-datos/layout-datos-pers-jur/layout-datos-pers-jur.component';
import { LayoutOtrosRequisitosComponent } from 'src/app/shared/layout-otros-requisitos/layout-otros-requisitos.component';
import { LayoutDocumentoAcreditaExpComponent } from 'src/app/shared/layout-documento-acredita-exp/layout-documento-acredita-exp.component';
import { Subscription } from 'rxjs';
import { LayoutDatosRepresentanteLegalComponent } from 'src/app/shared/layout-datos/layout-datos-representante-legal/layout-datos-representante-legal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'vex-solicitud-pj-edit',
  templateUrl: './solicitud-pj-edit.component.html',
  styleUrls: ['./solicitud-pj-edit.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class SolicitudPjEditComponent extends BaseComponent implements OnInit, OnDestroy {

  usuario$ = this.authFacade.user$;
  subscriptionUsuario: Subscription = new Subscription();

  @Input() SOLICITUD: any;
  @Input() editable: boolean = false;
  @Input() editModified = false;
  @Input() actualizable = false;
  @Input() isSubsanar: boolean = false;
  @Input() viewEvaluacion: boolean;
  @Input() itemSeccion: number = 0;

  @ViewChild('layoutDatosPersJur', { static: true }) layoutDatosPersJur: LayoutDatosPersJurComponent;
  @ViewChild('layoutRepresentanteLeg', { static: true }) layoutRepresentanteLeg: LayoutDatosRepresentanteLegalComponent;
  @ViewChild('layoutDocumentosAcreditaExp', { static: true }) layoutDocumentosAcreditan: LayoutDocumentoAcreditaExpComponent;
  @ViewChild('layoutOtrosRequisitos', { static: false }) layoutOtrosRequisitos: LayoutOtrosRequisitosComponent;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private location: Location,
    private pidoService: PidoService,
    private solicitudService: SolicitudService,
    private authFacade: AuthFacade,
    private adjuntoService: AdjuntosService,
    private snackbar: MatSnackBar,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptionUsuario = this.usuario$.subscribe(usu => {
      if(usu && this.editable){
        this.layoutDatosPersJur.validarSNE(usu);
        this.layoutDatosPersJur.formGroup.controls['correo'].disable({ emitEvent: false })
      }
      if (usu && !this.editable && this.actualizable) {
        this.layoutDatosPersJur.validarSNE(usu);
      }
    })
  }

  ngOnDestroy(): void {
    this.subscriptionUsuario.unsubscribe();
  }

  obtenerDatos() {
    let formValues: any = {
      solicitudUuid: this.SOLICITUD.solicitudUuid,
      persona: this.layoutDatosPersJur.getFormValues(),
      representante: this.layoutRepresentanteLeg.getFormValues(),
      historialRepresentante: this.SOLICITUD?.historialRepresentante || []
    }
    formValues.otrosRequisitos = this.layoutOtrosRequisitos.getValues();

    return formValues;
  }

  borrador() {
    functionsAlert.questionSiNo('¿Seguro que desea guardar solicitud preliminar?').then((result) => {
      if (result.isConfirmed) {
        let formValues = this.obtenerDatos();
        this.solicitudService.actualizarBorradorPN(formValues).subscribe(obj => {
          functionsAlert.success('Datos Actualizados').then((result) => {
            //this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST, 'editar', obj.solicitudUuid]);
            this.layoutOtrosRequisitos?.buscarOtrosDocumentos();
            if (this.editModified) {
              this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST]);
            }
          });
        });
      }
    });
  }

  actualizar() {
    functionsAlert.questionSiNo('¿Seguro que desea actualizar la solicitud?').then((result) => {
      if (result.isConfirmed) {
        let formValues = this.obtenerDatos();
        this.solicitudService.actualizarSolicitudConcluido(formValues).subscribe(obj => {
          functionsAlert.success('Datos Actualizados').then((result) => {
            this.layoutOtrosRequisitos?.buscarOtrosDocumentos();
            this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST]);
          });
        });
      }
    });
  }

  cancelar() {
    this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST]);
  }

  enviar() {

    if (!this.layoutOtrosRequisitos.validarOtrosDocumentos()) {
      return;
    }

    if(!this.layoutOtrosRequisitos.esValido()){
      this.snackbar.open('Se deben aceptar los términos y condiciones', 'Cerrar', {
        duration: 7000,
      })
      return;
    }

    //EL SERVICIO DEBE VALIDAR NO EL FRONT
    functionsAlert.questionSiNo('¿Seguro que desea enviar la solicitud?').then((result) => {
      if (result.isConfirmed) {
        let formValues = this.obtenerDatos();
        formValues.origenRegistro = this.SOLICITUD.origenRegistro;

        this.solicitudService.enviarSolicitudPN(formValues).subscribe(obj => {
          let nroExpDes = `Su solicitud de inscripción  en el Registro de Precalificación de Empresas Supervisoras ha sido recibido mediante expediente <b>Nro. ${obj.numeroExpediente}</b>. 
          Cualquier notificación sobre su solicitud se realizará a través del Sistema de Notificaciones Electrónicas del OSINERGMIN - SNE.`
          this.SOLICITUD = obj;

          functionsAlert.successDescargar(nroExpDes).then((result) => {
            this.descargarArchivo(obj);
          });
        });

      }
    });

  }

  descargarArchivo(obj){
    functionsAlert.questionSiNo('¿Desea descargar la solicitud en archivo PDF?').then((result) => {
      if (result.isConfirmed) {
        functionsAlert.loadProceso().then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            this.descargarFormato();
            this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_VIEW, obj.solicitudUuid]);
          }
        })
      }else{
        this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_VIEW, obj.solicitudUuid]);
      }
    });
  }

  descargarArchivoSubsanacion(obj){
    functionsAlert.questionSiNo('¿Desea descargar la solicitud en archivo PDF?').then((result) => {
      if (result.isConfirmed) {
        functionsAlert.loadProceso().then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            this.descargarFormato();
            this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_VIEW, obj.solicitudUuid]);
          }
        })
      }else{
        this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_VIEW, obj.solicitudUuid]);
      }
    });
  }

  enviarSubsanacion() {
    //VALIDACIÓN

    if (!this.layoutOtrosRequisitos.validarOtrosDocumentos()) {
      return;
    }

    //FIN VALIDACIÓN

    functionsAlert.questionSiNo('¿Seguro que desea enviar la solicitud?').then((result) => {
      if (result.isConfirmed) {
        let formValues = this.obtenerDatos();

        this.solicitudService.enviarSolicitudPN(formValues).subscribe(obj => {
          let nroExpDes = `Su solicitud de subsanación en el Registro de Precalificación de Empresas Supervisoras ha sido recibido mediante expediente <b>Nro. ${obj.numeroExpediente}</b>. 
          Cualquier notificación sobre su solicitud se realizará a través del Sistema de Notificaciones Electrónicas del OSINERGMIN - SNE.`
          functionsAlert.successDescargar(nroExpDes).then((result) => {
            this.SOLICITUD = obj;
            this.descargarArchivoSubsanacion(obj);
          });
        });

      }
    });

  }

  descargarFormato(){
    let formato04 = this.SOLICITUD.archivos[0];
    if(formato04){
      let nombreAdjunto = formato04.nombre != null ? formato04.nombre : formato04.nombreReal
      this.adjuntoService.descargarWindowsJWT(formato04.codigo, nombreAdjunto);
    }
  }
}