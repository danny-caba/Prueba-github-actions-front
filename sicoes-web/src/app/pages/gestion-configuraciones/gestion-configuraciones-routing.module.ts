import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { AuthGuardService } from 'src/app/auth/guards';
import { RoleGuardService } from 'src/app/auth/guards/role-guard.service';
import { BandejaConfiguracionesComponent } from './bandeja-configuraciones/bandeja-configuraciones.component';


const routes: VexRoutes = [{ 
  path: '',
  children:[
   {
      path:'',
      canActivate: [AuthGuardService, RoleGuardService],
      component: BandejaConfiguracionesComponent
    }]
  }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionConfiguracionesRoutingModule { }
