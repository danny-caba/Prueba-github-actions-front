import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ListadoPersonalPropuesto } from 'src/app/interface/listado.model';
import { BaseComponent } from '../components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';

@Component({
  selector: 'vex-layout-baja-personal-propuesto',
  templateUrl: './layout-baja-personal-propuesto.component.html'
})
export class LayoutBajaPersonalPropuestoComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto', 'perfil', 'fechaRegistro', 'fechaBaja', 'fechaDesvinculacion', 'actions'];

  listPersonalPropuesto: ListadoPersonalPropuesto[] = null;
  listPersonalAgregado: ListadoPersonalPropuesto[] = [];

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
      const personalSeleccionado = this.formGroup.get('nombreCompleto')!.value as unknown as ListadoPersonalPropuesto;
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
