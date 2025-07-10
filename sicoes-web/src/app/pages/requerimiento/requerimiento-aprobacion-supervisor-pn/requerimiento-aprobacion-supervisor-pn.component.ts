import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { ParametriaService } from "src/app/service/parametria.service";
import { BasePageComponent } from "src/app/shared/components/base-page.component";
import { ListadoEnum } from "src/helpers/constantes.components";
import { Link } from "src/helpers/internal-urls.components";
import { RequerimientoService } from "src/app/service/requerimiento.service";
import { Division } from "src/app/interface/division.model";

@Component({
  selector: "vex-requerimiento-aprobacion-supervisor-pn",
  templateUrl: "./requerimiento-aprobacion-supervisor-pn.component.html",
  styleUrls: ["./requerimiento-aprobacion-supervisor-pn.component.scss"],
  animations: [fadeInUp400ms, stagger80ms],
})
export class RequerimientoAprobacionSupervisorPnComponent
  extends BasePageComponent<any>
  implements OnInit
{
  formGroup!: FormGroup;
  listEstadoRevision = [];
  listDivision: Division[];
  listAprobadoresALL: any[] = [];
  listDivisionesUsuario: any;
  perfiles: any[] = [];

  displayedColumns: string[] = [
    "tipoAprobacion",
    "nroExpediente",
    "documento",
    "nombres",
    "gerencia",
    "fechaIngreso",
    "estadoAprobacion",
    "firmaJefeUnidad",
    "firmaGerente",
    "aprobacionGppm",
    "aprobacionGse",
    "actions",
  ];

  constructor(
    private requerimientoService: RequerimientoService,
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.cargarCombo();
    this.cargarTabla();
    this.obtenerDivisiones();
    this.listarPerfiles();
  }

  cargarCombo() {
    this.parametriaService
      .obtenerMultipleListadoDetalle([ListadoEnum.ESTADO_REVISION])
      .subscribe((listRes) => {
        this.listEstadoRevision = listRes[0];
      });
  }

  private initForm(): void {
    this.formGroup = this.fb.group({
      nroExpediente: [null],
      gerencia: [null],
      perfil: [null],
      supervisor: [null],
      estadoRevision: [null],
    });
  }

  private obtenerDivisiones() {
    this.parametriaService.listarDivisiones().subscribe((response) => {
      this.listDivision = response || [];
    });
  }

  private listarPerfiles() {
    this.parametriaService.buscarPerfiles().subscribe((listRes) => {
      this.listAprobadoresALL = listRes;
      this.perfiles = this.obtenerPerfilesUnicos(listRes);
    });
  }

  onPerfilChange(perfilSeleccionado: any): void {
    if (perfilSeleccionado?.idListadoDetalle) {
      this.obtenerDivisionesPorUsuario(perfilSeleccionado.idListadoDetalle);
    }
  }

  private obtenerDivisionesPorUsuario(idPerfil: any) {
    this.parametriaService.listarAprobadores(idPerfil).subscribe((response) => {
      this.listDivisionesUsuario = response || [];
    });
  }

  private obtenerPerfilesUnicos(data: any[]): any[] {
    const mapa = new Map();
    data.forEach((item) => {
      const perfil = item.perfil;
      if (perfil?.idListadoDetalle && !mapa.has(perfil.idListadoDetalle)) {
        mapa.set(perfil.idListadoDetalle, perfil);
      }
    });
    return Array.from(mapa.values());
  }

  serviceTable(filtro) {
    return this.requerimientoService.listarRequerimientosAprobaciones(filtro);
  }

  obtenerFiltro(): any {
    const form = this.formGroup;

    return {
      nroExpediente: form.controls.nroExpediente.value,
      idGerencia: form.controls.gerencia.value?.idListadoDetalle,
      idPerfil: form.controls.perfil.value?.idListadoDetalle,
      idSupervisor: form.controls.supervisor.value?.idListadoDetalle,
      idEstadoRevision: form.controls.estadoRevision.value?.idListadoDetalle,
    };
  }

  buscar(): void {
    this.paginator.pageIndex = 0;
    this.cargarTabla();
  }

  limpiar(): void {
    this.formGroup.reset();
    this.buscar();
  }

  verHistorial(requerimiento): void {
    console.log("requerimiento", requerimiento);
    this.router.navigate([
      Link.INTRANET,
      Link.SOLICITUDES_LIST,
      Link.APROBACION_LIST_HISTORIAL,
    ]);
  }
}
