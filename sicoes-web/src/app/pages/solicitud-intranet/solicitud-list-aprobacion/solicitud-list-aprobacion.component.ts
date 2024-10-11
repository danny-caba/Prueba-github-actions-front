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
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalAprobadorFirmaAccionComponent } from 'src/app/shared/modal-aprobador-firma-accion/modal-aprobador-firma-accion.component';
import { LayoutAprobacionHistorialComponent } from 'src/app/shared/layout-aprobacion-historial/layout-aprobacion-historial.component';

@Component({
  selector: 'vex-solicitud-list-aprobacion',
  templateUrl: './solicitud-list-aprobacion.component.html',
  styleUrls: ['./solicitud-list-aprobacion.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class SolicitudListAprobacionComponent extends BasePageComponent<Solicitud> implements OnInit {

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;
  SOLICITUD: any;

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
    estadoAprobacion: [null],
    tipoSolicitud: [null]

  });

  listTipoSolicitud: any[]
  listEstadoRevision: any[]
  listEstadoEvaluacionTecnica: any[]
  listEstadoEvaluacionAdminis: any[]
  listEstadoAprobacion: any[]

  listaNroExpedienteSeleccionado = []
  listaSolicitudUuidSeleccionado = []

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
    //'estadoAprobacion',
    'actions'
  ];

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private fb: FormBuilder,
    private intUrls: InternalUrls,
    private parametriaService: ParametriaService,
    private solicitudService: SolicitudService,
    private adjuntoService: AdjuntosService,
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
      ListadoEnum.ESTADO_REVISION,
      ListadoEnum.RESULTADO_EVALUACION_TEC_ADM,
    ]).subscribe(listRes => {
      this.listTipoSolicitud = listRes[0]
      this.listEstadoRevision = listRes[1]
      this.listEstadoEvaluacionTecnica = listRes[2]
      this.listEstadoEvaluacionAdminis = listRes[2]
    })
  }

  serviceTable(filtro) {
    return this.solicitudService.buscarSolicitudesAprobador(filtro);
  }

  buscar() {
    this.paginator.pageIndex = 0;
    this.cargarTabla();
    this.listaNroExpedienteSeleccionado = [];
    this.listaSolicitudUuidSeleccionado = [];
  }

  limpiar() {
    this.formGroup.reset();
    this.buscar();
  }

  obtenerFiltro() {
    let filtro: any = {
      idTipoSolicitud: this.formGroup.controls.tipoSolicitud.value?.idListadoDetalle,
      idEstadoRevision: this.formGroup.controls.estadoRevision.value?.idListadoDetalle,
      idEstadoEvaluacionTecnica: this.formGroup.controls.estadoEvalTecnica.value?.idListadoDetalle,
      idEstadoEvaluacionAdministrativa: this.formGroup.controls.estadoEvalAdministrativa.value?.idListadoDetalle,
      nroExpediente: this.formGroup.controls.nroExpediente.value,
      solicitante: this.formGroup.controls.solicitante.value,
    }
    return filtro;
  }

  ver(sol) {
    this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_VIEW, sol.solicitudUuid]);
  }
  
  mostrarOpcion(accion) {
    return true;
  }

  procesar(sol) {
    this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_PROCESAR, sol.solicitudUuid]);
  }

  aprobar(sol) {
    this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_APROBAR, sol.solicitudUuid]);
  }

  descargarItem(item){
    this.adjuntoService.descargarWindowsJWT(item.codigo, item.nombreReal);
  }

  obtenerNombre(item){
    if(item.tipoArchivo?.codigo == 'TA11') return 'Solicitud';
    if(item.tipoArchivo?.codigo == 'TA13') return 'Resultado Solicitud';
    if(item.tipoArchivo?.codigo == 'TA12') return 'Subsanación';
    if(item.tipoArchivo?.codigo == 'TA14') return 'Resultado Subsanación';
    return ""
  }

  aprobar_firmar(sol) {
    this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_APROBAR, sol.solicitudUuid]);
  }

  flag:boolean = true;

  aprobacion_FirmaMasiva(action) {

    this.dialog.open(ModalAprobadorFirmaAccionComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        solicitud: this.SOLICITUD,
        accion: action,
        //Borrar
        listaNroExpedienteSeleccionado: this.listaNroExpedienteSeleccionado,
        listaSolicitudUuidSeleccionado: this.listaSolicitudUuidSeleccionado,
        //asignacion: obj,
      },
    }).afterClosed().subscribe(result => {
      if(result == 'OK'){
        this.flag = false;
        this.ngOnInit();
        this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_LIST_APROBACION]);
      }else{
        this.flag = true;
        this.tabAprobacionHistorial?.cargarTabla();
      }
    });
  }

  @ViewChild('tabAprobacionHistorial') tabAprobacionHistorial: LayoutAprobacionHistorialComponent;

  actualizarListaExpediente(event, nroExpediente, solicitudUuid) {
    
    if (event.checked) {
      this.listaNroExpedienteSeleccionado.push(nroExpediente);
      this.listaSolicitudUuidSeleccionado.push(solicitudUuid);
    }
    else {
      this.listaNroExpedienteSeleccionado.splice(this.listaNroExpedienteSeleccionado.indexOf(nroExpediente), 1);
      this.listaSolicitudUuidSeleccionado.splice(this.listaSolicitudUuidSeleccionado.indexOf(solicitudUuid), 1);
    }
  }
}
