import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { AuthGuardService } from 'src/app/auth/guards';
import { Link } from 'src/helpers/internal-urls.components';
import { RoleGuardService } from 'src/app/auth/guards/role-guard.service';
import { BandejaAsignacionComponent } from './bandeja-asignacion/bandeja-asignacion.component';
import { LayoutConfPerfilComponent } from 'src/app/shared/layout-usuario/layout-configurar-perfil/layout-conf-perfil.component';


const routes: VexRoutes = [{ 
  path: '',
  children:[
   {
      path:'',
      canActivate: [AuthGuardService],
      component: BandejaAsignacionComponent
    }]
  }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionAsignacionRoutingModule { }
