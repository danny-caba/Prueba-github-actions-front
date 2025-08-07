import { DatePipe } from "@angular/common";
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { ListadoDetalle } from "src/app/interface/listado.model";
import { InvitacionService } from "src/app/service/invitacion.service";
import { BasePageComponent } from "src/app/shared/components/base-page.component";
import { Link } from "src/helpers/internal-urls.components";

@Component({
  selector: "vex-invitacion-supervisor-pn",
  templateUrl: "./invitacion-supervisor-pn.component.html",
  styleUrls: ["./invitacion-supervisor-pn.component.scss"],
  animations: [fadeInUp400ms, stagger80ms],
})
export class InvitacionSupervisorPnComponent
  extends BasePageComponent<any>
  implements OnInit, OnChanges
{
  @Input() listInvitacion: ListadoDetalle[] = [];

  dateHoy = new Date();
  formGroup: FormGroup;
  estadosInvitacion: { label: string; valor: string }[] = [];

  /***borrar luego */

  displayedColumnsHard = [
    "fechaInvitacion",
    "fechaAceptacion",
    "fechaPlazoConfirmacion",
    "gerencia",
    "perfil",
    "nombres",
    "saldo",
    "estado",
    "acciones",
  ];

  constructor(
    private invitacionService: InvitacionService,
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.cargarTabla();
    this.initForm();
  }

  serviceTable(filtro) {
    return this.invitacionService.listarInvitaciones(filtro);
  }

  private initForm(): void {
    this.formGroup = this.fb.group({
      estadoInvitacion: [null],
      fechaDesde: [null],
      fechaHasta: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["listInvitacion"] && changes["listInvitacion"].currentValue) {
      this.estadosInvitacion = this.mapEstados(
        changes["listInvitacion"].currentValue
      );
    }
  }

  obtenerFiltro(): any {
    if (!this.formGroup) return {};
    const form = this.formGroup;

    const filtro = {
      estadoInvitacion: form.controls.estadoInvitacion.value,
      fechaDesde: this.datePipe.transform(
        form.controls.fechaDesde.value,
        "dd/MM/yyyy"
      ),
      fechaHasta: this.datePipe.transform(
        form.controls.fechaHasta.value,
        "dd/MM/yyyy"
      ),
    };

    return filtro;
  }

  private mapEstados(
    list: ListadoDetalle[]
  ): { label: string; valor: string }[] {
    return list.map((item) => ({
      label: item.descripcion,
      valor: item.valor,
    }));
  }

  verDetalle(invitacion: any): void {
    this.invitacionService.setInvitacion(invitacion);
    this.router.navigate([
      Link.EXTRANET,
      Link.INVITACIONES_LIST,
      Link.INVITACION_EVALUAR,
      invitacion.requerimientoInvitacionUuid,
    ]);
  }
}
