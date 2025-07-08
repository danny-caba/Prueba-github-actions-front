import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { AuthGuardService } from 'src/app/auth/guards';
import { RoleGuardService } from 'src/app/auth/guards/role-guard.service';
import { Link } from 'src/helpers/internal-urls.components';
import { ContratoIntranetListComponent } from './components/contrato-intranet-list/contrato-intranet-list.component';
import { ContratoFormEvaluarComponent } from './components/contrato-form-evaluar/contrato-form-evaluar.component';
import { ContratoEvaluarDocumentosComponent } from './components/contrato-evaluar-documentos/contrato-evaluar-documentos.component';

const routes: VexRoutes = [{ 
  path: '',
  children:[
    {
      path: '',
      canActivate: [AuthGuardService, RoleGuardService],
      component: ContratoIntranetListComponent,
    }, {
      path: Link.CONTRATO_SOLICITUD_EVALUAR + '/:idSolicitud',
      canActivate: [AuthGuardService, RoleGuardService],
      component: ContratoFormEvaluarComponent,
      data: {
        editable: false,
        evaluar: true,
        view: false
      }
    }, {
      path: Link.CONTRATO_SOLICITUD_VIEW + '/:idSolicitud',
      canActivate: [AuthGuardService, RoleGuardService],
      component: ContratoFormEvaluarComponent,
      data: {
        editable: false,
        evaluar: true,
        view: true
      }
    }, {
      path: 'evaluar-documentos-inicio/:idSolicitud',
      canActivate: [AuthGuardService, RoleGuardService],
      component: ContratoEvaluarDocumentosComponent,
      data: { evaluarDocInicio: true }
    }
  ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratoIntranetRoutingModule { }
