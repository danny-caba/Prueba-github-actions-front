import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { AuthGuardService } from 'src/app/auth/guards';
import { SolicitudGuardService } from 'src/app/auth/store/solicitud-guard.service';
import { SolicitudSancionVigenteService } from 'src/app/auth/store/solicitud-sancion-vigente';
import { SolicitudSancionVigenteServicePN } from 'src/app/auth/store/solicitud-sancion-vigente-PN';
import { SolicitudSancionVigenteServicePNfecVig } from 'src/app/auth/store/solicitud-sancion-vigente-PN-fec-vig';
import { Opcion } from 'src/helpers/constantes.options.';
import { Link } from 'src/helpers/internal-urls.components';
import { SolicitudAddComponent } from './solicitud-add/solicitud-add.component';
import { SolicitudEditComponent } from './solicitud-edit/solicitud-edit.component';
import { SolicitudListComponent } from './solicitud-list/solicitud-list.component';
import { SolicitudOpcionComponent } from './solicitud-opcion/solicitud-opcion.component';
import { RoleGuardService } from 'src/app/auth/guards/role-guard.service';

const routes: VexRoutes = [{ 
  path: '',
  children:[
    {
      path: '',
      canActivate: [AuthGuardService],
      component: SolicitudListComponent
    },{
      path: Link.SOLICITUDES_OPCION,
      canActivate: [AuthGuardService, SolicitudGuardService, RoleGuardService],
      component: SolicitudOpcionComponent
    },{
      path: Link.SOLICITUDES_ADD,
      canActivate: [AuthGuardService, SolicitudGuardService, RoleGuardService,SolicitudSancionVigenteService,SolicitudSancionVigenteServicePN,SolicitudSancionVigenteServicePNfecVig],
      component: SolicitudAddComponent,
      data: {
        isRegistro: true,
      }
    },{
      path: Link.SOLICITUDES_EDIT + '/:solicitudUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: SolicitudEditComponent,
      data: {
        editable: true,
        opcionPagina: [

          Opcion.BTN_PER_INS_AGREGAR,
          Opcion.MEN_PER_INS_MODIFICAR,
          Opcion.MEN_PER_INS_ELIMINAR,

          Opcion.BTN_GRA_ACA_AGREGAR,
          Opcion.MEN_GRA_ACA_EDITAR,
          Opcion.MEN_GRA_ACA_ELIMINAR,

          Opcion.BTN_CAPAC_AGREGAR,
          Opcion.MEN_CAPAC_EDITAR,
          Opcion.MEN_CAPAC_ELIMINAR,

          Opcion.BTN_DOC_EXP_AGREGAR,
          Opcion.MEN_DOC_EXP_EDITAR,
          Opcion.MEN_DOC_EXP_ELIMINAR
        ]
      }
    },{
      path: Link.SOLICITUDES_SUBSANAR + '/:solicitudUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: SolicitudEditComponent,
      data: {
        editable: false,
        isSubsanar: true,
        opcionPagina: [
          Opcion.BTN_GRA_ACA_AGREGAR,
          Opcion.MEN_GRA_ACA_EDITAR,
          Opcion.MEN_GRA_ACA_ELIMINAR,

          Opcion.BTN_CAPAC_AGREGAR,
          Opcion.MEN_CAPAC_EDITAR,
          Opcion.MEN_CAPAC_ELIMINAR,

          Opcion.BTN_DOC_EXP_AGREGAR,
          Opcion.MEN_DOC_EXP_EDITAR,
          Opcion.MEN_DOC_EXP_ELIMINAR,

          Opcion.VIEW_EVALUACION_EXT
        ]
      }
    },{
      path: Link.SOLICITUDES_ACTUALIZAR + '/:solicitudUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: SolicitudEditComponent,
      data: {
        editable: false,
        actualizable: true,
        isSubsanar: false,
        opcionPagina: [
        ]
      }
    },{
      path: Link.SOLICITUDES_EDIT_MOD + '/:solicitudUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: SolicitudEditComponent,
      data: {
        editable: false,
        editModified: true,
        actualizable: false,
        isSubsanar: false,
        opcionPagina: [
          Opcion.BTN_DOC_EXP_AGREGAR,
          Opcion.BTN_DOC_EXP_EDITAR_ARCH,
          Opcion.BTN_GRA_ACA_AGREGAR,
          Opcion.BTN_CAPAC_AGREGAR,

          Opcion.MEN_DOC_EXP_ELIMINAR,
          Opcion.MEN_CAPAC_ELIMINAR,
          Opcion.MEN_GRA_ACA_ELIMINAR,
        ]
      }
    },{
      path: 'ver/:solicitudUuid',
      canActivate: [AuthGuardService, RoleGuardService],
      component: SolicitudEditComponent,
      data: {
        isVer: true
      }
    }]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudRoutingModule { }
