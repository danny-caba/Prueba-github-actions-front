import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { ListadoEnum, SolicitudEstadoEnum, SolicitudEstadoRevisionEnum } from 'src/helpers/constantes.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { Solicitud } from 'src/app/interface/solicitud.model';

@Component({
  selector: 'vex-solicitud-list-intranet',
  templateUrl: './solicitud-list-intranet.component.html',
  styleUrls: ['./solicitud-list-intranet.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class SolicitudIntranetListIntranetComponent extends BasePageComponent<Solicitud> implements OnInit {

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;

  ACC_HISTORIAL = 'ACC_HISTORIAL';
  ACC_REGISTRAR = 'ACC_REGISTRAR';
  ACC_EDITAR = 'ACC_EDITAR';
  ACC_PROCESAR = 'ACC_PROCESAR';
  ACC_VER = 'ACC_VER';

  //FIXME
  formGroup = this.fb.group({
    nroExpediente: [''],
    solicitante: [''],
    estadoSolicitud: [null],
    estadoRevision: [null],
    tipoSolicitud: [null]
  });

  listTipoSolicitud: any[]
  listEstadoSolicitud: any[]
  listEstadoRevision: any[]

  displayedColumns: string[] = [
    'nroExpediente',
    'solicitante',
    'tipoPersona',
    'tipoSolicitud',
    'fechaIngreso',
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
    private solicitudService: SolicitudService
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
    return this.solicitudService.buscarSolicitudesResponsable(filtro);
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
      solicitante: this.formGroup.controls.solicitante.value,
      idEstadoRevision: this.formGroup.controls.estadoRevision.value?.idListadoDetalle,
    }
    return filtro;
  }

  ver(sol) {
    if(sol.estado.codigo == SolicitudEstadoEnum.OBSERVADO){
      if(sol.solicitudUuidPadre){
        this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_VIEW, sol.solicitudUuidPadre]);
      }else{
        this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_VIEW, sol.solicitudUuid]);
      }

    }else{
      this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_VIEW, sol.solicitudUuid]);
    }

  }

  mostrarOpcion(opt, objSol) {
    if(opt == this.ACC_PROCESAR &&
      objSol.estado?.codigo == SolicitudEstadoEnum.EN_PROCESO &&
        (
          objSol.estadoRevision.codigo == SolicitudEstadoRevisionEnum.POR_ASIGNAR 
          || objSol.estadoRevision.codigo == SolicitudEstadoRevisionEnum.ASIGNADO
          || objSol.estadoRevision.codigo == SolicitudEstadoRevisionEnum.EN_PROCESO
        )
      ) return true;
    return false;
  }

  procesar(sol) {
    this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_PROCESAR, sol.solicitudUuid]);
  }

}
