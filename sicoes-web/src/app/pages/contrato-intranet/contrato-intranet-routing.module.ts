import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { AuthGuardService } from 'src/app/auth/guards';
import { RoleGuardService } from 'src/app/auth/guards/role-guard.service';
import { Link } from 'src/helpers/internal-urls.components';
import { ContratoIntranetListComponent } from './components/contrato-intranet-list/contrato-intranet-list.component';
import { ContratoFormEvaluarComponent } from './components/contrato-form-evaluar/contrato-form-evaluar.component';
import { ContratoEvaluarDocumentosComponent } from './components/contrato-evaluar-documentos/contrato-evaluar-documentos.component';
import { ContratoEvaluarReemplazoComponent } from './components/contrato-evaluar-reemplazo/contrato-evaluar-reemplazo.component';
import { ContratoFormEvalReempComponent } from './components/contrato-form-eval-reemp/contrato-form-eval-reemp.component';
import { ContratoEvaluarDocsInicioComponent } from './components/contrato-evaluar-docs-inicio/contrato-evaluar-docs-inicio.component';
import { ContratoEvaluarDocsInicioFormComponent } from './components/contrato-evaluar-docs-inicio-form/contrato-evaluar-docs-inicio-form.component';

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
    }, {
      path: Link.REEMPLAZO_PERSONAL_ADD + '/:idSolicitud',
      canActivate: [AuthGuardService, RoleGuardService],
      component: ContratoEvaluarReemplazoComponent
    }, {
      path: Link.EVAL_REEMPLAZO_PERSONAL_FORM + '/:idSolicitud',
      component: ContratoFormEvalReempComponent,
      canActivate: [AuthGuardService, RoleGuardService]
    }, {
      path: Link.EVAL_DOCS_INICIO + '/:idSolicitud',
      component: ContratoEvaluarDocsInicioComponent,
      canActivate: [AuthGuardService, RoleGuardService]
    }, {
      path: Link.EVAL_DOCS_INICIO_FORM + '/:idSolicitud',
      component: ContratoEvaluarDocsInicioFormComponent,
      canActivate: [AuthGuardService, RoleGuardService]
    },   
  ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratoIntranetRoutingModule { }
