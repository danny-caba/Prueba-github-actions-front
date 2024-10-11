import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { AuthGuardService } from 'src/app/auth/guards';
import { InvitacionListComponent } from './invitacion-list/invitacion-list.component';
import { InvitacionFormComponent } from './invitacion-form/invitacion-form.component';
import { RoleGuardService } from 'src/app/auth/guards/role-guard.service';

const routes: VexRoutes = [{ 
  path: '',
  children:[
    {
      path: '',
      canActivate: [AuthGuardService, RoleGuardService],
      component: InvitacionListComponent
    },{
      path: ':idPropuestaProfesional/:propuestaUuid',
      canActivate: [AuthGuardService],
      component: InvitacionFormComponent
    }
  ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvitacionRoutingModule { }
