import { Component, OnInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { RequerimientoService } from "src/app/service/requerimiento.service";
import { BasePageComponent } from "src/app/shared/components/base-page.component";
import { Link } from "src/helpers/internal-urls.components";

@Component({
  selector: "vex-requerimiento-aprobacion-historial",
  templateUrl: "./requerimiento-aprobacion-historial.component.html",
  styleUrls: ["./requerimiento-aprobacion-historial.component.scss"],
  animations: [fadeInUp400ms, stagger80ms],
})
export class RequerimientoAprobacionHistorialComponent implements OnInit {
  paginator: MatPaginator;
  sort: MatSort;
  dataSource: MatTableDataSource<any>;

  displayedColumns: string[] = [
    "tipo",
    "grupo",
    "fechaDesignacion",
    "aprobador",
    "fechaAprobacion",
    "resultado",
    "observacion",
  ];

  constructor(
    private requerimientoService: RequerimientoService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.serviceTable();
  }

  serviceTable() {
    const requerimientoUuid = this.route.snapshot.paramMap.get('requerimientoUuid');
    this.requerimientoService.obtenerHistorialAprobacion(requerimientoUuid).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource<any>(res.content);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  volver(): void {
    this.router.navigate([
      Link.INTRANET,
      Link.SOLICITUDES_LIST,
      Link.SOLICITUDES_LIST_APROBACION
    ]);
  }

}
