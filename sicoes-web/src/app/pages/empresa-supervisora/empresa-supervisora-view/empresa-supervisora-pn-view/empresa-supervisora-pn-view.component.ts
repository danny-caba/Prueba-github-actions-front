import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { FormBuilder } from '@angular/forms';
import { ListadoDetalle } from 'src/app/interface/listado.model';

@Component({
  selector: 'vex-empresa-supervisora-pn-view',
  templateUrl: './empresa-supervisora-pn-view.component.html',
  styleUrls: ['./empresa-supervisora-pn-view.component.scss']
})
export class EmpresaSupervisoraPnViewComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input() SUPERVISORA: any;

  formGroup = this.fb.group({
    tipoDocumento: [null as ListadoDetalle],
    numeroDocumento: [''],
    nombres: [''],
    apellidoPaterno: [''],
    apellidoMaterno: [''],
    codigoTipoPN: [''],
    tipoPN: [''],
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

  constructor(
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.formGroup.disable();
    this.formGroup.patchValue(this.SUPERVISORA);
  }

  ngOnDestroy(): void {
    
  }

}