import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { AuthGuardService } from 'src/app/auth/guards';
import { RoleGuardService } from 'src/app/auth/guards/role-guard.service';
import { Link } from 'src/helpers/internal-urls.components';
import { BandejaContratosListComponent } from './components/bandeja-contratos-list/bandeja-contratos-list.component';
import { BandejaContratosProcesarComponent } from './components/bandeja-contratos-procesar/bandeja-contratos-procesar.component';

const routes: VexRoutes = [{ 
  path: '',
  children:[
    {
      path: '',
      canActivate: [AuthGuardService, RoleGuardService],
      component: BandejaContratosListComponent,
    },
      {
        path: 'procesar/:id',
        canActivate: [AuthGuardService, RoleGuardService],
        component: BandejaContratosProcesarComponent,
      },
  ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BandejaContratosIntranetRoutingModule { }