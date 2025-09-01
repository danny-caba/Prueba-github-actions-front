import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { AuthGuardService } from 'src/app/auth/guards';
import { RoleGuardService } from 'src/app/auth/guards/role-guard.service';
import { Link } from 'src/helpers/internal-urls.components';
import { RequerimientoRenovacionListComponent } from './components/requerimiento-renovacion-list/requerimiento-renovacion-list.component';

const routes: VexRoutes = [{ 
  path: '',
  children:[
    {
      path: '',
      canActivate: [AuthGuardService, RoleGuardService],
      component: RequerimientoRenovacionListComponent,
    }, {
      path: ':idSolicitud',
      canActivate: [AuthGuardService, RoleGuardService],
      component: RequerimientoRenovacionListComponent,
      data: {
        editable: true
      }
    }
  ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequerimientoRenovacionRoutingModule { }
