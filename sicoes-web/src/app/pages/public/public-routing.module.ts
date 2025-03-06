import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { Link } from 'src/helpers/internal-urls.components';
import { LoginExtranjeroComponent } from './login-extranjero/login-extranjero.component';
import { PublicComponent } from './public.component';
import { RecuperarContraneniaComponent } from './recuperar-contrasenia/recuperar-contrasenia.component';
import { RegistroEmpExtranjeraComponent } from './registro-emp-extranjera/registro-emp-extranjera.component';
import { RegistroEmpSuspCancComponent } from './registro-emp-susp-canc/registro-emp-susp-canc.component';
import { RegistroEmpComponent } from './registro-emp/registro-emp.component';
import { RegistroProcesoSeleccionComponent } from './registro-proceso-seleccion/registro-proceso-seleccion.component';
import { RegistroProcesoDetalleComponent } from './registro-proceso-seleccion/components/registro-proceso-detalle/registro-proceso-detalle.component';

const routes: VexRoutes = [{
  path: '',
  children: [
    {
      path: Link.REGISTRO_EMP,
      component: RegistroEmpComponent
    }, {
      path: Link.REGISTRO_EMP_SUSP_CANC,
      component: RegistroEmpSuspCancComponent
    }, {
      path: Link.REGISTRO_PROCESO_SELECCION,
      component: RegistroProcesoSeleccionComponent,
    },{
      path:Link.REGISTRO_PROCESO_SELECCION +'/'+':procesoUuid'+'/'+ Link.REGISTRO_PROCESO_SELECCION_DETALLE,
      // +'/:idDetalle'
      component:RegistroProcesoDetalleComponent
    }, {
      path: Link.LOGIN_EXTRANJERO,
      component: LoginExtranjeroComponent
    }, {
      path: Link.REGISTRO_EMP_EXTRANJERA,
      component: RegistroEmpExtranjeraComponent
    }, {
      path: Link.RECUPERAR_CONTRASENIA,
      component: RecuperarContraneniaComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
