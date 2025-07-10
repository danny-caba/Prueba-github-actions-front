import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { AuthGuardService } from 'src/app/auth/guards';
import { SolicitudGuardService } from 'src/app/auth/store/solicitud-guard.service';
import { SolicitudSancionVigenteService } from 'src/app/auth/store/solicitud-sancion-vigente';
import { SolicitudSancionVigenteServicePN } from 'src/app/auth/store/solicitud-sancion-vigente-PN';
import { SolicitudSancionVigenteServicePNfecVig } from 'src/app/auth/store/solicitud-sancion-vigente-PN-fec-vig';
import { Opcion } from 'src/helpers/constantes.options.';
import { Link } from 'src/helpers/internal-urls.components';
import { RoleGuardService } from 'src/app/auth/guards/role-guard.service';
import { RequerimientoListComponent } from './requerimiento-list/requerimiento-list.component';
import { RequerimientoInformeAddComponent } from './requerimiento-informe-add/requerimiento-informe-add.component';
import { RequerimientoInvitacionListComponent } from './requerimiento-invitacion-list/requerimiento-invitacion-list.component';

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
    }
  ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequerimientoRoutingModule { }
