import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '../components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { PersonalPropuesto } from 'src/app/interface/reemplazo-personal.model';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';

@Component({
  selector: 'vex-layout-baja-personal-propuesto',
  templateUrl: './layout-baja-personal-propuesto.component.html',
  styleUrls: ['./layout-baja-personal-propuesto.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class LayoutBajaPersonalPropuestoComponent extends BaseComponent implements OnInit {

  @Input() isReview: boolean;

  displayedColumns: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto', 'perfil', 'fechaRegistro', 'fechaBaja', 'fechaDesvinculacion', 'actions'];
  displayedColumnsReview: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto', 'perfil', 'fechaRegistro', 'fechaBaja', 'fechaFinContrato'];

  listPersonalPropuesto: PersonalPropuesto[] = null;
  listPersonalAgregado: PersonalPropuesto[] = [];

  constructor(
    private fb: FormBuilder
  ) {
    super();
  }

  formGroup = this.fb.group({
    nombreCompleto: [null, Validators.required],
    fechaDesvinculacion: [null, Validators.required]
  });



  ngOnInit(): void {
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
}
