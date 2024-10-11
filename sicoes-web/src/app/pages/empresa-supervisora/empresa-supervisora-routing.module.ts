import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { AuthGuardService } from 'src/app/auth/guards';
import { Link } from 'src/helpers/internal-urls.components';
import { EmpresaSupervisoraCancelarComponent } from './empresa-supervisora-cancelar/empresa-supervisora-cancelar.component';
import { EmpresaSupervisoraListComponent } from './empresa-supervisora-list/empresa-supervisora-list.component';
import { EmpresaSupervisoraSuspCancListComponent } from './empresa-supervisora-susp-canc-list/empresa-supervisora-susp-canc-list.component';
import { EmpresaSupervisoraSuspCancViewComponent } from './empresa-supervisora-susp-canc-view/empresa-supervisora-susp-canc-view.component';
import { EmpresaSupervisoraSuspenderComponent } from './empresa-supervisora-suspender/empresa-supervisora-suspender.component';
import { EmpresaSupervisoraViewComponent } from './empresa-supervisora-view/empresa-supervisora-view.component';
import { RoleGuardService } from 'src/app/auth/guards/role-guard.service';


const routes: VexRoutes = [{ 
  path: '',
  children:[    
    {
      path: '',
      canActivate: [AuthGuardService, RoleGuardService],
      component: EmpresaSupervisoraListComponent
    },{
      path: Link.EMPRESA_SUPER_VIEW + '/:idSupervisora',
      canActivate: [AuthGuardService, RoleGuardService],
      component: EmpresaSupervisoraViewComponent
    },{
      path: Link.EMPRESA_SUPER_SUSPENDER + '/:idSupervisora',
      canActivate: [AuthGuardService, RoleGuardService],
      component: EmpresaSupervisoraSuspenderComponent
    },{
      path: Link.EMPRESA_SUPER_CANCELAR + '/:idSupervisora',
      canActivate: [AuthGuardService, RoleGuardService],
      component: EmpresaSupervisoraCancelarComponent
    },{
      path: Link.EMPRESA_SUPER_SUSPENDER_CANCELAR_LIST,
      canActivate: [AuthGuardService, RoleGuardService],
      component: EmpresaSupervisoraSuspCancListComponent
    },{
      path: Link.EMPRESA_SUPER_SUSPENDER_CANCELAR_LIST + '/' + Link.EMPRESA_SUPER_SUSPENDER_CANCELAR_VIEW + '/:idSuspensionCancelacion',
      canActivate: [AuthGuardService, RoleGuardService],
      component: EmpresaSupervisoraSuspCancViewComponent
    }]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresaSupervisoraRoutingModule { }
