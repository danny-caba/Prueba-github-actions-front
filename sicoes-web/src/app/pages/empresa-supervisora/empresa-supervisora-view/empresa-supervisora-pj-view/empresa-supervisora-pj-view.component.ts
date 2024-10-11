import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { FormBuilder } from '@angular/forms';
import { ListadoDetalle } from 'src/app/interface/listado.model';

@Component({
  selector: 'vex-empresa-supervisora-pj-view',
  templateUrl: './empresa-supervisora-pj-view.component.html',
  styleUrls: ['./empresa-supervisora-pj-view.component.scss']
})
export class EmpresaSupervisoraPjViewComponent extends BaseComponent implements OnInit {

  @Input() SUPERVISORA: any;

  formGroup = this.fb.group({
    tipoDocumento: [null as ListadoDetalle],
    pais: [null as ListadoDetalle],
    numeroDocumento: [''],
    nombreRazonSocial: [''],
    codigoPartidaRegistral: [''],
    nombres: [''],
    apellidoPaterno: [''],
    apellidoMaterno: [''],
    codigoRuc: [''],
    direccion: [''],
    telefono1: [''],
    telefono2: [''],
    telefono3: [''],
    correo: [''],
    nombreDepartamento: [''],
    nombreProvincia: [''],
    nombreDistrito: ['']
  });

  formGroupRepresentante = this.fb.group({
    tipoDocumento: [null as ListadoDetalle],
    numeroDocumento: [''],
    nombres: [''],
    apellidoPaterno: [''],
    apellidoMaterno: [''],
  });

  constructor(
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.formGroup.disable();
    this.formGroup.patchValue(this.SUPERVISORA);

    this.formGroupRepresentante.disable();
    this.formGroupRepresentante.patchValue(this.SUPERVISORA.supervisoraRepresentante);
  }

}