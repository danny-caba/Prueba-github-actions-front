import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../components/base.component';
import { ListadoPersonalPropuesto } from 'src/app/interface/listado.model';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'vex-layout-personal-propuesto',
  templateUrl: './layout-personal-propuesto.component.html',
  styleUrls: ['./layout-personal-propuesto.component.scss']
})
export class LayoutPersonalPropuestoComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto', 'djNepotismo', 'djImpedimento', 'djNoVinculo', 'otrosDocumentos', 'actions'];

  listPersonalPropuesto: ListadoPersonalPropuesto[] = null;
  listPersonalAgregado: ListadoPersonalPropuesto[] = [];
  editable: boolean = true;

  constructor(
    private fb: FormBuilder
  ) {
    super();
  }

  formGroup = this.fb.group({
      nombreCompleto: [null, Validators.required],
      flagDjNepotismo: [null, Validators.required],
      flagDjImpedimento: [null, Validators.required],
      flagDjNoVinculo: [null, Validators.required],
      flagOtros: [null, Validators.required]
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

  setValueCheckedDjNepotismo(obj, even) {
    obj.flagDjNepotismo = even.value;
  }

  setValueCheckedDjImpedimento(obj, even) {
    obj.flagDjImpedimento = even.value;
  }

  setValueCheckedDjNoVinculo(obj, even) {
    obj.flagDjNoVinculo = even.value;
  }

  setValueCheckedOtros(obj, even) {
    obj.flagOtros = even.value;
  }

}
