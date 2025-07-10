import { Component, OnInit } from "@angular/core";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { RequerimientoService } from "src/app/service/requerimiento.service";

@Component({
  selector: "vex-requerimiento-aprobacion-historial",
  templateUrl: "./requerimiento-aprobacion-historial.component.html",
  styleUrls: ["./requerimiento-aprobacion-historial.component.scss"],
  animations: [fadeInUp400ms, stagger80ms],
})
export class RequerimientoAprobacionHistorialComponent implements OnInit {
  dataSource = [];
  displayedColumns: string[] = [
    "tipo",
    "grupo",
    "fechaDesignacion",
    "aprobador",
    "fechaAprobacion",
    "resultado",
    "observacion",
  ];

  constructor(private requerimientoService: RequerimientoService) {}

  ngOnInit(): void {
    this.requerimientoService
      .obtenerHistorialAprobacion("9c0e2e72-8cf0-484a-98ce-cabb33e287b2")
      .subscribe({
        next: (historial) => {
          console.log("historial------------->", historial);
        },
      });
  }
}
