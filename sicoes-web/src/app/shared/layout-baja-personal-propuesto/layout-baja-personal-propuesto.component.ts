import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ListadoPersonalPropuesto } from 'src/app/interface/listado.model';
import { BaseComponent } from '../components/base.component';

@Component({
  selector: 'vex-layout-baja-personal-propuesto',
  templateUrl: './layout-baja-personal-propuesto.component.html'
})
export class LayoutBajaPersonalPropuestoComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto', 'perfil', 'fechaRegistro', 'fechaInicioContractual', 'estadoReemplazo', 'estadoDocumento', 'actions'];

  listPersonalPropuesto: ListadoPersonalPropuesto[]

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

  }
}
