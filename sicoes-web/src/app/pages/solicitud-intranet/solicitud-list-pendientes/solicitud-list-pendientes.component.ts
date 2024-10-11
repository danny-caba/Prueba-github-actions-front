import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { ListadoEnum } from 'src/helpers/constantes.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'vex-solicitud-list-pendientes',
  templateUrl: './solicitud-list-pendientes.component.html',
  styleUrls: ['./solicitud-list-pendientes.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class SolicitudListPendientesComponent extends BasePageComponent<Solicitud> implements OnInit {

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;

  ACC_HISTORIAL = 'ACC_HISTORIAL';
  ACC_REGISTRAR = 'ACC_REGISTRAR';
  ACC_EDITAR = 'ACC_EDITAR';
  ACC_VER = 'ACC_VER';

  //FIXME
  formGroup = this.fb.group({
    nroExpediente: [''],
    estadoSolicitud: [null],
    tipoSolicitud: [null]
  });

  listTipoSolicitud: any[]
  listEstadoSolicitud: any[]
  listEstadoRevision: any[]

  displayedColumns: string[] = [
    'nroExpediente',
    'solicitante',
    'tipoSolicitud',
    'fechaRegistro',
    'fechaLimite',
    'estadoSolicitud',
    'estadoRevision',
    'actions'
  ];

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private fb: FormBuilder,
    private intUrls: InternalUrls,
    private parametriaService: ParametriaService,
    private solicitudService: SolicitudService,
    private dialog: MatDialog,
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
      ListadoEnum.TIPO_SOLICITUD,
      ListadoEnum.ESTADO_SOLICITUD,
      ListadoEnum.ESTADO_REVISION
    ]).subscribe(listRes => {
      this.listTipoSolicitud = listRes[0]
      this.listEstadoSolicitud = listRes[1]
      this.listEstadoRevision = listRes[2]
    })
  }

  serviceTable(filtro) {
    return this.solicitudService.buscarSolicitudes(filtro);
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
      idTipoSolicitud: this.formGroup.controls.tipoSolicitud.value?.idListadoDetalle,
      idEstadoSolicitud: this.formGroup.controls.estadoSolicitud.value?.idListadoDetalle,
      nroExpediente: this.formGroup.controls.nroExpediente.value,
    }
    return filtro;
  }

  ver(sol) {
    this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_VIEW, sol.solicitudUuid]);
  }

  editar(sol) {
    this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_EDIT, sol.solicitudUuid]);
  }

  mostrarOpcion(accion) {
    return true;
  }

  procesar(sol) {
    this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_PROCESAR, sol.solicitudUuid]);
  }

}
