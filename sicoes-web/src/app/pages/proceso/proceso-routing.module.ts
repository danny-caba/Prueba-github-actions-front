import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { AuthGuardService } from 'src/app/auth/guards';
import { Link } from 'src/helpers/internal-urls.components';
import { ProcesoItemPresentarComponent } from './proceso-item-presentar/proceso-item-presentar.component';
import { ProcesoListComponent } from './proceso-list/proceso-list.component';
import { PropuestaWizardComponent } from './propuesta-wizard/propuesta-wizard.component';
import { DatosProcesoFormComponent } from './proceso-item-presentar/datos-proceso-form/datos-proceso-form.component';
import { PropuestaTecnicaFormComponent } from './proceso-item-presentar/propuesta-tecnica-form/propuesta-tecnica-form.component';
import { InvitarProfesionalFormComponent } from './proceso-item-presentar/invitar-profesional-form/invitar-profesional-form.component';
import { PropuestaEconomicaFormComponent } from './proceso-item-presentar/propuesta-economica-form/propuesta-economica-form.component';
import { ResumenPropuestaComponent } from './proceso-item-presentar/resumen-proceso/resumen-proceso.component';
import { PropuestaResumenComponent } from './propuesta-resumen/propuesta-resumen.component';
import { RoleGuardService } from 'src/app/auth/guards/role-guard.service';


const routes: VexRoutes = [{ 
  path: '',
  children:[
    {
      path: '',
      canActivate: [AuthGuardService, RoleGuardService],
      component: ProcesoListComponent
    },{
      path: Link.INVITACIONES_LIST,
      canActivate: [AuthGuardService, RoleGuardService],
      component: ProcesoListComponent
    },{
      path: Link.PROCESOS_ITEM_PRESENTAR + '/:procesoItemUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: ProcesoItemPresentarComponent,
      data: {
        toolbarShadowEnabled: true,
        scrollDisabled: true,
        editable: true
      },
      children: [{
          path: 'datos',
          component: DatosProcesoFormComponent
        }
      ]
    },{
      path: Link.PROCESOS_PROPUESTA_RESUMEN + '/:propuestaUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: PropuestaResumenComponent,
      data: {
        bPresentarPropuesta: false
      }
    },{
      path: Link.PROCESOS_PROPUESTA + '/:propuestaUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: PropuestaWizardComponent,
      data: {
        toolbarShadowEnabled: true,
        scrollDisabled: true,
        editable: true
      },
      children: [{
        path: 'datos',
        component: DatosProcesoFormComponent
      },{
        path: 'propuesta-tecnica',
        component: PropuestaTecnicaFormComponent
      },{
        path: 'invitar-profesionales',
        component: InvitarProfesionalFormComponent
      },{
        path: 'propuesta-economica',
        component: PropuestaEconomicaFormComponent
      },{
        path: 'propuesta-resumen',
        component: ResumenPropuestaComponent,
        data: {
          bPresentarPropuesta: true
        }
      }]
    }]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcesoIntranetRoutingModule { }
