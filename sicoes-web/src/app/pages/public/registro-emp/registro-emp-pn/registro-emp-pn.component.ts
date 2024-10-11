import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls } from 'src/helpers/internal-urls.components';
import { ListadoEnum, TipoPersonaEnum } from 'src/helpers/constantes.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { ParametriaService } from 'src/app/service/parametria.service';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { SupervisoraService } from 'src/app/service/supervisora.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'vex-registro-emp-pn',
  templateUrl: './registro-emp-pn.component.html',
  styleUrls: ['./registro-emp-pn.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ],
  providers: [DatePipe]
})
export class RegistroEmpPnComponent extends BasePageComponent<Solicitud> implements OnInit {

  intenalUrls: InternalUrls;

  formGroup = this.fb.group({
    ruc: [null],
    nombres: [null],
    fechaInicio: [''],
    perfil: ['']
  });

  listTipoEmpresa: any[]

  displayedColumnsNatural: string[] = [
    'nroIdentTributaria',
    'apellidosNombres',
    'tipoPersona',
    'perfil',
    'fechaIngreso'
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private intUrls: InternalUrls,
    private parametriaService: ParametriaService,
    private supervisoraService: SupervisoraService,
    private datePipe: DatePipe
  ) {
    super();
    this.intenalUrls = intUrls;
  }

  ngOnInit(): void {
    this.cargarTabla();
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.TIPO_DOCUMENTO //FIXME TIPO_EMPRESA
    ]).subscribe(listRes => {
      this.listTipoEmpresa = listRes[0]
    })
  }

  serviceTable(filtro) {
    return this.supervisoraService.buscarEmpresaSuperPerfiles(filtro);
  }

  buscar() {
    this.paginator.pageIndex = 0;
    this.cargarTabla();
  }

  limpiar() {
    this.formGroup.reset();
    this.buscar();
  }

  obtenerFiltro() {
    let filtro: any = {
      ruc: this.formGroup.controls.ruc.value,
      nombres: this.formGroup.controls.nombres.value,
      perfil: this.formGroup.controls.perfil.value,
      fechaInicio: this.datePipe.transform(this.formGroup.controls['fechaInicio']?.value, 'dd/MM/yyyy'),
      codigoTipoPersona: ['PN_POSTOR', 'PN_PERS_PROPUESTO', 'NATURAL'],
      codigoTipoDocumento: 'DNI'
    }
    return filtro;
  }

  obtenerPerfil(obj){
    return obj.perfil?.nombre + '<br>' + obj.sector?.nombre
  }

  obtenerNombres(element){
    if(element.supervisora?.tipoPersona?.codigo == TipoPersonaEnum.PN_POSTOR){
      return element?.supervisora?.nombreRazonSocial;
    }
    return element?.supervisora.nombres + ' ' + element?.supervisora.apellidoPaterno + ' ' + element?.supervisora.apellidoMaterno
  }
}
