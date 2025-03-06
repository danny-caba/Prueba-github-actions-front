import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { CustomLayoutComponent } from 'src/app/custom-layout/custom-layout.component';
import { Link } from 'src/helpers/internal-urls.components';
import { LoginIntranetComponent } from './login-intranet/login-intranet.component';
import { IntranetComponent } from './intranet.component';
import { BandejaContratosIntranetModule } from '../bandeja-contratos/bandeja-contratos-intranet.module';

const routes: VexRoutes = [{
  path: '',
  component: CustomLayoutComponent
},{
  path: Link.LOGIN_INTRANET,
  component: LoginIntranetComponent
},{
  path: Link.SOLICITUDES_LIST,
  component: CustomLayoutComponent,
  loadChildren: () => import('../../pages/solicitud-intranet/solicitud-intranet.module').then(m => m.SolicitudIntranetModule),
},{
  path: Link.EMPRESA_SUPER_LIST,
  component: CustomLayoutComponent,
  loadChildren: () => import('../../pages/empresa-supervisora/empresa-supervisora.module').then(m => m.EmpresaSupervisoraModule),
},{
  path: Link.PROCESOS_LIST,
  component: CustomLayoutComponent,
  loadChildren: () => import('../../pages/proceso-intranet/proceso-intranet.module').then(m => m.ProcesoIntranetModule),
},{
  path: Link.LIBERAR_PERSONAL_LIST,
  component: CustomLayoutComponent,
  loadChildren: () => import('../../pages/liberar-personal/liberar-personal.module').then(m => m.LiberarPersonalModule),
}, {
  path: Link.GESTION_CONFIGURACION,
  component: CustomLayoutComponent,
  loadChildren: () => import('../../pages/gestion-configuraciones/gestion-configuraciones.module').then(m => m.GestionConfiguracionesModule),
}, {
  path: Link.CONTRATOS_LIST,
  component: CustomLayoutComponent,
  loadChildren: () => import('../../pages/contrato-intranet/contrato-intranet.module').then(m => m.ContratoIntranetModule),
}, {
  path: Link.BANDEJA_CONTRATOS_LIST,
  component: CustomLayoutComponent,
  loadChildren: () => import('../../pages/bandeja-contratos/bandeja-contratos-intranet.module').then(m => m.BandejaContratosIntranetModule),
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntranetRoutingModule { }
