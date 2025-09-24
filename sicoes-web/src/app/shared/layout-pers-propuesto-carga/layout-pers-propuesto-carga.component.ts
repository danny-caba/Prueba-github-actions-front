import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../components/base.component';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { PersonalReemplazoService } from 'src/app/service/personal-reemplazo.service';
type Marcacion = 'SI' | 'NO' | null;
@Component({
  selector: 'vex-layout-pers-propuesto-carga',
  templateUrl: './layout-pers-propuesto-carga.component.html',
  styleUrls: ['./layout-pers-propuesto-carga.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class LayoutPersPropuestoCargaComponent extends BaseComponent implements OnInit {

  @Input() isReview?: boolean;
  @Input() adjContLaboral: any;
  @Input() adjSctr: any[];
  @Input() adjPoliza: any;
  @Input() adjExMedico: any;

  @Output() allConforme = new EventEmitter<any>();
  @Output() seccionCompletada = new EventEmitter<any>();

  editable: boolean = true;
  marcacionContratoLab: Marcacion = null;
  marcacionScrt: Marcacion = null;
  marcacionPoliza: Marcacion = null;
  marcacionExMed: Marcacion = null;

  templates = [
    {
      label: 'Contrato Laboral',
      files: [null],
      fileCount: 1,
      radioValue: this.marcacionContratoLab,
      fechaInicio: null,
      fechaFin: null,
      evaluadoPor: null,
      fechaHora: null
    },
    {
      label: 'SCTR',
      files: [null],
      fileCount: 2,
      radioValue: this.marcacionScrt,
      fechaInicio: null,
      fechaFin: null,
      evaluadoPor: null,
      fechaHora: null
    },
    {
      label: 'Póliza',
      files: [null],
      fileCount: 2,
      radioValue: this.marcacionPoliza,
      fechaInicio: null,
      fechaFin: null,
      evaluadoPor: null,
      fechaHora: null
    },
    {
      label: 'Examen Médico',
      files: [null],
      fileCount: 1,
      radioValue: this.marcacionExMed,
      fechaInicio: null,
      fechaFin: null,
      evaluadoPor: null,
      fechaHora: null
    }
  ];
  
  constructor(
    private readonly reemplazoService: PersonalReemplazoService
  ) {
    super();
  }

  ngOnInit(): void {
    this.isReview =this.isReview ?? false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['adjContLaboral']?.currentValue) {
      const nuevoAdj = changes['adjContLaboral'].currentValue;
      this.templates[0].files = Array.isArray(nuevoAdj) ? nuevoAdj : [nuevoAdj];
      this.templates[0].fechaInicio = nuevoAdj?.fechaInicio;
      this.templates[0].fechaFin = nuevoAdj?.fechaFin;
    }

    if (changes['adjSctr']?.currentValue) {
      const nuevoAdj = changes['adjSctr'].currentValue;
      if (nuevoAdj.length === 2) {
        this.templates[1].files = nuevoAdj;
        this.templates[1].fechaInicio = nuevoAdj[0].fechaInicio;
        this.templates[1].fechaFin = nuevoAdj[0].fechaFin;
      }
    }

    if (changes['adjPoliza']?.currentValue) {
      const nuevoAdj = changes['adjPoliza'].currentValue;
      if (nuevoAdj.length === 2) {
        this.templates[2].files = nuevoAdj;
        this.templates[2].fechaInicio = nuevoAdj[0].fechaInicio;
        this.templates[2].fechaFin = nuevoAdj[0].fechaFin;
      }
    }

    if (changes['adjExMedico']?.currentValue) {
      const nuevoAdj = changes['adjExMedico'].currentValue;
      this.templates[3].files = Array.isArray(nuevoAdj) ? nuevoAdj : [nuevoAdj];
      this.templates[3].fechaInicio = nuevoAdj?.fechaInicio;
      this.templates[3].fechaFin = nuevoAdj?.fechaFin;
    }
  }

  setValueCheckedContratoLab(even) {
    console.log(even)
  }

  validarExistenciaFiles(files: any[]): boolean {  
   return !files.find(file => file?.adjunto?.archivo);
  }

  onMarcaChange(valor: string, template: any) {
    let body = {
      idDocumento: template?.files?.idDocumento,
      conformidad: valor,
      idRol: 12
    }

    this.reemplazoService.grabaConformidad(body).subscribe({
          next: (response) => {
            template.evaluadoPor = response.evaluador;
            template.fechaHora = response.fecEvaluacion;
            this.validarSeccionCompleta();
            this.allConforme.emit(this.validarMarcas());
          }
    });
  }

  validarSeccionCompleta(){
    const seccionesCompletadas = this.templates.filter(
      template => !template.files.includes(null))
      .every(template =>  template.radioValue != null);

    this.seccionCompletada.emit(seccionesCompletadas);
  }

  validarMarcas(): boolean {
    return this.templates
    .filter(template => template.radioValue != null)
    .every(template => template.radioValue === 'SI');
  }


}