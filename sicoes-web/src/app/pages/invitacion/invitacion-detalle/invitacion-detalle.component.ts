import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { InvitacionService } from "src/app/service/invitacion.service";
import { Link } from "src/helpers/internal-urls.components";

@Component({
  selector: "vex-invitacion-detalle",
  templateUrl: "./invitacion-detalle.component.html",
  styleUrls: ["./invitacion-detalle.component.scss"],
})
export class InvitacionDetalleComponent implements OnInit {
  ESTADO_PROCESO_ITEM: string;
  uuid: string;
  idPropuesta: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private invitacionService: InvitacionService
  ) {}

  ngOnInit(): void {
    this.idPropuesta = +this.route.snapshot.paramMap.get(
      "idPropuestaProfesional"
    );
    this.uuid = this.route.snapshot.paramMap.get("propuestaUuid");
  }

  evaluarInvitacion(): void {
    const body = {
      idListadoDetalle: 948,
      codigo: "ACEPTADO",
    };

    this.invitacionService.evaluarInvitacion(this.uuid, body).subscribe({
      next: () => {
        console.log("Evaluado");
      },
    });
  }

  cancelar() {
    this.router.navigate([Link.EXTRANET, Link.INVITACIONES_LIST]);
  }
}
