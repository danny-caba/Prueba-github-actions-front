import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../components/base.component';
import { PersonalPropuesto } from 'src/app/interface/reemplazo-personal.model';
import { FormBuilder, Validators } from '@angular/forms';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';

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
  
  displayedColumns: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto', 'perfil', 'fechaRegistro', 'fechaBaja', 'fechaDesvinculacion', 'actions'];

  listPersonalPropuesto: PersonalPropuesto[] = null;
  listPersonalAgregado: PersonalPropuesto[] = [];

  editable: boolean = true;
  marcaFechaDesvinculacion: 'si' | 'no' | null = null;
  marcaInformeCarta: 'si' | 'no' | null = null;

  constructor(
    private fb: FormBuilder
  ) {
    super();
  }

  formGroup = this.fb.group({
    flagInforme: [null, [Validators.required]],
    fechaDesvinculacion: [null]
  });


  ngOnInit(): void {
    this.setFechaDesvinculacion();

    this.listPersonalPropuesto = [
      {
        idPersonal: 1,
        tipoDocumento: 'DNI',
        numeroDocumento: '12345678',
        nombreCompleto: 'Juan Pérez García',
        perfil: 'RND-11',
        fechaRegistro: '2025-06-10',
        fechaBaja: '',
        fechaDesvinculacion: ''
      }
    ];
  }

  setFechaDesvinculacion(): void {
    if (this.isCargaAdenda) {
      const hoy = new Date();
      const fechaInput = hoy.toISOString().split('T')[0];
      
      this.formGroup.patchValue({
        fechaDesvinculacion: fechaInput
      });
      
      this.formGroup.get('fechaDesvinculacion')?.disable();
    }
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  doNothing(): void {
    if (this.formGroup.valid) {
      const personalSeleccionado = this.formGroup.get('nombreCompleto')!.value as unknown as PersonalPropuesto;
      console.log('Personal seleccionado:', personalSeleccionado);
      const fechaDesvinculacion = this.formGroup.get('fechaDesvinculacion')?.value;
      console.log('Fecha de desvinculación:', fechaDesvinculacion);

      const yaExiste = this.listPersonalAgregado.some(p => p.nombreCompleto === personalSeleccionado.nombreCompleto);
      console.log('Ya existe:', yaExiste);
      if (yaExiste) {
        functionsAlert.error('Personal ya fue agregado').then((result) => {
        });
        this.formGroup.reset();
        return;
      }

      personalSeleccionado.fechaDesvinculacion = fechaDesvinculacion.toString();

      this.listPersonalAgregado.push(personalSeleccionado);
      this.listPersonalAgregado = [...this.listPersonalAgregado];
      this.formGroup.reset();
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  doNothing2(): void {


  }

  setValueCheckedInforme(obj, even) {
    obj.flagInforme = even.value;
  }
}
