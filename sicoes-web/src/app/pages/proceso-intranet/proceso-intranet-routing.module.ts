import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { AuthGuardService } from 'src/app/auth/guards';
import { ProcesoIntranetListIntranetComponent } from './proceso-list-intranet/proceso-list-intranet.component';
import { Link } from 'src/helpers/internal-urls.components';
import { ProcesoAddComponent } from './proceso-add/proceso-add.component';
import { ProcesoEditComponent } from './proceso-edit/proceso-edit.component';
import { LayoutDatosGeneralComponent } from 'src/app/shared/layout-datos-proceso/layout-datos-general/layout-datos-general.component';
import { LayoutFechaEtapaComponent } from 'src/app/shared/layout-datos-proceso/layout-fecha-etapa/layout-fecha-etapa.component';
import { LayoutMiemboComponent } from 'src/app/shared/layout-datos-proceso/layout-miembro/layout-miembro.component';
import { LayoutItemsComponent } from 'src/app/shared/layout-datos-proceso/layout-items/layout-items.component';
import { LayoutPublicarComponent } from 'src/app/shared/layout-datos-proceso/layout-publicar/layout-publicar.component';
import { ProcesoVerPostulanteComponent } from './proceso-ver-postulante/proceso-ver-postulante.component';
import { PropuestaResumenComponent } from '../proceso/propuesta-resumen/propuesta-resumen.component';
import { RoleGuardService } from 'src/app/auth/guards/role-guard.service';
import { ProcesoBitacoraComponent } from './proceso-bitacora/proceso-bitacora.component';
import { LayoutInfoProcesoComponent } from 'src/app/shared/layout-datos-proceso/layout-info-proceso/layout-info-proceso.component';
import { ProcesoIntranetGestionPacesComponent } from './proceso-list-gestionPaces/proceso-list-gestionPaces.component';
import { ProcesoIntranetAprobacionPacesComponent } from './proceso-list-aprobacionPaces/proceso-list-aprobacionPaces.component';
import { ProcesoIntranetAprobacionPacesGerenciaComponent } from './proceso-list-aprobacionPacesGerencia/proceso-list-aprobacionPacesGerencia.component';

const routes: VexRoutes = [{
  path: '',
  children:[
    {
      path: '',
      canActivate: [AuthGuardService, RoleGuardService],
      component: ProcesoIntranetListIntranetComponent
    },{
      path: Link.PROCESOS_ADD,
      canActivate: [AuthGuardService, RoleGuardService],
      component: ProcesoAddComponent,
      data: {
        toolbarShadowEnabled: true,
        scrollDisabled: true
      },
      children: [{
          path: 'datos',
          component: LayoutDatosGeneralComponent,
          data: {
            bAdd: true
          }
        }
      ]
    },{
      path: Link.PROCESOS_VIEW + '/:procesoUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: ProcesoEditComponent,
      data: {
        toolbarShadowEnabled: true,
        scrollDisabled: true
      },
      children: [{
          path: 'datos',
          component: LayoutDatosGeneralComponent,
          data: {
            bAdd: false,
            bEdit: false,
            bView: true,
          }
        },
        {
          path: 'fecha',
          component: LayoutFechaEtapaComponent,
          data: {
            bAdd: false,
            bEdit: false,
            bView: true,
          }
        },
        {
          path: 'miembros',
          component: LayoutMiemboComponent,
          data: {
            bAdd: false,
            bEdit: false,
            bView: true,
          }
        },
        {
          path: 'items',
          component: LayoutItemsComponent,
          data: {
            bAdd: false,
            bEdit: false,
            bView: true,
          }
        },
        {
          path: 'informacion',
          component: LayoutInfoProcesoComponent,
          data: {
            bAdd: false,
            bEdit: false,
            bView: true,
          }
        },
      ]
    },{
      path: Link.PROCESOS_EDIT + '/:procesoUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: ProcesoEditComponent,
      data: {
        toolbarShadowEnabled: true,
        scrollDisabled: true,
        editable: true
      },
      children: [{
          path: 'datos',
          component: LayoutDatosGeneralComponent,
          data: {
            bAdd: false,
            bEdit: true,
            bView: false,
          }
        },
        {
          path: 'fecha',
          component: LayoutFechaEtapaComponent,
          data: {
            bAdd: false,
            bEdit: true,
            bView: false,
          }
        },
        {
          path: 'miembros',
          component: LayoutMiemboComponent,
          data: {
            bAdd: false,
            bEdit: true,
            bView: false,
          }
        },
        {
          path: 'items',
          component: LayoutItemsComponent,
          data: {
            bAdd: false,
            bEdit: true,
            bView: false,
          }
        },
        {
          path: 'informacion',
          component: LayoutInfoProcesoComponent,
          data: {
            bAdd: false,
            bEdit: true,
            bView: false,
          }
        },
        {
          path: 'publicar',
          component: LayoutPublicarComponent,
          data: {
            bAdd: false,
            bEdit: true,
            bView: false,
          }
        }
      ]
    },{
      path: Link.PROCESO_VIEW_POSTULANTE + '/:procesoUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: ProcesoVerPostulanteComponent
    },{
      path: Link.PROCESOS_PROPUESTA_RESUMEN + '/:propuestaUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: PropuestaResumenComponent,
      data: {
        bPresentarPropuesta: false
      }
    },{
      path: Link.PROCESO_BITACORA + '/:procesoUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: ProcesoBitacoraComponent
    }
    ,{
      path: 'gestionPaces',
      canActivate: [AuthGuardService, RoleGuardService],
      component: ProcesoIntranetGestionPacesComponent
    }
    ,{
      path: 'aprobacionPaces',
      canActivate: [AuthGuardService, RoleGuardService],
      component: ProcesoIntranetAprobacionPacesComponent
    }
    ,{
      path: 'aprobacionPacesGerencia',
      canActivate: [AuthGuardService, RoleGuardService],
      component: ProcesoIntranetAprobacionPacesGerenciaComponent
    }
    
  ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcesoIntranetRoutingModule { }
