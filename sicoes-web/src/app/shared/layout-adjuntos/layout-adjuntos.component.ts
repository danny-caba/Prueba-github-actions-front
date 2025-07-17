import { Component, Input } from "@angular/core";

import { AdjuntosService } from "src/app/service/adjuntos.service";
import { Router } from "@angular/router";


@Component({
  selector: "vex-layout-adjuntos",
  templateUrl: "./layout-adjuntos.component.html"
})
export class LayoutAdjuntosComponent {

  @Input() archivo: any;
  @Input() reqDocDetalle: any;
  @Input() rutaEvaluarDetalle: string[];

  constructor(
    private adjuntoService: AdjuntosService,
    private router: Router,
  ) { }

  descargar(adj) {
    let nombreAdjunto = adj.nombre != null ? adj.nombre : adj.nombreReal
    this.adjuntoService.descargarWindowsJWT(adj.codigo, nombreAdjunto);
  }

  abrirPdf() {
    this.router.navigate([...this.rutaEvaluarDetalle, 
      this.reqDocDetalle.requerimientoDocumentoDetalleUuid]);
  }

}
