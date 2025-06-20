import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { SolicitudEstadoEnum, TipoPersonaEnum } from 'src/helpers/constantes.components';
import { Link } from 'src/helpers/internal-urls.components';
import { SolicitudPjEditComponent } from './solicitud-pj-edit/solicitud-pj-edit.component';
import { SolicitudPnEditComponent } from './solicitud-pn-edit/solicitud-pn-edit.component';
import { SolicitudPnPostorEditComponent } from './solicitud-pn-postor-edit/solicitud-pn-postor-edit.component';
import Swal from "sweetalert2";
import { SolicitudPjExtranjeroEditComponent } from './solicitud-pj-extranejo-edit/solicitud-pj-extranjero-edit.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Subscription } from 'rxjs';
import * as uuid from 'uuid';

@Component({
  selector: 'vex-solicitud-edit',
  templateUrl: './solicitud-edit.component.html',
  styleUrls: ['./solicitud-edit.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class SolicitudEditComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild('solicitudPnEditComponent', { static: false }) solicitudPnEditComponent: SolicitudPnEditComponent;
  @ViewChild('solicitudPnPostorEditComponent', { static: false }) solicitudPnPostorEditComponent: SolicitudPnPostorEditComponent;
  @ViewChild('solicitudPjEditComponent', { static: false }) solicitudPjEditComponent: SolicitudPjEditComponent;
  @ViewChild('solicitudPjExtranjeroEditComponent', { static: false }) solicitudPjExtranjeroEditComponent: SolicitudPjExtranjeroEditComponent;

  tipoPersonaEnum = TipoPersonaEnum;

  usuario$ = this.authFacade.user$;
  SOLICITUD: any;
  editable: boolean = false;
  editModified = false;
  actualizable = false;
  isSubsanar: boolean = false;
  isRegistro: boolean = false;
  isVer: boolean = false;
  mostrarResultado: boolean = false;
  @Input() viewEvaluacion: boolean;
  itemSeccion2: number = 0;
  subscriptionUsuario: Subscription = new Subscription();
  isUltimaSolicitud: boolean = false;
  solicitudUuidUltima: string;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private solicitudService: SolicitudService,
    private authFacade: AuthFacade
  ) {
    super();
  }

  ngOnInit(): void {

    this.activeRoute.data.subscribe(data => {
      if(data.editable){
        this.editable = data.editable;
      }
      if(data.editModified){
        this.editModified = data.editModified;
      }
      if(data.actualizable){
        this.actualizable = data.actualizable;
      }
      if(data.isSubsanar){
        this.isSubsanar = data.isSubsanar;
      }
      if(data.isRegistro){
        this.isRegistro = data.isRegistro;
      }
      if(data.isVer){
        this.isVer = data.isVer;
      }
    })

    let solicitudUuid = this.activeRoute.snapshot.paramMap.get('solicitudUuid');
    if (solicitudUuid ) {
      this.solicitudService.obtenerSolicitud(solicitudUuid).subscribe( solicitud => {
        this.solicitudService.obtenerUltimaSolicitud().subscribe( resp => {
          if (resp?.uuid && (this.editable || this.isRegistro)) {
            if (solicitud?.persona?.tipoPersona?.codigo != TipoPersonaEnum.JURIDICO) {
             /* functionsAlert.questionSiNo('¿Desea cargar los documentos cargados en la última postulación?').then((result) => {
                if (result.isConfirmed) {
                  this.solicitudService.copiarDocumentosUltimaSolicitud(resp.uuid, solicitudUuid, null).subscribe( r => {
                    this.isUltimaSolicitud = true;
                    this.solicitudUuidUltima = resp.uuid;
                    this.establecerData(solicitud)
                  });
                } else {*/
                  this.isUltimaSolicitud = false;
                  this.establecerData(solicitud)
              //  }
              //});
            } else {
              this.isUltimaSolicitud = false;
              this.establecerData(solicitud)  
            }
          } else {
            this.isUltimaSolicitud = false;
            this.establecerData(solicitud)
          }
        });
      });
    }
  }

  establecerData(solicitud) {
    if (this.isUltimaSolicitud) {
      solicitud.estado.codigo = SolicitudEstadoEnum.BORRADOR;
      solicitud.isUltimaSolicitud = true;
      solicitud.solicitudUuidUltima = this.solicitudUuidUltima;
    }
    this.SOLICITUD = solicitud;
    this.solicitudService.setSolicitud(solicitud);

    if(this.SOLICITUD.estado?.codigo == SolicitudEstadoEnum.CONCLUIDO || this.SOLICITUD.estado?.codigo == SolicitudEstadoEnum.OBSERVADO){
      this.mostrarResultado = true;
    }
    if(this.SOLICITUD.estado.codigo != SolicitudEstadoEnum.BORRADOR){
      this.editable = false;
    }
    if(this.SOLICITUD?.persona?.tipoPersona?.codigo == TipoPersonaEnum.JURIDICO){
      this.itemSeccion2 = 5;
    }
    if(this.SOLICITUD?.persona?.tipoPersona?.codigo == TipoPersonaEnum.PJ_EXTRANJERO){
      this.itemSeccion2 = 5;
    }
    if(this.SOLICITUD?.persona?.tipoPersona?.codigo == TipoPersonaEnum.PN_POSTOR){
      this.itemSeccion2 = 5;
    }
    if(this.SOLICITUD?.persona?.tipoPersona?.codigo == TipoPersonaEnum.PN_PERS_PROPUESTO){
      this.itemSeccion2 = 6;
    }

    if (this.isUltimaSolicitud) {
      this.mostrarResultado = false;
      this.editable = true;
    }
  }

  ngOnDestroy(): void {
    this.solicitudService.clearSolicitud();
  }

  cancelar(){
    let solicitudUuid = this.activeRoute.snapshot.paramMap.get('solicitudUuid');
    if (solicitudUuid) {
      functionsAlert.questionSiNo('¿Seguro que desea cancelar la solicitud?').then((result) => {
        if (result.isConfirmed) {
            this.solicitudService.cancelarSolicitud(solicitudUuid).subscribe(sol => {
            this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST]);
          });
        }
      })
    }
  }
  
  borrador(){
    if(this.SOLICITUD?.persona?.tipoPersona?.codigo == TipoPersonaEnum.JURIDICO){
      this.solicitudPjEditComponent.borrador();
    }
    if(this.SOLICITUD?.persona?.tipoPersona?.codigo == TipoPersonaEnum.PJ_EXTRANJERO){
      this.solicitudPjExtranjeroEditComponent.borrador();
    }
    if(this.SOLICITUD?.persona?.tipoPersona?.codigo == TipoPersonaEnum.PN_PERS_PROPUESTO){
      this.solicitudPnEditComponent.borrador();
    }
    if(this.SOLICITUD?.persona?.tipoPersona?.codigo == TipoPersonaEnum.PN_POSTOR){
      this.solicitudPnPostorEditComponent.borrador();
    }
  }

  actualizar(){
    if(this.SOLICITUD?.persona?.tipoPersona?.codigo == TipoPersonaEnum.JURIDICO){
      this.solicitudPjEditComponent.actualizar();
    }
    if(this.SOLICITUD?.persona?.tipoPersona?.codigo == TipoPersonaEnum.PJ_EXTRANJERO){
      this.solicitudPjExtranjeroEditComponent.actualizar();
    }
    if(this.SOLICITUD?.persona?.tipoPersona?.codigo == TipoPersonaEnum.PN_PERS_PROPUESTO){
      this.solicitudPnEditComponent.actualizar();
    }
    if(this.SOLICITUD?.persona?.tipoPersona?.codigo == TipoPersonaEnum.PN_POSTOR){
      this.solicitudPnPostorEditComponent.actualizar();
    }
  }

  enviar(){
    if(this.SOLICITUD?.persona?.tipoPersona?.codigo == TipoPersonaEnum.JURIDICO){
      this.solicitudPjEditComponent.enviar();
    }
    if(this.SOLICITUD?.persona?.tipoPersona?.codigo == TipoPersonaEnum.PJ_EXTRANJERO){
      this.solicitudPjExtranjeroEditComponent.enviar();
    }
    if(this.SOLICITUD?.persona?.tipoPersona?.codigo == TipoPersonaEnum.PN_PERS_PROPUESTO){
      this.solicitudPnEditComponent.enviar();
    }
    if(this.SOLICITUD?.persona?.tipoPersona?.codigo == TipoPersonaEnum.PN_POSTOR){
      this.solicitudPnPostorEditComponent.enviar();
    }
  }

  enviarSubsanacion(){
    if(this.SOLICITUD?.persona?.tipoPersona?.codigo == TipoPersonaEnum.JURIDICO){
      this.solicitudPjEditComponent.enviarSubsanacion();
    }
    if(this.SOLICITUD?.persona?.tipoPersona?.codigo == TipoPersonaEnum.PJ_EXTRANJERO){
      this.solicitudPjExtranjeroEditComponent.enviarSubsanacion();
    }
    if(this.SOLICITUD?.persona?.tipoPersona?.codigo == TipoPersonaEnum.PN_PERS_PROPUESTO){
      this.solicitudPnEditComponent.enviarSubsanacion();
    }
    if(this.SOLICITUD?.persona?.tipoPersona?.codigo == TipoPersonaEnum.PN_POSTOR){
      this.solicitudPnPostorEditComponent.enviarSubsanacion();
    }
  }

  regresar(){
    this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST]);
  }
}
