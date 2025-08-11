import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../components/base.component';
import { PersonalPropuesto } from 'src/app/interface/reemplazo-personal.model';
import { FormBuilder, Validators } from '@angular/forms';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { PersonalReemplazoService } from 'src/app/service/personal-reemplazo.service';

@Component({
  selector: 'vex-layout-informe',
  templateUrl: './layout-informe.component.html',
  styleUrls: ['./layout-informe.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class LayoutInformeComponent extends BaseComponent implements OnInit {

  @Input() isReviewExt: boolean;
  @Input() isCargaAdenda?: boolean;
  @Input() fechaDesvinculacion: string;
  @Input() adjuntoInforme: any;
  @Input() idDocumento: number;
  @Input() codRolRevisor: string;

  @Output() seccionCompletada = new EventEmitter<boolean>();
  
  displayedColumns: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto', 'perfil', 'fechaRegistro', 'fechaBaja', 'fechaDesvinculacion', 'actions'];

  listPersonalPropuesto: PersonalPropuesto[] = null;
  listPersonalAgregado: PersonalPropuesto[] = [];
  evaluadoPor: string = null;
  fechaHora: string = null;

  editable: boolean = false;
  marcaInformeCarta: 'SI' | 'NO' | null = null;

  constructor(
    private fb: FormBuilder,
    private reemplazoService: PersonalReemplazoService
  ) {
    super();
  }

  formGroup = this.fb.group({
    flagInforme: [null, [Validators.required]],
    fechaDesvinculacion: [null]
  });


  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fechaDesvinculacion'] && changes['fechaDesvinculacion'].currentValue) {
      const nuevaFecha = changes['fechaDesvinculacion'].currentValue;
      this.setFechaDesvinculacion(nuevaFecha);
    }

    if (changes['adjuntoInforme'] && changes['adjuntoInforme'].currentValue) {
      const nuevoAdjunto = changes['adjuntoInforme'].currentValue;
      this.adjuntoInforme = nuevoAdjunto;
    }

    if (changes['idDocumento'] && changes['idDocumento'].currentValue) {
      const nuevoIdInforme = changes['idDocumento'].currentValue;
      this.idDocumento = nuevoIdInforme;
    }

    if (changes['codRolRevisor'] && changes['codRolRevisor'].currentValue) {
      const nuevoCodRolRevisor = changes['codRolRevisor'].currentValue;
      this.codRolRevisor = nuevoCodRolRevisor;
    }
  }

  setFechaDesvinculacion(fecha: string): void {
    const [dd, mm, yyyy] = fecha.split('/');
    fecha = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    
    this.formGroup.patchValue({
      fechaDesvinculacion: fecha
    });
    this.formGroup.get('fechaDesvinculacion')?.disable();
  }

  onMarcaInformeCartaChange(valor: string) {
    let codigoNum = parseInt(this.codRolRevisor, 10);

    let body = {
      idDocumento: this.idDocumento,
      conformidad: valor,
      idRol: codigoNum
    }

    this.reemplazoService.grabaConformidad(body).subscribe({
          next: (response) => {
            this.evaluadoPor = response.evaluador;
            this.fechaHora = response.fecEvaluacion;
            this.seccionCompletada.emit(true);
          }
    });


  }

  setValueCheckedInforme(obj, even) {
    obj.flagInforme = even.value;
  }
}
