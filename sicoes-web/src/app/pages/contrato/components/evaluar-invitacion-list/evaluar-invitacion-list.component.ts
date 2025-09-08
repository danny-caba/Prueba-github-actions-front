import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Contrato } from 'src/app/interface/contrato.model';
import { ContratoService } from 'src/app/service/contrato.service';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { estadosIndexPerfCont, estadosPerfCont, tipoSolicitudPerfCont } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { solicitudContrato } from '../../../../../helpers/constantes.components';
import { ProcesoService } from 'src/app/service/proceso.service';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AuthFacade } from '../../../../auth/store/auth.facade';
import * as CryptoJS from 'crypto-js';
import { InvitacionRenovacion } from 'src/app/interface/invitacion-renovacion.model';
import { RequerimientoRenovacionService } from 'src/app/service/requerimiento-renovacion.service';
import { InvitacionRenovacionService } from 'src/app/service/invitacion-renovacion.service';

const URL_ENCRIPT = '3ncr1pt10nK3yuR1';

@Component({
  selector: 'vex-evaluar-invitacion-list',
  templateUrl: './evaluar-invitacion-list.component.html',
  styleUrls: ['./evaluar-invitacion-list.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})

export class EvaluarInvitacionListComponent extends BasePageComponent<InvitacionRenovacion> implements OnInit, OnDestroy {

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;

  displayedColumns: string[] = ['feInvitacion', 'fePlazoConfirmacion', 'feAceptacionInvitacion', 'tiSector', 
    'tiSubSector', 'noItem','estadoInvitacion', 'actions'];
  ACCION_VER: string = solicitudContrato.ACCION_VER;
  ACCION_EDITAR: string = solicitudContrato.ACCION_EDITAR;
  private destroy$ = new Subject<void>();

  formGroup = this.fb.group({
    nroConcurso: [null],
    item: [null],
    convocatoria: [''],
    estadoProcesoSolicitud: [''],
    tipoSolicitud: [''],
  });
  
  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private requerimientoRenovacionService: RequerimientoRenovacionService,
    private invitacionRenovacionService: InvitacionRenovacionService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.cargarTabla();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  serviceTable(filtro: any) {
    return this.invitacionRenovacionService.listar(filtro);
  }

  obtenerFiltro() {
    let filtro: any = {
    };
    return filtro;
  }

  goToBandejaSolicitudes() {
    this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST]);
  }

  limpiar() {
    this.formGroup.reset();
    this.buscar();
  }

  buscar() {
    this.paginator.pageIndex = 0;
    this.cargarTabla();
  }

  estadoSolicitud(contrato: Contrato): string {
    const estados: { [key: string]: string } = {
      "1": estadosPerfCont.PRELIMINAR,
      "2": estadosPerfCont.EN_PROCESO,
      "3": estadosPerfCont.OBSERVADO,
      "4": estadosPerfCont.CONCLUIDO,
      "5": estadosPerfCont.ARCHIVADO
    };
    return estados[contrato?.estadoProcesoSolicitud] || "Otro";
  }

  formRequisitos(contrato: Contrato): boolean {
    return contrato.estadoProcesoSolicitud === estadosIndexPerfCont.PRELIMINAR;
  }

  textoRequisito(contrato: Contrato): string {
    return contrato.tipoSolicitud === tipoSolicitudPerfCont.INSCRIPCION 
      ? 'requisitos' : 'subsanar';
  }

  encrypt(data: string): string {
    const encrypted = CryptoJS.AES.encrypt(data, URL_ENCRIPT).toString();
    return encrypted;
  }
  getEstadoDocInicioServicio(contrato: Contrato): string {
    const estados: { [key: string]: string } = {
      "1": "Pendiente",
      "2": "Enviado",
      "3": "Observado",
      "4": "Aprobado"
    };
    // idDocInicio podría ser null, undefined o un número. Si lo quieres mostrar según el ID:
    return contrato.idDocInicio ? estados[contrato.idDocInicio.toString()] || "" : "";
  }

  irACargaDocInicio(contrato: Contrato): void {
    // Aquí mandamos el id de la solicitud, no el idDocInicio, para cargar el doc
  this.router.navigate(['/', Link.EXTRANET, Link.CONTRATOS_LIST, 'cargar-documentacion-inicio', contrato.idSolicitud]);
  }

  evaluarInvitacion(contrato: Contrato): void {
    this.router.navigate(['/', Link.EXTRANET, Link.REQUERIMIENTO_RENOVACION_EVALUAR_INVITACION, contrato.idSolicitud]);
  }

}
