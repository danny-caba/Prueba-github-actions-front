import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { ListadoEnum, TipoSuspensionCancelacionEnum } from 'src/helpers/constantes.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { SuspeCancService } from 'src/app/service/susp-canc.service';
import { AdjuntosService } from 'src/app/service/adjuntos.service';

@Component({
  selector: 'vex-empresa-supervisora-susp-canc-list',
  templateUrl: './empresa-supervisora-susp-canc-list.component.html',
  styleUrls: ['./empresa-supervisora-susp-canc-list.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class EmpresaSupervisoraSuspCancListComponent extends BasePageComponent<Solicitud> implements OnInit {

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;

  ACC_HISTORIAL = 'ACC_HISTORIAL';
  ACC_REGISTRAR = 'ACC_REGISTRAR';
  ACC_EDITAR = 'ACC_EDITAR';
  ACC_VER = 'ACC_VER';

  formGroup = this.fb.group({
    nroExpediente: [''],
    nroIdentTributaria: [null],
    tipoPersona: [null],
    nombres: [null],
    estado: [null]
  });

  listTipoPersona: any[]
  listEstado: any[]

  displayedColumns: string[] = [
    'nroExpediente',
    'tipoPersona',
    'pais',
    'tipoDocumento',
    'nroIdentTributaria',
    'razonSocial',
    'estado',
    'fechaInicio',
    'fechaFin',
    'actions'
  ];

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private fb: FormBuilder,
    private intUrls: InternalUrls,
    private parametriaService: ParametriaService,
    private suspeCancService: SuspeCancService,
    private adjuntoService: AdjuntosService
  ) {
    super();
    this.intenalUrls = intUrls;
  }

  ngOnInit(): void {
    this.cargarCombo();
    this.cargarTabla();
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.TIPO_PERSONA,
      ListadoEnum.ESTADO_EVALUACION//FIXME ESTADO_EMPRESA
    ]).subscribe(listRes => {
      this.listTipoPersona = listRes[0],
        this.listEstado = listRes[1]
    })
  }

  serviceTable(filtro) {
    return this.suspeCancService.buscar(filtro);
  }

  buscar() {
    this.paginator.pageIndex = 0;
    this.cargarTabla();
  }

  reporte() {
    this.adjuntoService.reporteEmpresaSupervisora("formato04.codigo", "reporte.xlsx");
  }

  limpiar() {
    this.formGroup.reset();
    this.buscar();
  }

  obtenerFiltro() {
    let filtro: any = {
      nroExpediente: this.formGroup.controls.nroExpediente.value,
      ruc: this.formGroup.controls.nroIdentTributaria.value,
      idEstado: this.formGroup.controls.estado.value?.idListadoDetalle,
      idTipoPersona: this.formGroup.controls.tipoPersona.value?.idListadoDetalle,
      razonSocial: this.formGroup.controls.nombres.value

    }
    return filtro;
  }

  ver(sol) {
    this.router.navigate([Link.INTRANET, 
      Link.EMPRESA_SUPER_LIST, 
      Link.EMPRESA_SUPER_SUSPENDER_CANCELAR_LIST, 
      Link.EMPRESA_SUPER_SUSPENDER_CANCELAR_VIEW, sol.idSuspensionCancelacion]);
  }

  mostrarOpcion(accion) {
    return true;
  }

  verSupervisora(sol) {
    this.router.navigate([Link.INTRANET, Link.EMPRESA_SUPER_LIST, Link.EMPRESA_SUPER_VIEW, sol.supervisora.idSupervisora]);
  }

  verTipo(obj, acc){
    if(acc == 'V_SUSP' && obj.tipo?.codigo == TipoSuspensionCancelacionEnum.SUSPENDIDA) return true;
    if(acc == 'V_CANC' && obj.tipo?.codigo == TipoSuspensionCancelacionEnum.CANCELADA) return true;
    return false;
  }

}
