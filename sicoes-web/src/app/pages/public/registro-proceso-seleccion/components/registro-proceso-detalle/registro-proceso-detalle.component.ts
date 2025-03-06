import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { Solicitud } from "src/app/interface/solicitud.model";
import { ParametriaService } from "src/app/service/parametria.service";
import { PidoService } from "src/app/service/pido.service";
import { SupervisoraService } from "src/app/service/supervisora.service";
import { BasePageComponent } from "src/app/shared/components/base-page.component";
import { InternalUrls } from "src/helpers/internal-urls.components";

@Component({
  selector: "app-registro-proceso-detalle",
  templateUrl: "./registro-proceso-detalle.component.html",
  styleUrls: ["./registro-proceso-detalle.component.scss"],
  animations: [fadeInUp400ms, stagger80ms],
  providers: [DatePipe],
})
export class RegistroProcesoDetalleComponent
  extends BasePageComponent<Solicitud>
  implements OnInit
{
  serviceTable(filtro) {
    return this.pidoService.obtenerDocEtapaPublic(this.form_informa_gene.idProceso);
    // return this.pidoService.obtenerProcesosPublic(this.procesoUid);
  }
  obtenerFiltro() {
    return {}
  }

  // formGroup = this.fb.group({
  //   ruc: [null],
  //   nombres: [null],
  //   fechaInicio: [""],
  //   perfil: [""],
  // });

  listTipoEmpresa: any[];

  displayedColumns: string[] = [
    "numero",
    "etapa",
    "documento",
    "fecHorPubl",
    "accion",
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private intUrls: InternalUrls,
    private parametriaService: ParametriaService,
    private supervisoraService: SupervisoraService,
    private datePipe: DatePipe,
    private pidoService: PidoService
  ) {
    super();
  }
  procesoUid =""
  ngOnInit() {
    this.procesoUid = this.activeRoute.snapshot.paramMap.get('procesoUuid');

    this.pidoService.obtenerProcesosPublic(this.procesoUid).subscribe(resp=>{
      this.form_informa_gene = resp
      this.cargarTabla();
    })
    this.pidoService.listarEtapasPublic(this.procesoUid).subscribe(resp=>{
      this.form_cronograma = resp.content
      this.ordenarCronogramaPorFecha();
    })
  }

  ordenarCronogramaPorFecha(): void {
    this.form_cronograma.sort((a, b) => {
      const fechaA = this.convertirFecha(a.fechaInicio);
      const fechaB = this.convertirFecha(b.fechaInicio);
      return fechaA.getTime() - fechaB.getTime(); // Orden ascendente: primero la fecha más antigua
    });
  }

  convertirFecha(fecha: string): Date {
    // Si las fechas vienen en formato 'dd/MM/yyyy' debemos dividirlas y construir el objeto Date
    const partesFecha = fecha.split('/');
    const dia = parseInt(partesFecha[0], 10);
    const mes = parseInt(partesFecha[1], 10) - 1; // Los meses en JavaScript son 0-based (Enero es 0)
    const anio = parseInt(partesFecha[2], 10);
    return new Date(anio, mes, dia);
  }

  form_cronograma: any[] = []; // Asegúrate de que sea un array
  form_informa_gene:any = {}

  descargar(item){
    // this.pidoService.descargarWindowPublic(item.archivo.codigo,item.documentName).subscribe(resp=>{
    //   console.log(resp)
    // })
    this.pidoService.descargarWindowPublic(item.archivo.codigo,item.documentName).subscribe((data) => {
      // Crear un blob con el contenido PDF
      const blob = new Blob([data], { type: 'application/pdf' });

      // Crear una URL para el blob
      const url = window.URL.createObjectURL(blob);
      // Alternativamente, para descargar el archivo automáticamente:
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.documentName}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url); // Liberar la URL creada
    });
  }
  buscar() {}
  limpiar() {}
}
