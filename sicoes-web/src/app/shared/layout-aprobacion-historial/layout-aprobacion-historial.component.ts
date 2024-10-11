import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { EvaluadorService } from 'src/app/service/evaluador.service';
import { BasePageComponent } from '../components/base-page.component';
import { EvaluadorRol } from 'src/helpers/constantes.components';
import { ModalAprobadorAccionComponent } from '../modal-aprobador-accion/modal-aprobador-accion.component';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { functions } from 'src/helpers/functions';
import { Router } from '@angular/router';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-layout-aprobacion-historial',
  templateUrl: './layout-aprobacion-historial.component.html',
  styleUrls: ['./layout-aprobacion-historial.component.scss'],
  animations: [
    stagger80ms
  ]
})
export class LayoutAprobacionHistorialComponent extends BasePageComponent<any> implements OnInit, OnDestroy {
  
  suscriptionSolicitud: Subscription;
  solicitud: Partial<Solicitud>
  usuario$ = this.authFacade.user$;

  cmpTipoRevisionEdit: boolean = false;
  ultimaVersion = true;

  displayedColumns: string[] = [
    'tipo',
    'grupo',
    'fecha',
    'aprobador',
    'fechaAprobacion',
    'resultado',
    'observacion',
    'acciones'
  ];
  
  serviceTable(filtro: any) {
    return this.evaluadorService.listarAsignacionesAprobadores(filtro);
  }

  obtenerFiltro() {
    return { 
      codigoTipoAprobador: EvaluadorRol.APROBADOR_TECNICO_COD,
      solicitudUuid: this.solicitudUuid
    };
  }

  constructor(
    private dialog: MatDialog,
    private solicitudService: SolicitudService,
    private evaluadorService: EvaluadorService,
    private authFacade: AuthFacade,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.suscribirSolicitud();
  }

  ngOnDestroy() {
    this.suscriptionSolicitud.unsubscribe();
  }

  private suscribirSolicitud(){
    this.suscriptionSolicitud = this.solicitudService.suscribeSolicitud().subscribe(sol => {
      this.solicitud = sol;
      if(this.solicitud?.solicitudUuid){
        this.solicitudUuid = this.solicitud?.solicitudUuid;
        this.solicitudUuidPrincipal = this.solicitud.solicitudUuid;
        this.cargarTabla();
        if (this.cmpTipoRevisionEdit == false && functions.noEsVacio(this.solicitud.solicitudUuidPadre)) {
          //if(this.solicitud.estado.codigo != SolicitudEstadoEnum.OBSERVADO){
            this.cmpTipoRevisionEdit = true;
          //}
        }
      }
    });
  }

  actualizarVer(obj, action) {
    this.dialog.open(ModalAprobadorAccionComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        solicitud: this.solicitud,
        accion: action,
        asignacion: obj,
      },
    /*}).afterClosed().subscribe(() => {
      this.cargarTabla();
    });
    */
    }).afterClosed().subscribe(result => {
    if(result == 'OK'){
      this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_LIST_APROBACION]);
    }else{
      this.cargarTabla();
    }
  });
  }

  solicitudUuid;
  solicitudUuidPrincipal;

  changeVersion(version: any) {
    if (version.codigo == 'V1') {
      this.solicitudUuidPrincipal = this.solicitud.solicitudUuid;
      this.solicitudUuid = this.solicitud?.solicitudUuidPadre
      this.ultimaVersion = false;
      this.cargarTabla();
    } else {
      this.solicitudUuid = this.solicitudUuidPrincipal;
      this.ultimaVersion = true;
      this.cargarTabla();
    }
  }

}
