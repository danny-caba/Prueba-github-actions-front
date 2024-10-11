import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { ListadoEnum, TipoSuspensionCancelacionEnum } from 'src/helpers/constantes.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { ParametriaService } from 'src/app/service/parametria.service';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { SupervisoraService } from 'src/app/service/supervisora.service';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { functions } from 'src/helpers/functions';
import { fil } from 'date-fns/locale';

@Component({
  selector: 'vex-empresa-supervisora-list',
  templateUrl: './empresa-supervisora-list.component.html',
  styleUrls: ['./empresa-supervisora-list.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class EmpresaSupervisoraListComponent extends BasePageComponent<Solicitud> implements OnInit {

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
    razonSocial: [null]
  });

  mostrarColumna: boolean = true;

  listTipoPersona: any[]

  displayedColumns: string[] = [
    'pais',
    'nroExpediente',
    'tipoPersona',
    'tipo',
    'nroIdentTributaria',
    'razonSocial',
    'montoEvaluado',
    'estado',
    'fecha',
    'actions'
  ];

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private fb: FormBuilder,
    private intUrls: InternalUrls,
    private parametriaService: ParametriaService,
    private supervisoraService: SupervisoraService,
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
      ListadoEnum.TIPO_PERSONA
    ]).subscribe(listRes => {
      this.listTipoPersona = listRes[0]
    })
  }

  //AFC
  serviceTable(filtro) {
    if(filtro.idTipoPersona == 679){
      this.mostrarColumna = false;
      this.displayedColumns = this.displayedColumns.filter(item => item !== "montoEvaluado");
    }
    // return this.supervisoraService.buscarEmpresaSuper(filtro);
    return this.supervisoraService.buscarEmpresaMontoSuper(filtro);
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
      nroExpediente: this.formGroup.controls.nroExpediente.value,
      ruc: this.formGroup.controls.nroIdentTributaria.value,
      idTipoPersona: this.formGroup.controls.tipoPersona.value?.idListadoDetalle,
      nombres: this.formGroup.controls.razonSocial.value
    }
    return filtro;
  }

  ver(sol) {
    this.router.navigate([Link.INTRANET, Link.EMPRESA_SUPER_LIST, Link.EMPRESA_SUPER_VIEW, sol.idSupervisora]);
  }

  suspender(sol) {
    this.router.navigate([Link.INTRANET, Link.EMPRESA_SUPER_LIST, Link.EMPRESA_SUPER_SUSPENDER, sol.idSupervisora]);
  }

  cancelar(sol) {
    this.router.navigate([Link.INTRANET, Link.EMPRESA_SUPER_LIST, Link.EMPRESA_SUPER_CANCELAR, sol.idSupervisora]);
  }

  mostrarOpcion(accion) {
    return true;
  }

  reporte() {
    this.adjuntoService.reporteEmpresaSupervisora("formato04.codigo", "reporte.xlsx");
  }

  verSuspCanc(obj, acc){
    if(['SUSP', 'CANC'].includes(acc) && functions.esVacio(obj.suspensionCancelacion)) return true;
    if(acc == 'V_SUSP' && obj.suspensionCancelacion?.tipo?.codigo == TipoSuspensionCancelacionEnum.SUSPENDIDA) return true;
    if(acc == 'V_CANC' && obj.suspensionCancelacion?.tipo?.codigo == TipoSuspensionCancelacionEnum.CANCELADA) return true;
    return false;
  }

  verSuspervisionCancelacion(sol) {
    this.router.navigate([Link.INTRANET, 
      Link.EMPRESA_SUPER_LIST, 
      Link.EMPRESA_SUPER_SUSPENDER_CANCELAR_LIST, 
      Link.EMPRESA_SUPER_SUSPENDER_CANCELAR_VIEW, sol.suspensionCancelacion?.idSuspensionCancelacion]);
  }
  
}
