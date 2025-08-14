import { Component, Input, OnInit } from "@angular/core";
import { PersonalReemplazo } from "src/app/interface/reemplazo-personal.model";
import { PersonalReemplazoService } from "src/app/service/personal-reemplazo.service";
import { BaseComponent } from "src/app/shared/components/base.component";
import { SeccionAdenda } from "src/helpers/constantes.components";

@Component({
  selector: "vex-adenda-form-upload",
  templateUrl: "./adenda-form-upload.component.html",
  styleUrls: ["./adenda-form-upload.component.scss"],
})
export class AdendaFormUploadComponent extends BaseComponent implements OnInit {
  @Input() idReemplazo: string;
  @Input() idSolicitud: string;
  @Input() uuidSolicitud: string;

  itemSeccion: number = 0;
  isReview: boolean = false;
  isReviewExt: boolean = true;
  isCargaAdenda: boolean = true;
  listPersonalReemplazo: PersonalReemplazo[] = [];

  constructor(private personalReemplazoService: PersonalReemplazoService) {
    super();
  }

  ngOnInit(): void {
    this.cargarInforme();
  }

  private cargarInforme() {
    this.personalReemplazoService
      .obtenerSeccionAdenda(this.idReemplazo, SeccionAdenda.INFORME)
      .subscribe({
        next: (data) => {
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>", data);
        },
        error: (err) => console.error("Error cargando informe", err),
      });
  }
}
