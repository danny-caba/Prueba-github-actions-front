import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from "@angular/core";
import { AdjuntosService } from "src/app/service/adjuntos.service";
import { ModalTerminosComponent } from "src/app/shared/modal-terminos/modal-terminos.component";
import { FormatoLocal } from "src/helpers/constantes.components";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "vex-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit, OnDestroy {
  @Input() customTemplate: TemplateRef<any>;

  constructor(
    private adjuntoService: AdjuntosService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {}

  ngOnDestroy(): void {}

  descargarManualUsuario() {
    this.adjuntoService.downloadFormatoPublico(
      FormatoLocal.MANUAL_USUARIO,
      "MANUAL_USUARIO.pdf"
    );
  }

  abrirTerminos() {
    this.dialog
      .open(ModalTerminosComponent, {
        disableClose: true,
        width: "800px",
        maxHeight: "auto",
        data: {
          accion: "view",
        },
      })
      .afterClosed()
      .subscribe((result) => {});
  }
}
