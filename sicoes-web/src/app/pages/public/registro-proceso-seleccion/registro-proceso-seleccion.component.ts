import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subscription, map, startWith } from "rxjs";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { Solicitud } from "src/app/interface/solicitud.model";
import { ParametriaService } from "src/app/service/parametria.service";
import { PidoService } from "src/app/service/pido.service";
import { ProcesoService } from "src/app/service/proceso.service";
import { SupervisoraService } from "src/app/service/supervisora.service";
import { BasePageComponent } from "src/app/shared/components/base-page.component";
import { ListadoEnum } from "src/helpers/constantes.components";
import { functions } from "src/helpers/functions";
import { InternalUrls } from "src/helpers/internal-urls.components";

@Component({
  selector: "app-registro-proceso-seleccion",
  templateUrl: "./registro-proceso-seleccion.component.html",
  styleUrls: ["./registro-proceso-seleccion.component.scss"],
  animations: [fadeInUp400ms, stagger80ms],
  providers: [DatePipe],
})
export class RegistroProcesoSeleccionComponent
  extends BasePageComponent<Solicitud>
  implements OnInit
{
  serviceTable(filtro) {
    return this.pidoService.listadoProcesoPublic(filtro);
  }
  obtenerFiltro() {
    return {
      nombreProceso: this.formGroup.value.nombreProceso,
      nombreArea: this.formGroup.value.nombreArea,
      idEstado: this.formGroup.value.idEstado,
      size:10
    };
  }

  formGroup = this.fb.group({
    nombreProceso: [""],
    nombreArea: [""],
    idEstado: [""],
  });

  listTipoEmpresa: any[];
  filteredStatesTecnico$: Observable<any[]>;
  displayedColumns: string[] = [
    "numero",
    "division",
    "fecHrPubli",
    "numeroProceso",
    "descripcion",
    "accion",
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private pidoService: PidoService
  ) {
    super();
  }
  ngOnInit() {
    this.suscribirSolicitud();
    this.cargarCombo();
    this.cargarTabla();
  }
  listAreas: any[] = [];
  listEstado: any[] = [];
  filterDivision(nombre: string) {
    return this.listAreas.filter(
      (state) =>
        state.nombreUnidad?.toLowerCase().indexOf(nombre?.toLowerCase()) >= 0
    );
  }

  blurEvaluadorTecnico() {
    setTimeout(() => {
      if (!this.formGroup.controls.nombreArea.value) {
        this.formGroup.controls.nombreArea.setValue(null);
        this.formGroup.controls.nombreArea.markAsTouched();
      }
    }, 200);
  }

  displayFn(codi: any): string {
    return codi && codi.nombreUnidad ? codi.nombreUnidad : "";
  }

  cargarCombo() {
    this.pidoService.obtenerListadoUnidadesPublic().subscribe((res) => {
      this.listAreas = res;
      this.filteredStatesTecnico$ =
        this.formGroup.controls.nombreArea.valueChanges.pipe(
          startWith(""),
          map((value) => (typeof value === "string" ? value : value)),
          map((state) =>
            state ? this.filterDivision(state) : this.listAreas.slice()
          )
        );
    });
    this.pidoService
      .obtenerListadoEstadoPublic(ListadoEnum.ESTADO_PROCESO)
      .subscribe((res) => {
        this.listEstado = res.filter((estado) => estado.idListadoDetalle !== 722);
      });
  }
  buscar() {
    console.log(this.formGroup.value);
    this.cargarTabla();
  }
  limpiar() {
    this.formGroup.reset();
    this.cargarTabla();
  }
  PROCESO: any;
  suscriptionProceso: Subscription;
  private suscribirSolicitud() {
  }
  verDetalle(item){
    console.log(item)
    this.router.navigate(['/public/proceso-seleccion/'+item.procesoUuid+'/detalle'])
  }
}
