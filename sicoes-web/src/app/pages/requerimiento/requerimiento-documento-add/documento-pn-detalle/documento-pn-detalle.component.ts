import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequerimientoDocumentoDetalle } from 'src/app/interface/requerimiento.model';
import { ModalReqDocumentoObservacionComponent } from 'src/app/shared/modal-req-documento-observacion/modal-req-documento-observacion.component';
import { EstadoReqDocDetalleEvalEnum as evaluacion } from 'src/helpers/constantes.components';

@Component({
  selector: 'vex-documento-pn-detalle',
  templateUrl: './documento-pn-detalle.component.html'
})
export class DocumentoPnDetalleComponent {

  @Input() add: boolean;
  @Input() subsanar: boolean;
  @Input() evaluate: boolean;
  @Input() requisito: RequerimientoDocumentoDetalle;
  @Input() rutaEvaluarDetalle: string[];
  @Input() isReview: boolean = false;

  constructor(
    private dialog: MatDialog,
  ) {
  }

  onChangeCheckbox(event: any, requisito: RequerimientoDocumentoDetalle) {
    if (this.isReview) {
      requisito.flagVistoBueno = event.checked ? '1' : '0';
    } else {
      requisito.archivo = event.checked ? null : requisito.archivo;
    }
  }

  validarCheck(): boolean {
    if (this.add || this.subsanar) {
      return this.requisito.archivo != null;
    }
    if (this.evaluate) {
      return (
        this.requisito.evaluacion?.codigo == evaluacion.CUMPLE ||
        this.requisito.evaluacion?.codigo == evaluacion.OBSERVADO);
    }
    // if (this.isReview) {
    //   return this.requisito.evaluacion?.codigo == evaluacion.CUMPLE;
    // }

    return false;
  }

  mostrarResultado(): boolean {
    return (this.evaluate && this.requisito.evaluacion != null)
      || (this.subsanar && this.requisito.evaluacion != null && this.requisito.evaluacion?.codigo == evaluacion.CUMPLE);
  }

  isArchivoEditable(): boolean {
    return this.add || (this.subsanar && (this.requisito.evaluacion?.codigo == evaluacion.OBSERVADO || this.requisito.evaluacion === null || this.requisito.evaluacion === undefined));
  }

  abrirObservacion() {
    this.dialog.open(ModalReqDocumentoObservacionComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        observacion: this.requisito.observacion,
        accion: 'view'
      },
    })
  }

}
