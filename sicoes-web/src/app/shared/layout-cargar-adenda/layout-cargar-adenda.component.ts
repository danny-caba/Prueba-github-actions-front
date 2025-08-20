import { Component, Input, OnInit } from "@angular/core";
import { BaseComponent } from "../components/base.component";

@Component({
  selector: "vex-layout-cargar-adenda",
  templateUrl: "./layout-cargar-adenda.component.html",
  styleUrls: ["./layout-cargar-adenda.component.scss"],
})
export class LayoutCargarAdendaComponent
  extends BaseComponent
  implements OnInit
{
  @Input() isReviewExt: boolean;
  @Input() isCargaAdenda: boolean;
  @Input() idReemplazo: string;

  editable: boolean = true;
  marcacion: "si" | "no" | null = null;
  adjuntoCargado: boolean = false;

  constructor() {
    super();
  }

  ngOnInit(): void {}

  setValueCheckedCartaReemplazo(even) {}
  onAdjuntoSuccess(event);

  onAdjuntoSuccess(valor: boolean) {
    this.adjuntoCargado = valor;
  }
}
