import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { Link } from 'src/helpers/internal-urls.components';
import { PrincipalComponent } from './principal.component';

const routes: VexRoutes = [{
  path: '',
  component: PrincipalComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalRoutingModule { }
