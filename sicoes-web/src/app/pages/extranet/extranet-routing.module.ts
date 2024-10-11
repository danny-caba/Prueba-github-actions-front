import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { CustomLayoutComponent } from 'src/app/custom-layout/custom-layout.component';
import { Link } from 'src/helpers/internal-urls.components';
import { LoginSunatComponent } from './login-sunat/login-sunat.component';
import { ExtranetComponent } from './extranet.component';
import { AuthGuardService } from 'src/app/auth/guards';
import { RoleGuardService } from 'src/app/auth/guards/role-guard.service';

const routes: VexRoutes = [{
  path: '',
  component: ExtranetComponent
},{
  path: Link.LOGIN_SUNAT,
  component: LoginSunatComponent
},{
  path: Link.SOLICITUDES_LIST,
  canActivate: [AuthGuardService, RoleGuardService],
  component: CustomLayoutComponent,
  loadChildren: () => import('../../pages/solicitud/solicitud.module').then(m => m.SolicitudModule),
},{
  path: Link.PROCESOS_LIST,
  //canActivate: [AuthGuardService],
  component: CustomLayoutComponent,
  loadChildren: () => import('../../pages/proceso/proceso.module').then(m => m.ProcesoModule),
},{
  path: Link.INVITACIONES_LIST,
  //canActivate: [AuthGuardService],
  component: CustomLayoutComponent,
  loadChildren: () => import('../../pages/invitacion/invitacion.module').then(m => m.InvitacionModule),
},{
  path: Link.GESTION_USUARIO,
  //canActivate: [AuthGuardService],
  component: CustomLayoutComponent,
  loadChildren: () => import('../../pages/gestion-usuarios/gestion-usuarios.module').then(m => m.GestionUsuariosModule),
},{
  path: Link.GESTION_ASIGNACION,
  //canActivate: [AuthGuardService],
  component: CustomLayoutComponent,
  loadChildren: () => import('../../pages/gestion-asignacion/gestion-asignacion.module').then(m => m.GestionAsignacionModule),
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtranetRoutingModule { }
