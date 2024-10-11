import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { Link } from '../helpers/internal-urls.components';
import { CustomLayoutPublicComponent } from './custom-layout-public/custom-layout-public.component';
import { LoginExtranjeroComponent } from './pages/public/login-extranjero/login-extranjero.component';

const routes: VexRoutes = [
  {
    path: '',
    redirectTo: Link.PRINCIPAL,
    pathMatch: 'full'
  },{
    path: Link.PRINCIPAL,
    loadChildren: () => import('./pages/extranet/extranet.module').then(m => m.ExtranetModule),
  },{
    path: Link.EXTRANET,
    loadChildren: () => import('./pages/extranet/extranet.module').then(m => m.ExtranetModule),
  },{
    path: Link.INTRANET,
    loadChildren: () => import('./pages/intranet/intranet.module').then(m => m.IntranetModule),
  },{
    path: Link.PUBLIC,
    component: CustomLayoutPublicComponent,
    loadChildren: () => import('./pages/public/public.module').then(m => m.PublicModule),
  },{
    path: Link.LOGIN_EXTRANJERO,
    component: LoginExtranjeroComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    anchorScrolling: 'enabled',
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
