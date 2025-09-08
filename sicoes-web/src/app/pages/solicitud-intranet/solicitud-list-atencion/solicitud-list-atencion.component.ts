import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { EstadoEvaluacionAdministrativa, EstadoEvaluacionTecnica, ListadoEnum, SolicitudEstadoEnum } from 'src/helpers/constantes.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { ParametriaService } from 'src/app/service/parametria.service';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { MatDialog } from '@angular/material/dialog';
import { ModalNotificacionComponent } from 'src/app/shared/modal-notificacion/modal-notificacion.component';


@Component({
  selector: 'vex-solicitud-list-atencion',
  templateUrl: './solicitud-list-atencion.component.html',
  styleUrls: ['./solicitud-list-atencion.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class SolicitudListAtencionComponent extends BasePageComponent<Solicitud> implements OnInit {

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;
  selectedIndex = 0;
  ACC_HISTORIAL = 'ACC_HISTORIAL';
  ACC_REGISTRAR = 'ACC_REGISTRAR';
  ACC_EDITAR = 'ACC_EDITAR';
  ACC_VER = 'ACC_VER';

  formGroup = this.fb.group({
    nroExpediente: [''],
    solicitante: [''],
    estadoRevision: [null],
    estadoEvalTecnica: [null],
    estadoEvalAdministrativa: [null],
    tipoSolicitud: [null]

  });

  listTipoSolicitud: any[]
  listEstadoRevision: any[]
  listEstadoEvaluacion: any[]

  displayedColumns: string[] = [
    'nroExpediente',
    'solicitante',
    'tipoPersona',
    'tipoSolicitud',
    'fechaRegistro',
    'fechaLimiteEvaluacion',
    'fechaLimiteRespuesta',
    'estadoRevision',
    'estadoEvalTecnica',
    'estadoEvalAdministrativa',
    'notificacionRespuesta',
    'notificacionArchivamiento',
    'actions'
  ];

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private fb: FormBuilder,
    private intUrls: InternalUrls,
    private dialog: MatDialog,
    private parametriaService: ParametriaService,
    private solicitudService: SolicitudService
  ) {
    super();
    this.intenalUrls = intUrls;
  }

  ngOnInit(): void {
    this.cargarCombo();
    this.cargarTabla();
    const savedIndex = sessionStorage.getItem('mis-solicitudes-index');
    this.selectedIndex = savedIndex ? parseInt(savedIndex) : 0;
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.TIPO_SOLICITUD,
      ListadoEnum.ESTADO_REVISION,
      ListadoEnum.RESULTADO_EVALUACION_TEC_ADM
    ]).subscribe(listRes => {
      this.listTipoSolicitud = listRes[0]
      this.listEstadoRevision = listRes[1]
      this.listEstadoEvaluacion = listRes[2]
    })
  }

  serviceTable(filtro) {
    return this.solicitudService.buscarSolicitudesEvaluador(filtro);
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
      idEstadoRevision: this.formGroup.controls.estadoRevision.value?.idListadoDetalle,
      idEstadoEvalTecnica: this.formGroup.controls.estadoEvalTecnica.value?.idListadoDetalle,
      idEstadoEvalAdministrativa: this.formGroup.controls.estadoEvalAdministrativa.value?.idListadoDetalle,
      nroExpediente: this.formGroup.controls.nroExpediente.value,
      solicitante: this.formGroup.controls.solicitante.value
    }
    return filtro;
  }

  ver(sol) {
    this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_VIEW, sol.solicitudUuid]);
  }

  mostrarOpcion(opt, objSol) {
    if(opt == 'EVALUAR' && 
        (
          EstadoEvaluacionAdministrativa.ASIGNADO == objSol.estadoEvaluacionAdministrativa?.codigo ||
          EstadoEvaluacionAdministrativa.EN_PROCESO == objSol.estadoEvaluacionAdministrativa?.codigo ||
          EstadoEvaluacionTecnica.ASIGNADO == objSol.estadoEvaluacionTecnica?.codigo ||
          EstadoEvaluacionTecnica.EN_PROCESO == objSol.estadoEvaluacionTecnica?.codigo
        )
    ) return true;

    if(opt == 'RESPUESTA' && [SolicitudEstadoEnum.OBSERVADO, SolicitudEstadoEnum.CONCLUIDO].includes(objSol.estado?.codigo) && objSol.flagRespuesta === 0) return true;
    if(opt == 'ARCHIVAMIENTO' && [SolicitudEstadoEnum.ARCHIVADO].includes(objSol.estado?.codigo) && objSol.flagArchivamiento === 0) return true;

    if(opt == 'VIEW_RESPUESTA' && objSol.flagRespuesta === 1) return true;
    if(opt == 'VIEW_ARCHIVAMIENTO' && objSol.flagArchivamiento === 1) return true;

    return false;
  }

  procesar(sol) {
    this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_PROCESAR, sol.solicitudUuid]);
  }

  evaluar(sol) {
    this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_EVALUAR, sol.solicitudUuid]);
  }

  notificacion(sol, tipo, action){
    this.dialog.open(ModalNotificacionComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        solicitud: sol,
        tipo: tipo,
        accion: action,
        //capacitacion: obj,
      },
    }).afterClosed().subscribe(() => {
      this.cargarTabla();
    });
  }

  onTabChange(index: number) {
    this.selectedIndex = index;
    sessionStorage.setItem('mis-solicitudes-index', this.selectedIndex.toString());
  }

}
