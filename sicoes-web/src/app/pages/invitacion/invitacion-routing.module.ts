import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { VexRoutes } from "src/@vex/interfaces/vex-route.interface";
import { AuthGuardService } from "src/app/auth/guards";
import { RoleGuardService } from "src/app/auth/guards/role-guard.service";
import { InvitacionDetalleComponent } from "./invitacion-detalle/invitacion-detalle.component";
import { InvitacionFormComponent } from "./invitacion-form/invitacion-form.component";
import { InvitacionListComponent } from "./invitacion-list/invitacion-list.component";

const routes: VexRoutes = [
  {
    path: "",
    children: [
      {
        path: "",
        canActivate: [AuthGuardService, RoleGuardService],
        component: InvitacionListComponent,
      },
      {
        path: "ver/:idPropuestaProfesional/:propuestaUuid",
        canActivate: [AuthGuardService],
        component: InvitacionDetalleComponent,
      },
      {
        path: ":idPropuestaProfesional/:propuestaUuid",
        canActivate: [AuthGuardService],
        component: InvitacionFormComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvitacionRoutingModule {}
