import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { FormBuilder } from '@angular/forms';
import { ListadoDetalle } from 'src/app/interface/listado.model';

@Component({
  selector: 'vex-empresa-supervisora-pn-postor-view',
  templateUrl: './empresa-supervisora-pn-postor-view.component.html',
  styleUrls: ['./empresa-supervisora-pn-postor-view.component.scss']
})
export class EmpresaSupervisoraPnPostorViewComponent extends BaseComponent implements OnInit {

  @Input() SUPERVISORA: any;

  formGroup = this.fb.group({
    tipoDocumento: [null as ListadoDetalle],
    pais: [null as ListadoDetalle],
    numeroDocumento: [''],
    nombreRazonSocial: [''],
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