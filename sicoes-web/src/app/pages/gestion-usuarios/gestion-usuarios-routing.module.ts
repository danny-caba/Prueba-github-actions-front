import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { AuthGuardService } from 'src/app/auth/guards';
import { Link } from 'src/helpers/internal-urls.components';
import { UsuarioAddComponent } from './usuario-add/usuario-add.component';
import { RoleGuardService } from 'src/app/auth/guards/role-guard.service';
import { UsuarioListComponent } from './usuario-list/usuario-list.component';
import { LayoutConfPerfilComponent } from 'src/app/shared/layout-usuario/layout-configurar-perfil/layout-conf-perfil.component';


const routes: VexRoutes = [{ 
  path: '',
  children:[
   {
      path:'',
      canActivate: [AuthGuardService, RoleGuardService],
      component: UsuarioListComponent
    },{
      path: Link.GESTION_USUARIO_ADD,
      canActivate: [AuthGuardService, RoleGuardService],
      component: UsuarioAddComponent
    },{
      path: Link.GESTION_USUARIO_CONF_PERFIL,
      canActivate: [AuthGuardService, RoleGuardService],
      component: LayoutConfPerfilComponent
    }]
  }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionUsuariosRoutingModule { }
