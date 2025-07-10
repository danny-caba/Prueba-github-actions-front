import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { AuthGuardService } from 'src/app/auth/guards';
import { Opcion } from 'src/helpers/constantes.options.';
import { Link } from 'src/helpers/internal-urls.components';
import { SolicitudListAprobacionComponent } from './solicitud-list-aprobacion/solicitud-list-aprobacion.component';
import { SolicitudListAtencionComponent } from './solicitud-list-atencion/solicitud-list-atencion.component';
import { SolicitudIntranetListIntranetComponent } from './solicitud-list-intranet/solicitud-list-intranet.component';
import { SolicitudListPendientesComponent } from './solicitud-list-pendientes/solicitud-list-pendientes.component';
import { SolicitudPnProcesarComponent } from './solicitud-pn-procesar/solicitud-pn-procesar.component';
import { RoleGuardService } from 'src/app/auth/guards/role-guard.service';
import { HistoriaAprobacionesComponent } from './solicitud-list-aprobacion/historial-aprobaciones/historial-aprobaciones.component';


const routes: VexRoutes = [{
  path: '',
  children:[
    {
      path: '',
      canActivate: [AuthGuardService, RoleGuardService],
      component: SolicitudIntranetListIntranetComponent
    },{
      path: Link.SOLICITUDES_LIST_PEND,
      canActivate: [AuthGuardService, RoleGuardService],
      component: SolicitudListPendientesComponent
    },{
      path: Link.SOLICITUDES_VIEW + '/:solicitudUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: SolicitudPnProcesarComponent,
      data: {
        opcionPagina: [
          Opcion.VIEW_EVALUACION
        ]
      }
    },{
      path: Link.SOLICITUDES_PROCESAR + '/:solicitudUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: SolicitudPnProcesarComponent,
      data: {
        opcionPagina: [
          Opcion.CMP_EDIT_EVAL_TEC,
          Opcion.CMP_EDIT_EVAL_ADM,
          Opcion.CMP_VIEW_OBS_ADM,
          Opcion.CMP_VIEW_OBS_TEC,
          Opcion.VIEW_EVALUACION
        ]
      }
    },{
      path: Link.SOLICITUDES_EVALUAR + '/:solicitudUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: SolicitudPnProcesarComponent,
      data: {
        opcionPagina: [
          Opcion.CMP_VIEW_EVAL_TEC,
          Opcion.CMP_VIEW_EVAL_ADM,

          Opcion.CMP_EDIT_OBS_ADM,
          Opcion.CMP_EDIT_OBS_TEC,
          Opcion.CMP_VIEW_OBS_ADM,
          Opcion.CMP_VIEW_OBS_TEC,

          //Opcion.MEN_GRA_ACA_EVALUAR,
          //Opcion.MEN_CAPAC_EVALUAR,
          //Opcion.MEN_DOC_EXP_EVALUAR,

          Opcion.CPM_OTROS_DOC_EVALUAR,

          Opcion.RESUL_EVAL_ADMIN,
          Opcion.RESUL_EVAL_TECNI,

          Opcion.BTN_FIN_REV_ADM,
          Opcion.BTN_FIN_REV_TEC,
          Opcion.VIEW_EVALUACION,

          Opcion.BTN_EVIDENCIA_ADD,
          Opcion.BTN_APROBADOR_ADD
        ]
      }
    },{
      path: Link.SOLICITUDES_APROBAR + '/:solicitudUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: SolicitudPnProcesarComponent,
      data: {
        opcionPagina: [
          Opcion.CMP_VIEW_EVAL_TEC,
          Opcion.CMP_VIEW_EVAL_ADM,

          Opcion.CMP_VIEW_OBS_ADM,
          Opcion.CMP_VIEW_OBS_TEC,

          Opcion.MEN_GRA_ACA_EVALUAR,
          Opcion.MEN_CAPAC_EVALUAR,
          Opcion.MEN_DOC_EXP_EVALUAR,

          Opcion.CPM_OTROS_DOC_EVALUAR,

          Opcion.RESUL_EVAL_ADMIN,
          Opcion.RESUL_EVAL_TECNI,

          Opcion.VIEW_EVALUACION,

          Opcion.BTN_APROBADOR_ACC
        ]
      }
    },{
      path: Link.SOLICITUDES_LIST_ATENCION,
      canActivate: [AuthGuardService, RoleGuardService],
      component: SolicitudListAtencionComponent
    },{
      path: Link.SOLICITUDES_LIST_APROBACION,
      canActivate: [AuthGuardService, RoleGuardService],
      component: SolicitudListAprobacionComponent
    }
  ,{
      path: Link.SOLICITUDES_LIST_APROBACION+"/historial",
      canActivate: [AuthGuardService, RoleGuardService],
      component: HistoriaAprobacionesComponent
    }]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudIntranetRoutingModule { }
