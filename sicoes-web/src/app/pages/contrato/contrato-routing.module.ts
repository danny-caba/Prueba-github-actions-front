import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { AuthGuardService } from 'src/app/auth/guards';
import { RoleGuardService } from 'src/app/auth/guards/role-guard.service';
import { Link } from 'src/helpers/internal-urls.components';
import { ContratoListComponent } from './components/contrato-list/contrato-list.component';
import { ContratoFormComponent } from './components/contrato-form/contrato-form.component';
import { ContratoDocumentosComponent } from './components/contrato-documentos/contrato-documentos.component';



const routes: VexRoutes = [{ 
  path: '',
  children:[
    {
      path: '',
      canActivate: [AuthGuardService, RoleGuardService],
      component: ContratoListComponent,
    }, {
      path: Link.CONTRATO_SOLICITUD_ADD + '/:idSolicitud',
      canActivate: [AuthGuardService, RoleGuardService],
      component: ContratoFormComponent,
      data: {
        editable: true
      }
    }, {
      path: Link.CONTRATO_SOLICITUD_VIEW + '/:idSolicitud',
      canActivate: [AuthGuardService, RoleGuardService],
      component: ContratoFormComponent,
      data: {
        editable: false
      }
    }, {
      path: 'cargar-documentacion-inicio/:id',
      component: ContratoDocumentosComponent
    },
    
  ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratoRoutingModule { }
