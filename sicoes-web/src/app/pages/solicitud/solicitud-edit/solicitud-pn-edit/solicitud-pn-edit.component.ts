import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { ActivatedRoute, Router } from '@angular/router';
import { Link } from 'src/helpers/internal-urls.components';
import { LayoutGradoAcademicoComponent } from 'src/app/shared/layout-grado-academico/layout-grado-academico.component';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LayoutDatosPersNatComponent } from 'src/app/shared/layout-datos/layout-datos-pers-nat/layout-datos-pers-nat.component';
import { Subscription } from 'rxjs';
import { LayoutOtrosRequisitosComponent } from 'src/app/shared/layout-otros-requisitos/layout-otros-requisitos.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'vex-solicitud-pn-edit',
  templateUrl: './solicitud-pn-edit.component.html',
  styleUrls: ['./solicitud-pn-edit.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class SolicitudPnEditComponent extends BaseComponent implements OnInit, OnDestroy {

  usuario$ = this.authFacade.user$;
  subscriptionUsuario: Subscription = new Subscription();

  @Input() SOLICITUD: any;
  @Input() editable: boolean = false;
  @Input() isSubsanar: boolean = false;
  @Input() viewEvaluacion: boolean;
  @Input() itemSeccion: number = 0;

  completeFields: boolean;

  @ViewChild('layoutDatosPersNat', { static: true }) layoutDatosPersNat: LayoutDatosPersNatComponent;
  @ViewChild('layoutGradoAcademico', { static: true }) layoutGradoAcademico: LayoutGradoAcademicoComponent;
  @ViewChild('layoutOtrosRequisitos', { static: true }) layoutOtrosRequisitos: LayoutOtrosRequisitosComponent;

  constructor(
    private router: Router,
    private solicitudService: SolicitudService,
    private authFacade: AuthFacade,
    private adjuntoService: AdjuntosService,
    private snackbar: MatSnackBar,
    private activeRoute: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptionUsuario = this.usuario$.subscribe(usu => {
      if (usu && this.editable == true) {
        this.layoutDatosPersNat.validarSNE(usu);
        this.layoutDatosPersNat.formGroup.controls['correo'].disable({ emitEvent: false })
      }
    })
  }

  ngOnDestroy(): void {
    this.subscriptionUsuario.unsubscribe();
  }

  obtenerDatos() {
    let formValues: any = {
      ... this.SOLICITUD,
      persona: this.layoutDatosPersNat.getFormValues()
    }
    formValues.otrosRequisitos = this.layoutOtrosRequisitos.getValues();
    return formValues;
  }

  borrador() {
    if (!this.layoutDatosPersNat.validarDatosPN() && this.editable == true) {
      this.snackbar.open('Debe llenar todos los campos en la sección DATOS DE LA PERSONA NATURAL', 'Cerrar', {
        duration: 7000,
      })
      return;
    }
    if (!this.layoutOtrosRequisitos.validarOtrosDocumentos()) {
      return;
    }

    let solicitudUuid = this.activeRoute.snapshot.paramMap.get('solicitudUuid');

    this.solicitudService.obtenerSolicitud(solicitudUuid).subscribe(resp => {
      
      this.SOLICITUD =  resp;

      let formValues = this.obtenerDatos();
        
      if (formValues.division == null || formValues.profesion == null) {
        this.completeFields = false;
      }
      else {
        this.completeFields = true;
      }

      if (!this.completeFields) {
        this.snackbar.open('Debe llenar todos los campos en la sección PERFILES PARA INSCRIPCIÓN: Formación profesional, ' +
          'División, Perfil.  Guardar los valores seleccionados', 'Cerrar', {
          duration: 7000,
        })
      }
      else {
        functionsAlert.questionSiNo('¿Seguro que desea guardar solicitud preliminar?').then((result) => {
          if (result.isConfirmed) {
            let formValues = this.obtenerDatos();
    
            this.solicitudService.actualizarBorradorPN(formValues).subscribe(obj => {
              functionsAlert.success('Datos Actualizados').then((result) => {
                //this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST, 'editar', obj.solicitudUuid]);
                this.layoutOtrosRequisitos?.buscarOtrosDocumentos();
              });
            });
          }
        });
      }
    })
  }

  cancelar() {
    this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST]);
  }

  enviar() {
    //VALIDACIÓN

    if(!this.layoutOtrosRequisitos.esValido()){
      this.snackbar.open('Se deben aceptar los términos y condiciones', 'Cerrar', {
        duration: 7000,
      })
      return;
    }

    if (!this.layoutDatosPersNat.validarDatosPN()) {
      this.snackbar.open('Debe llenar todos los campos en la sección DATOS DE LA PERSONA NATURAL', 'Cerrar', {
        duration: 7000,
      })
      return;
    }

    if (!this.layoutOtrosRequisitos.validarOtrosDocumentos()) {
      return;
    }

    this.validarProfesionDivision();
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
          let nroExpDes = `Su solicitud de subsanación  en el Registro de Precalificación de Empresas Supervisoras ha sido recibido mediante expediente <b>Nro. ${obj.numeroExpediente}</b>. 
          Cualquier notificación sobre su solicitud se realizará a través del Sistema de Notificaciones Electrónicas del OSINERGMIN - SNE.`
          functionsAlert.successDescargar(nroExpDes).then((result) => {
            this.SOLICITUD = obj;
            this.descargarArchivoSubsanacion(obj)
          });
        });

      }
    });

  }

  descargarFormato() {
    let formato04 = this.SOLICITUD.archivos[0];
    if (formato04) {
      let nombreAdjunto = formato04.nombre != null ? formato04.nombre : formato04.nombreReal
      this.adjuntoService.descargarWindowsJWT(formato04.codigo, nombreAdjunto);
    }
  }

  validarProfesionDivision() {
    
    let solicitudUuid = this.activeRoute.snapshot.paramMap.get('solicitudUuid');

    this.solicitudService.obtenerSolicitud(solicitudUuid).subscribe(resp => {
      
      this.SOLICITUD =  resp;

      let formValues = this.obtenerDatos();
      
      if (formValues.division == null || formValues.profesion == null) {
        this.completeFields = false;
      }
      else {
        this.completeFields = true;
      }

      if (!this.completeFields) {
        this.snackbar.open('Debe llenar todos los campos en la sección PERFILES PARA INSCRIPCIÓN: Formación profesional, ' +
          'División, Perfil.  Guardar los valores seleccionados', 'Cerrar', {
          duration: 7000,
        })
      }
      else {
        this.messageSend();
      }
    })
  }

  messageSend(){
    functionsAlert.questionSiNo('¿Seguro que desea enviar la solicitud?').then((result) => {
      if (result.isConfirmed) {
        let formValues = this.obtenerDatos();

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



}
