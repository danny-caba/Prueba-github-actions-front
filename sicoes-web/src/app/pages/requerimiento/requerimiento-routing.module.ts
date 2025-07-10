import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { AuthGuardService } from 'src/app/auth/guards';
import { Link } from 'src/helpers/internal-urls.components';
import { RoleGuardService } from 'src/app/auth/guards/role-guard.service';
import { RequerimientoInformeAddComponent } from './requerimiento-informe-add/requerimiento-informe-add.component';
import { RequerimientoInvitacionListComponent } from './requerimiento-invitacion-list/requerimiento-invitacion-list.component';
import { RequerimientoAprobacionHistorialComponent } from './requerimiento-aprobacion-historial/requerimiento-aprobacion-historial.component';

const routes: VexRoutes = [{ 
  path: '',
  children:[
    {
      path: Link.REQUERIMIENTOS_INFORME + '/' + Link.INFORME_ADD + '/:requerimientoUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: RequerimientoInformeAddComponent,
      data: {
        add: true
      }
    },
    {
      path: Link.REQUERIMIENTOS_INVITACION + '/' + Link.INVITACION_SEND + '/:requerimientoUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: RequerimientoInvitacionListComponent,
      data: {
        send: true
      }
    },
    {
      path: Link.APROBACION_LIST_HISTORIAL,
      canActivate: [AuthGuardService, RoleGuardService],
      component: RequerimientoAprobacionHistorialComponent,
    },
  ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequerimientoRoutingModule { }
