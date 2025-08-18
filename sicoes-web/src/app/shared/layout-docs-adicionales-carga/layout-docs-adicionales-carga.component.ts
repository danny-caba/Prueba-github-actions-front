import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../components/base.component';
import { PersonalReemplazoService } from 'src/app/service/personal-reemplazo.service';

@Component({
  selector: 'vex-layout-docs-adicionales-carga',
  templateUrl: './layout-docs-adicionales-carga.component.html',
  styleUrls: ['./layout-docs-adicionales-carga.component.scss']
})
export class LayoutDocsAdicionalesCargaComponent extends BaseComponent implements OnInit {

  @Input() isReview: boolean;
  @Input() idDocAlqCamioneta: number;
  @Input() idDocSeguroSoat: number;
  @Input() adjAlqCamioneta: any;
  @Input() adjSeguroSoat: any;
  @Input() codRolRevisor: string;

  @Output() seccionCompletada = new EventEmitter<any>();
  @Output() allConforme = new EventEmitter<any>();

  docAlqCamionetaEvaluadoPor: string = null;
  docSeguroSoatEvaluadoPor: string = null;
  docAlqCamionetaFechaHora: string = null;
  docSeguroSoatFechaHora: string = null;

  docAlqCamionetaRevisado: boolean = false;
  docSeguroSoatRevisado: boolean = false;

  editable: boolean = true;
  adjuntoCargadoAlqCamioneta: boolean = false;
  adjuntoCargadoSeguroSoat: boolean = false;

  marcacionContratoAlquiler: 'SI' | 'NO' | null = null;
  marcacionSeguroSoat: 'SI' | 'NO' | null = null;

  codRolRevisorNum: number;

  constructor(
    private reemplazoService: PersonalReemplazoService,
  ) {
    super();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['idDocAlqCamioneta'] && changes['idDocAlqCamioneta'].currentValue) {
      const nuevoIdDocumento = changes['idDocAlqCamioneta'].currentValue;
      this.idDocAlqCamioneta = nuevoIdDocumento;
    }
  
    if (changes['idDocSeguroSoat'] && changes['idDocSeguroSoat'].currentValue) {
      const nuevoIdDocumento = changes['idDocSeguroSoat'].currentValue;
      this.idDocSeguroSoat = nuevoIdDocumento;
    }

    if (changes['adjAlqCamioneta'] && changes['adjAlqCamioneta'].currentValue) {
      const nuevoAdjunto = changes['adjAlqCamioneta'].currentValue;
      this.adjAlqCamioneta = nuevoAdjunto;
      this.adjuntoCargadoAlqCamioneta = nuevoAdjunto?.adjunto?.archivo != null;
    }

    if (changes['adjSeguroSoat'] && changes['adjSeguroSoat'].currentValue) {
      const nuevoAdjunto = changes['adjSeguroSoat'].currentValue;
      this.adjSeguroSoat = nuevoAdjunto;
      this.adjuntoCargadoSeguroSoat = nuevoAdjunto?.adjunto?.archivo != null;
    }

    if (changes['codRolRevisor'] && changes['codRolRevisor'].currentValue) {
      const nuevoCodRolRevisor = changes['codRolRevisor'].currentValue;
      this.codRolRevisor = nuevoCodRolRevisor;
      this.codRolRevisorNum = parseInt(this.codRolRevisor, 10);
    }
  }

  onMarcaAlqCamionetaChange(valor: string) {
    let body = {
      idDocumento: this.idDocAlqCamioneta,
      conformidad: valor,
      idRol: this.codRolRevisorNum
    }

    this.reemplazoService.grabaConformidad(body).subscribe({
          next: (response) => {
            this.docAlqCamionetaEvaluadoPor = response.evaluador;
            this.docAlqCamionetaFechaHora = response.fecEvaluacion;
            this.docAlqCamionetaRevisado = true;
            this.validarSeccionesCompletadas();
            this.allConforme.emit(this.validarMarcas());
          }
    });
  }

  onMarcaSeguroSoatChange(valor: string) {
    let body = {
      idDocumento: this.idDocSeguroSoat,
      conformidad: valor,
      idRol: this.codRolRevisorNum
    }

    this.reemplazoService.grabaConformidad(body).subscribe({
          next: (response) => {
            this.docSeguroSoatEvaluadoPor = response.evaluador;
            this.docSeguroSoatFechaHora = response.fecEvaluacion;
            this.docSeguroSoatRevisado = true;
            this.validarSeccionesCompletadas();
            this.allConforme.emit(this.validarMarcas());
          }
    });
  }

  validarSeccionesCompletadas(){
    const docAlqCamionetaValido = this.adjuntoCargadoAlqCamioneta && this.docAlqCamionetaRevisado;
    const docSeguroSoatValido = this.adjuntoCargadoSeguroSoat && this.docSeguroSoatRevisado;

    this.seccionCompletada.emit(docAlqCamionetaValido && docSeguroSoatValido);
  }

  validarMarcas(): boolean {
    return [this.marcacionContratoAlquiler, this.marcacionSeguroSoat]
    .filter(marca => marca != null)
    .every(valor => valor === 'SI');
  }

  setValueCheckedContratoLab(even) {
  }

}