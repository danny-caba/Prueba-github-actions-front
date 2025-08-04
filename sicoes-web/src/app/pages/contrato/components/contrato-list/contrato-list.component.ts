import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Contrato } from 'src/app/interface/contrato.model';
import { ContratoService } from 'src/app/service/contrato.service';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { estadosIndexPerfCont, estadosPerfCont, reemplazoPersonalPropuesto, tipoSolicitudPerfCont } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { solicitudContrato } from '../../../../../helpers/constantes.components';
import { ProcesoService } from 'src/app/service/proceso.service';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AuthFacade } from '../../../../auth/store/auth.facade';
import * as CryptoJS from 'crypto-js';
import { AuthUser } from 'src/app/auth/store/auth.models';

const URL_ENCRIPT = '3ncr1pt10nK3yuR1';

@Component({
  selector: 'vex-contrato-list',
  templateUrl: './contrato-list.component.html',
  styleUrls: ['./contrato-list.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})

export class ContratoListComponent extends BasePageComponent<Contrato> implements OnInit, OnDestroy {

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;
  usuario: AuthUser;
  private userSub: Subscription;

  displayedColumns: string[] = ['concurso', 'convocatoria', 'item', 'fechaPresentacion', 'fechaSubsanacion', 'estado', 'estadoDocInicioServicio', 'tipo', 'actions'];
  ACCION_VER: string = solicitudContrato.ACCION_VER;
  ACCION_EDITAR: string = solicitudContrato.ACCION_EDITAR;
  ACCION_REEMPLAZAR: string = reemplazoPersonalPropuesto.ACCION_REEMPLAZAR;
  ACCION_REVISAR: string = reemplazoPersonalPropuesto.ACCION_REVISAR;
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
    private contratoService: ContratoService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.cargarTabla();
    this.userSub = this.user$.subscribe(usu => {
      this.usuario = usu;
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.userSub?.unsubscribe();
  }

  serviceTable(filtro: any) {
    return this.contratoService.obtenerSolicitudesExterno(filtro);
  }

  obtenerFiltro() {
    let filtro: any = {
      nroConcurso: this.formGroup.get('nroConcurso').value,
      item: this.formGroup.get('item').value,
      convocatoria: this.formGroup.get('convocatoria').value ? `%${this.formGroup.get('convocatoria').value.trim()}%` : null,
      estado: this.formGroup.get('estadoProcesoSolicitud').value,
      tipoSolicitud: this.formGroup.get('tipoSolicitud').value
    };
    return filtro;
  }

  goToBandejaSolicitudes() {
    this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST]);
  }

  goToFormContrato(contrato: any, accion: string) {
    this.contratoService.validarSancionVigenteV2(contrato.supervisora.numeroDocumento)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res =>{
      if(res.resultado === '1'){
        this.contratoService.enviarCorreoSancion(contrato.idSolicitud, res)
          .pipe(takeUntil(this.destroy$))
          .subscribe((response) => {
          functionsAlert.vigente('No es posible realizar su registro.', 'Mantiene una sancion por parte del OSCE.').then((result) => {
          });
        });
      }else{

        let encodedId = this.encrypt(contrato.idSolicitud.toString());
        this.contratoService.validarFechaPresentacion(contrato.idSolicitud)
          .pipe(takeUntil(this.destroy$))
          .subscribe((response) => {
          if (response) {
            const linkAccion = {
              [this.ACCION_VER]:        Link.CONTRATO_SOLICITUD_VIEW,
              [this.ACCION_EDITAR]:        Link.CONTRATO_SOLICITUD_ADD,
              [this.ACCION_REEMPLAZAR]: Link.REEMPLAZO_PERSONAL_ADD,
              [this.ACCION_REVISAR]: Link.REEMPLAZO_PERSONAL_REVIEW
            }[accion];

            this.router.navigate([Link.EXTRANET, Link.CONTRATOS_LIST, linkAccion, encodedId]);
          } else {
            functionsAlert.error('La fecha límite de presentación ha expirado.');
          }
        });
      }
    });
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

  reemplazoRequisitos(contrato: Contrato): boolean {
    return contrato.estadoProcesoSolicitud === estadosIndexPerfCont.CONCLUIDO &&
           (contrato.tipoSolicitud === tipoSolicitudPerfCont.INSCRIPCION ||
            contrato.tipoSolicitud === tipoSolicitudPerfCont.SUBSANACION);
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

  goToCargaDocsInicio(contrato: any): void {
    // Aquí mandamos el id de la solicitud, no el idDocInicio, para cargar el doc
  this.router.navigate(['/', Link.EXTRANET, Link.CONTRATOS_LIST, Link.CARGA_DOCS_INICIO, contrato.idSolicitud]);
  }

}
