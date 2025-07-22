import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { AuthGuardService } from 'src/app/auth/guards';
import { Link } from 'src/helpers/internal-urls.components';
import { RoleGuardService } from 'src/app/auth/guards/role-guard.service';
import { RequerimientoDocumentoAddComponent } from './requerimiento-documento-add/requerimiento-documento-add.component';

const routes: VexRoutes = [{ 
  path: '',
  children:[
    {
      path: Link.REQUERIMIENTOS_DOCUMENTO + '/' + Link.DOCUMENTO_ADD + '/:documentoUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: RequerimientoDocumentoAddComponent,
      data: {
        add: true
      }
    },
    {
      path: Link.REQUERIMIENTOS_DOCUMENTO + '/' + Link.DOCUMENTO_SUBSANAR + '/:documentoUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: RequerimientoDocumentoAddComponent,
      data: {
        subsanar: true
      }
    },
    {
      path: Link.REQUERIMIENTOS_DOCUMENTO + '/' + Link.DOCUMENTO_VIEW + '/:documentoUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: RequerimientoDocumentoAddComponent,
      data: {
        view: true
      }
    }
    // },
    // {
    //   path: Link.REQUERIMIENTOS_INVITACION + '/' + Link.INVITACION_SEND + '/:requerimientoUuid',
    //   canActivate: [AuthGuardService, RoleGuardService],
    //   component: RequerimientoInvitacionListComponent,
    //   data: {
    //     send: true
    //   }
    // },
    // {
    //   path: Link.APROBACION_LIST_HISTORIAL,
    //   canActivate: [AuthGuardService, RoleGuardService],
    //   component: RequerimientoAprobacionHistorialComponent,
    // },
  ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequerimientoRoutingModule { }
