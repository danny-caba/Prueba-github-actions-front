import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Link } from 'src/helpers/internal-urls.components';
import { LayoutGradoAcademicoComponent } from 'src/app/shared/layout-grado-academico/layout-grado-academico.component';
import { LayoutDatosPersNatComponent } from 'src/app/shared/layout-datos/layout-datos-pers-nat/layout-datos-pers-nat.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { EstadoEvaluacionAdministrativa, EstadoEvaluacionTecnica, EvaluadorRol, TipoPersonaEnum } from 'src/helpers/constantes.components';
import { EvaluadorService } from 'src/app/service/evaluador.service';
import { Observable } from 'rxjs';
import { ModalAprobadorAccionComponent } from 'src/app/shared/modal-aprobador-accion/modal-aprobador-accion.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { LayoutAprobacionHistorialComponent } from 'src/app/shared/layout-aprobacion-historial/layout-aprobacion-historial.component';
import { AuthUser } from 'src/app/auth/store/auth.models';
import { LayoutObservacionResultadoComponent } from 'src/app/shared/layout-observacion-resultado/layout-observacion-resultado.component';

@Component({
  selector: 'vex-solicitud-pn-procesar',
  templateUrl: './solicitud-pn-procesar.component.html',
  styleUrls: ['./solicitud-pn-procesar.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class SolicitudPnProcesarComponent extends BaseComponent implements OnInit, OnDestroy {

  tipoPersonaEnum = TipoPersonaEnum
  usuario$ = this.authFacade.user$;
  usuario: AuthUser
  EstadoEvaluacionAdministrativa = EstadoEvaluacionAdministrativa
  EstadoEvaluacionTecnica = EstadoEvaluacionTecnica

  @ViewChild('layoutDatosPersNat', { static: true }) layoutDatosPersNat: LayoutDatosPersNatComponent;
  @ViewChild('layoutGradoAcademico', { static: true }) layoutGradoAcademico: LayoutGradoAcademicoComponent;
  //@ViewChild('layoutObservacionResultado', { static: true }) layoutObservacionResultado: LayoutObservacionResultadoComponent;

  SOLICITUD: any;
  itemSeccion2: number = 0;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private location: Location,
    private solicitudService: SolicitudService,
    private authFacade: AuthFacade,
    private evaluadorService: EvaluadorService
  ) {
    super();
  }

  ngOnInit(): void {
    let solicitudUuid = this.activeRoute.snapshot.paramMap.get('solicitudUuid');
    if(solicitudUuid){

      this.solicitudService.obtenerSolicitud(solicitudUuid).subscribe( resp => {
        this.SOLICITUD = resp;
        this.solicitudService.setSolicitud(resp);

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

      })
    }

    this.usuario$.subscribe(usu => {
      this.usuario = usu;
    })
  }

  validarUsuario(usu){
    return this.usuario?.idUsuario == usu.usuario?.idUsuario;
  }

  aprobadoresBoolean: boolean = false

  aprobadores: Observable<any> = this.getAprobador();

  getAprobador(): Observable<any> {
    let filtro = {
      codigoTipoAprobador: EvaluadorRol.APROBADOR_TECNICO_COD,
      solicitudUuid: this.activeRoute.snapshot.paramMap.get('solicitudUuid')
    };

    return this.evaluadorService.listarAsignacionesAprobadores(filtro);
  }

  cancelar(){
    this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST]);
  }

  ngOnDestroy(): void {
    this.solicitudService.clearSolicitud();
  }

  finalizarRevAdmin(){

    /*if(this.layoutObservacionResultado.validarCambiosAdm()){
      functionsAlert.error('Debe guardar los cambios en la sección 6. OBSERVACIONES ADICIONALES');
      return;
    }*/

    functionsAlert.questionSiNo('¿Seguro que desea finalizar Revisión Administrativa?').then((result) => {
      if (result.isConfirmed) {
        this.solicitudService.finalizarAdminitrativa(this.SOLICITUD).subscribe( resp => {
          functionsAlert.success('Revisión Administrativa Finalizada').then((result) => {
            this.SOLICITUD.estadoEvaluacionAdministrativa.codigo = EstadoEvaluacionAdministrativa.EN_APROBACION;
            this.solicitudService.setSolicitud(this.SOLICITUD)
          });
        })
      }
    });
  }

  finalizarRevTecni(){
    /*if(this.layoutObservacionResultado.validarCambiosTec()){
      functionsAlert.error('Debe guardar los cambios en la sección 6. OBSERVACIONES ADICIONALES');
      return;
    }*/

    functionsAlert.questionSiNo('¿Seguro que desea finalizar Revisión Técnica?').then((result) => {
      if (result.isConfirmed) {
        this.solicitudService.finalizarTecnica(this.SOLICITUD).subscribe( resp => {
          functionsAlert.success('Revisión Técnica Finalizada').then((result) => {
            this.SOLICITUD.estadoEvaluacionTecnica.codigo = EstadoEvaluacionAdministrativa.EN_APROBACION;
            this.solicitudService.setSolicitud(this.SOLICITUD)
          });
        })
      }
    });
  }

  flag:boolean = true;

  actualizarVer(obj, action) {
    this.dialog.open(ModalAprobadorAccionComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        solicitud: this.SOLICITUD,
        accion: action,
        asignacion: obj,
      },
    }).afterClosed().subscribe(result => {
      if(result == 'OK'){
        this.flag = false;
        //this.tabAprobacionHistorial?.cargarTabla();
        this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_LIST_APROBACION]);
      }else{
        this.flag = true;
        this.tabAprobacionHistorial?.cargarTabla();
      }
    });
  }

  @ViewChild('tabAprobacionHistorial') tabAprobacionHistorial: LayoutAprobacionHistorialComponent;


}
