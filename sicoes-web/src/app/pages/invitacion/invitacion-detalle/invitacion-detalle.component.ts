import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { InvitacionService } from "src/app/service/invitacion.service";
import { functionsAlert } from "src/helpers/functionsAlert";
import { Link } from "src/helpers/internal-urls.components";

@Component({
  selector: "vex-invitacion-detalle",
  templateUrl: "./invitacion-detalle.component.html"
})
export class InvitacionDetalleComponent implements OnInit {
  ESTADO_PROCESO_ITEM: string;
  uuid: string;
  invitacion: any;
  ESTADO_ACEPTADO = "ACEPTADO";
  ESTADO_RECHAZADO = "RECHAZADO";

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly invitacionService: InvitacionService
  ) {}

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.uuid = this.route.snapshot.paramMap.get("requerimientoInvitacionUuid");
    this.invitacionService.suscribeInvitacion().subscribe({
      next: (data) => {
        if (data !== null) {
          this.invitacion = data;
        } else {
          this.router.navigate([Link.EXTRANET, Link.INVITACIONES_LIST]);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  evaluarInvitacion(estado: string): void {
    const body = {
      codigo: estado,
    };

    this.invitacionService.evaluarInvitacion(this.uuid, body).subscribe({
      next: () => {
        functionsAlert.successDescargar("Invitación evaluada correctamente").then((result) => {
          this.router.navigate([Link.EXTRANET, Link.INVITACIONES_LIST]);
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  cancelar() {
    this.router.navigate([Link.EXTRANET, Link.INVITACIONES_LIST]);
  }
}
