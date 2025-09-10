import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { ListadoEnum } from 'src/helpers/constantes.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { SupervisoraService } from 'src/app/service/supervisora.service';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { Contrato, SelectedPerfeccionamientoItem } from 'src/app/interface/contrato.model';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalAprobadorFirmaAccionComponent } from 'src/app/shared/modal-aprobador-firma-accion/modal-aprobador-firma-accion.component';
import { LayoutAprobacionHistorialComponent } from 'src/app/shared/layout-aprobacion-historial/layout-aprobacion-historial.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ModalAprobadorContratoComponent } from 'src/app/shared/modal-aprobador-contrato/modal-aprobador-contrato.component';
import { ModalAprobadorInformeRenovacionComponent } from 'src/app/shared/modal-aprobador-informe-renovacion/modal-aprobador-informe-renovacion.component';
import { ModalAprobadorHistorialContratoComponent } from 'src/app/shared/modal-aprobador-historial-contrato/modal-aprobador-historial-contrato.component';
import { HistorialAprobacion } from 'src/app/interface/historial-aprobacion-renovacion';
import { InformeAprobacionResponse } from 'src/app/interface/informe-aprobacion.model';

@Component({
  selector: 'vex-solicitud-list-aprobacion',
  templateUrl: './solicitud-list-aprobacion.component.html',
  styleUrls: ['./solicitud-list-aprobacion.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class SolicitudListAprobacionComponent extends BasePageComponent<Solicitud> implements OnInit, OnDestroy {

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;
  currentUser: any;
  SOLICITUD: any;

  ACC_HISTORIAL = 'ACC_HISTORIAL';
  ACC_REGISTRAR = 'ACC_REGISTRAR';
  ACC_EDITAR = 'ACC_EDITAR';
  ACC_VER = 'ACC_VER';
  mostrarHistorial=false;
  mostrarCards=true;
  selectedTabIndex=0;

  formGroup = this.fb.group({
    nroExpediente: [''],
    solicitante: [''],
    estadoRevision: [null],
    estadoEvalTecnica: [null],
    estadoEvalAdministrativa: [null],
    estadoAprobacion: [null],
    tipoSolicitud: [null]
  });

  formGroupPerfeccionamiento = this.fb.group({
    nroExpedienteP: [''],
    contratistaP: [''],
    tipoContratoP: [null],
    tipoAprobacionP: [null],
    estadoAprobacionP: [null]
  });

  formGroupInformeRenovacion = this.fb.group({
    nroExpedienteR: [''],
    contratistaR: [''],
    estadoAprobacionR: [null]
  });

  listTipoSolicitud: any[];
  listEstadoRevision: any[];
  listEstadoAprobacionInforme: any[];
  listEstadoEvaluacionTecnica: any[];
  listEstadoEvaluacionAdminis: any[];
  listEstadoAprobacion: any[];

  listTipoContrato: any[];
  listTipoAprobacionP: any[];
  listEstadoAprobacionP: any[];

  listTipoInformeRenovacion: any[];
  listEstadoEvaluacionRenovacion: any[];

  listaNroExpedienteSeleccionado: string[] = [];
  listaSolicitudUuidSeleccionado: string[] = [];

  listaContratosSeleccionadosPerfeccionamiento: SelectedPerfeccionamientoItem[] = [];

  listaInformesRenovacionSeleccionados: any[] = [];

  listaSupervisorasAutocomplete: any[] = [];
  isLoadingSupervisoras = false;
  private destroy$ = new Subject<void>();

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
    'actions'
  ];

  displayedColumnsPerfeccionamiento: string[] = [
    'select',
    'numeroExpediente',
    'tp',
    'contratista',
    'tipoContrato',
    'fechaIngreso',
    'estadoAprobacion',
    'estadoAprobacionLogistica',
    'estadoVbGAF',
    'estadoVbJefeUnidad',
    'estadoFirmaGerencia',
    'actionsPerfeccionamiento'
  ];

  displayedColumnsInformeRenovacion: string[] = [
    'selectRenovacion',
    'tipoAprobacionR',
    'numeroExpedienteR',
    'informeR',
    'tpR',
    'contratistaR',
    'tipoContratoR',
    'fechaIngresoR',
    'estadoAprobacionR',
    'estadoAprobacionJefeDivisionR',
    'estadoAprobacionGerenteDivisionR',
    'estadoAprobacionGPPMR',
    'estadoAprobacionGSER',
    'actionsInformeRenovacion'
  ];

  dataSourcePerfeccionamiento = new MatTableDataSource<any>();
  dataSourceInformeRenovacion = new MatTableDataSource<any>();
  dataSourceHistorial = new MatTableDataSource<any>();

  @ViewChild('paginatorPerfeccionamiento') paginatorPerfeccionamiento: MatPaginator;
  @ViewChild('paginatorInformeRenovacion') paginatorInformeRenovacion: MatPaginator;
  @ViewChild('paginatorHistoriaInformeRenovacion') paginatorHistoriaInformeRenovacion: MatPaginator;

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private fb: FormBuilder,
    private intUrls: InternalUrls,
    private parametriaService: ParametriaService,
    private solicitudService: SolicitudService,
    private supervisoraService: SupervisoraService,
    private adjuntoService: AdjuntosService,
    private dialog: MatDialog,
  ) {
    super();
    this.intenalUrls = intUrls;
  }

  ngOnInit(): void {
    this.user$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.currentUser = user;
    });
    this.cargarCombo();
    this.cargarTabla();
    this.cargarTablaPerfeccionamiento();
    this.cargarTablaInformeRenovacion();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.TIPO_SOLICITUD,
      ListadoEnum.ESTADO_REVISION,
      ListadoEnum.RESULTADO_EVALUACION_TEC_ADM,
      ListadoEnum.TIPO_CONTRATO,
      ListadoEnum.TIPO_APROBACION_PERFECCIONAMIENTO,
      ListadoEnum.ESTADO_APROBACION_PERFECCIONAMIENTO,
      ListadoEnum.TIPO_INFORME_RENOVACION,
      ListadoEnum.ESTADO_EVALUACION_RENOVACION
    ]).subscribe(listRes => {
      this.listTipoSolicitud = listRes[0];
      this.listEstadoRevision = listRes[1];
      this.listEstadoEvaluacionTecnica = listRes[2];
      this.listEstadoEvaluacionAdminis = listRes[2];

      this.listTipoContrato = listRes[3];
      this.listTipoAprobacionP = listRes[4];
      this.listEstadoAprobacionP = listRes[5];

      // Para informe de renovación - usar estado de aprobación perfeccionamiento como base
      this.listEstadoAprobacionInforme = listRes[5]; // Reutilizar estados de aprobación
      this.listTipoInformeRenovacion = listRes[6];
      this.listEstadoEvaluacionRenovacion = listRes[7];
    });
  }

  serviceTable(filtro) {
    return this.solicitudService.buscarSolicitudesAprobador(filtro);
  }

  serviceTablePerfeccionamiento(filtroPerfeccionamiento: any) {
    return this.solicitudService.buscarSolicitudesAprobadorPerfeccionamiento(filtroPerfeccionamiento);
  }

  serviceTableInformeRenovacion(filtroInformeRenovacion: any) {
    return this.solicitudService.buscarInformesRenovacionAprobador(filtroInformeRenovacion);
  }

  serviceTableInformeRenovacionParaAprobar(filtroInformeRenovacion: any) {
    return this.solicitudService.buscarInformesRenovacionParaAprobar(filtroInformeRenovacion);
  }

  serviceTableInformeRenovacionNuevoEndpoint(filtroInformeRenovacion: any) {
    return this.solicitudService.buscarInformesRenovacionNuevoEndpoint(filtroInformeRenovacion);
  }

  buscar() {
    this.paginator.pageIndex = 0;
    this.cargarTabla();
    this.listaNroExpedienteSeleccionado = [];
    this.listaSolicitudUuidSeleccionado = [];
  }

  buscarPerfeccionamiento() {
    if (this.paginatorPerfeccionamiento) {
      this.paginatorPerfeccionamiento.pageIndex = 0;
    }
    this.cargarTablaPerfeccionamiento();
    this.listaContratosSeleccionadosPerfeccionamiento = [];
  }

  buscarInformeRenovacion() {
    if (this.paginatorInformeRenovacion) {
      this.paginatorInformeRenovacion.pageIndex = 0;
    }
    this.cargarTablaInformeRenovacion();
    this.listaInformesRenovacionSeleccionados = [];
  }

  buscarInformeRenovacionParaAprobar() {
    if (this.paginatorInformeRenovacion) {
      this.paginatorInformeRenovacion.pageIndex = 0;
    }
    this.cargarTablaInformeRenovacionParaAprobar();
    this.listaInformesRenovacionSeleccionados = [];
  }

  buscarInformeRenovacionNuevoEndpoint() {
    if (this.paginatorInformeRenovacion) {
      this.paginatorInformeRenovacion.pageIndex = 0;
    }
    this.cargarTablaInformeRenovacionNuevoEndpoint();
    this.listaInformesRenovacionSeleccionados = [];
  }

  onEmpresaSupervisoraChange(value: string) {
    if (value && value.length >= 3) {
      this.isLoadingSupervisoras = true;
      this.supervisoraService.autocompleteEmpresaSupervisora(value)
        .subscribe(
          (data) => {
            this.listaSupervisorasAutocomplete = data || [];
            this.isLoadingSupervisoras = false;
          },
          (error) => {
            console.error('Error al buscar supervisoras:', error);
            this.listaSupervisorasAutocomplete = [];
            this.isLoadingSupervisoras = false;
          }
        );
    } else {
      this.listaSupervisorasAutocomplete = [];
    }
  }

  displaySupervisoraFn = (supervisora: any) => {
    return supervisora ? (supervisora.nombreRazonSocial || supervisora.nombre || supervisora) : '';
  }

  limpiar() {
    this.formGroup.reset();
    this.buscar();
  }

  limpiarPerfeccionamiento() {
    this.formGroupPerfeccionamiento.reset();
    this.listaContratosSeleccionadosPerfeccionamiento = [];
    this.buscarPerfeccionamiento();
  }

  limpiarInformeRenovacion() {
    this.formGroupInformeRenovacion.reset();
    this.listaInformesRenovacionSeleccionados = [];
    this.buscarInformeRenovacion();
  }

  obtenerFiltro() {
    let filtro: any = {
      idTipoSolicitud: this.formGroup.controls.tipoSolicitud.value?.idListadoDetalle,
      idEstadoRevision: this.formGroup.controls.estadoRevision.value?.idListadoDetalle,
      idEstadoEvaluacionTecnica: this.formGroup.controls.estadoEvalTecnica.value?.idListadoDetalle,
      idEstadoEvaluacionAdministrativa: this.formGroup.controls.estadoEvalAdministrativa.value?.idListadoDetalle,
      nroExpediente: this.formGroup.controls.nroExpediente.value,
      solicitante: this.formGroup.controls.solicitante.value,
    };
    return filtro;
  }

  obtenerFiltroPerfeccionamiento() {
    let filtroPerfeccionamiento: any = {
      nroExpediente: this.formGroupPerfeccionamiento.controls.nroExpedienteP.value,
      contratista: this.formGroupPerfeccionamiento.controls.contratistaP.value,
      idTipoContrato: this.formGroupPerfeccionamiento.controls.tipoContratoP.value?.idListadoDetalle,
      idTipoAprobacion: this.formGroupPerfeccionamiento.controls.tipoAprobacionP.value?.idListadoDetalle,
      idEstadoAprobacion: this.formGroupPerfeccionamiento.controls.estadoAprobacionP.value?.idListadoDetalle,
      page: this.paginatorPerfeccionamiento?.pageIndex ?? 0,
      size: this.paginatorPerfeccionamiento?.pageSize ?? 10,
    };
    return filtroPerfeccionamiento;
  }

  obtenerFiltroInformeRenovacion() {
    let filtroInformeRenovacion: any = {
      nroExpediente: this.formGroupInformeRenovacion.controls.nroExpedienteR.value,
      // Para el backend, si se ingresa nombre de contratista, debe convertirse a idContratista
      // Por ahora mantenemos como texto, pero se podría implementar búsqueda de ID
      nombreContratista: this.formGroupInformeRenovacion.controls.contratistaR.value,
      idEstadoAprobacion: this.formGroupInformeRenovacion.controls.estadoAprobacionR.value?.idListadoDetalle,
      page: this.paginatorInformeRenovacion?.pageIndex ?? 0,
      size: this.paginatorInformeRenovacion?.pageSize ?? 10,
      grupoUsuario: this.obtenerGrupoUsuario(),
    };
    return filtroInformeRenovacion;
  }

  private obtenerGrupoUsuario(): number {
    if (this.currentUser?.usuario) {
      // Determinar el grupo basado en el rol del usuario
      if (this.currentUser.usuario.includes('G1') || this.currentUser.usuario.includes('GRUPO_1')) {
        return 1;
      } else if (this.currentUser.usuario.includes('G2') || this.currentUser.usuario.includes('GRUPO_2')) {
        return 2;
      } else if (this.currentUser.usuario.includes('G3') || this.currentUser.usuario.includes('GRUPO_3')) {
        return 3;
      }
    }
    return 3; // Por defecto grupo 3
  }

  cargarTablaPerfeccionamiento() {
  const filtro = this.obtenerFiltroPerfeccionamiento();
  this.dataSourcePerfeccionamiento.data = [];
  this.dataSourceInformeRenovacion
  this.dataSourceHistorial.data = [];
  this.isLoading = true;

  this.serviceTablePerfeccionamiento(filtro)
    .subscribe(
      (data) => {
        const soloConEstado = data.content.filter(item =>
          item.idEstadoEval != null &&
          item.idEstadoEval.nombre != null &&
          item.idEstadoEval.nombre.trim() !== ''
        );

        this.dataSourcePerfeccionamiento.data = soloConEstado;
        if (this.paginatorPerfeccionamiento) {
          this.paginatorPerfeccionamiento.length = soloConEstado.length;
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar datos de perfeccionamiento:', error);
        this.isLoading = false;
      }
    );
}

  cargarTablaInformeRenovacion() {
    const filtro = this.obtenerFiltroInformeRenovacion();
    this.dataSourceInformeRenovacion.data = [];
    this.isLoading = true;

    this.serviceTableInformeRenovacion(filtro)
      .subscribe(
        (data) => {
          this.dataSourceInformeRenovacion.data = data.content || [];
          if (this.paginatorInformeRenovacion) {
            this.paginatorInformeRenovacion.length = data.totalElements || 0;
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Error al cargar datos de informe de renovación:', error);
          this.isLoading = false;
        }
      );
  }

  cargarTablaInformeRenovacionParaAprobar() {
    const filtro = this.obtenerFiltroInformeRenovacion();
    this.dataSourceInformeRenovacion.data = [];
    this.isLoading = true;

    this.serviceTableInformeRenovacionParaAprobar(filtro)
      .subscribe(
        (data) => {
          this.dataSourceInformeRenovacion.data = data.content || [];
          if (this.paginatorInformeRenovacion) {
            this.paginatorInformeRenovacion.length = data.totalElements || 0;
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Error al cargar datos de informe de renovación para aprobar:', error);
          this.isLoading = false;
        }
      );
  }

  cargarTablaInformeRenovacionNuevoEndpoint() {
    const filtro = this.obtenerFiltroInformeRenovacion();
    this.dataSourceInformeRenovacion.data = [];
    this.isLoading = true;

    this.serviceTableInformeRenovacionNuevoEndpoint(filtro)
      .subscribe(
        (data) => {
          this.dataSourceInformeRenovacion.data = data.content || [];
          if (this.paginatorInformeRenovacion) {
            this.paginatorInformeRenovacion.length = data.totalElements || 0;
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Error al cargar datos con nuevo endpoint de informe de renovación:', error);
          this.isLoading = false;
        }
      );
  }

  pageChangePerfeccionamiento(event: any) {
    this.cargarTablaPerfeccionamiento();
  }

  pageChangeInformeRenovacion(event: any) {
    this.cargarTablaInformeRenovacion();
  }

  compareSelecIdListadoDetalle(o1: ListadoDetalle | null, o2: ListadoDetalle | null): boolean {
    return o1 && o2 ? o1.idListadoDetalle === o2.idListadoDetalle : o1 === o2;
  }

  ver(sol: Solicitud) {
    this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_VIEW, sol.solicitudUuid]);
  }

  verPerfeccionamiento(contrato: any) {
    this.router.navigate([Link.INTRANET, Link.PERFECCIONAMIENTO_LIST, Link.PERFECCIONAMIENTO_VIEW, contrato.idContrato]);
  }

  verInformeRenovacion(informe: any) {
    this.router.navigate([Link.INTRANET, Link.INFORME_RENOVACION_LIST, Link.INFORME_RENOVACION_VIEW, informe.idInformeRenovacion]);
  }

  mostrarOpcion(accion: string) {
    return true;
  }

  procesar(sol: Solicitud) {
    this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_PROCESAR, sol.solicitudUuid]);
  }

  aprobar(sol: Solicitud) {
    this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_APROBAR, sol.solicitudUuid]);
  }

  descargarItem(item: any) {
    this.adjuntoService.descargarWindowsJWT(item.codigo, item.nombreReal);
  }

  obtenerNombre(item: any) {
    if (item.tipoArchivo?.codigo === 'TA11') return 'Solicitud';
    if (item.tipoArchivo?.codigo === 'TA13') return 'Resultado Solicitud';
    if (item.tipoArchivo?.codigo === 'TA12') return 'Subsanación';
    if (item.tipoArchivo?.codigo === 'TA14') return 'Resultado Subsanación';
    return "";
  }

  aprobar_firmar(sol: Solicitud) {
    this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_APROBAR, sol.solicitudUuid]);
  }

  flag: boolean = true;

  aprobacion_FirmaMasiva(action: string) {
    if (this.listaSolicitudUuidSeleccionado.length === 0) {
      alert('Debe seleccionar al menos una solicitud para la aprobación y firma masiva.');
      return;
    }

    this.dialog.open(ModalAprobadorFirmaAccionComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        tipo: 'solicitud',
        accion: action,
        listaNroExpedienteSeleccionado: this.listaNroExpedienteSeleccionado,
        listaSolicitudUuidSeleccionado: this.listaSolicitudUuidSeleccionado,
      },
    }).afterClosed().subscribe(result => {
      if (result === 'OK') {
        this.flag = false;
        this.buscar();
        this.listaNroExpedienteSeleccionado = [];
        this.listaSolicitudUuidSeleccionado = [];
      } else {
        this.flag = true;
      }
    });
  }

  flagContrato: boolean = true;
  aprobarVistoBuenoFirmarPerfeccionamiento(action: string) {
    if (this.listaContratosSeleccionadosPerfeccionamiento.length === 0) {
      alert('Debe seleccionar al menos un contrato para Aprobar/Visto Bueno/Firmar.');
      return;
    }

    this.dialog.open(ModalAprobadorContratoComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        tipo: 'contrato',
        accion: action,
        elementosSeleccionados: this.listaContratosSeleccionadosPerfeccionamiento,
      },
    }).afterClosed().subscribe(result => {
      if (result === 'OK') {
        this.flagContrato = false;
        this.buscarPerfeccionamiento();
        this.listaContratosSeleccionadosPerfeccionamiento = [];
      } else {
        this.flagContrato = true;
        console.log('Proceso de aprobación/firma masiva de contratos cancelado o no completado.');
      }
    });
  }

  @ViewChild('tabAprobacionHistorial') tabAprobacionHistorial: LayoutAprobacionHistorialComponent;

  actualizarListaExpediente(event: any, nroExpediente: string, solicitudUuid: string) {
    if (event.checked) {
      this.listaNroExpedienteSeleccionado.push(nroExpediente);
      this.listaSolicitudUuidSeleccionado.push(solicitudUuid);
    } else {
      const indexNro = this.listaNroExpedienteSeleccionado.indexOf(nroExpediente);
      if (indexNro > -1) {
        this.listaNroExpedienteSeleccionado.splice(indexNro, 1);
      }
      const indexUuid = this.listaSolicitudUuidSeleccionado.indexOf(solicitudUuid);
      if (indexUuid > -1) {
        this.listaSolicitudUuidSeleccionado.splice(indexUuid, 1);
      }
    }
  }

  actualizarListaExpedientePerfeccionamiento(event: any, element: any) {
  console.log('Evento de selección:', event.checked);
  console.log('Elemento seleccionado:', element);

  const selectedItem: SelectedPerfeccionamientoItem = {
    numeroExpediente: element.solicitudPerfCont.propuesta.procesoItem.proceso.numeroExpediente,
    idContrato: element.idContrato,
  };

  console.log('selectedItem a añadir/eliminar:', selectedItem);

  if (event.checked) {
    if (!this.listaContratosSeleccionadosPerfeccionamiento.some(item => item.idContrato === selectedItem.idContrato)) {
      this.listaContratosSeleccionadosPerfeccionamiento.push(selectedItem);
      console.log('Añadido. Lista actual:', this.listaContratosSeleccionadosPerfeccionamiento);
    }
  } else {
    const index = this.listaContratosSeleccionadosPerfeccionamiento.findIndex(item => item.idContrato === selectedItem.idContrato);
    if (index > -1) {
      this.listaContratosSeleccionadosPerfeccionamiento.splice(index, 1);
      console.log('Eliminado. Lista actual:', this.listaContratosSeleccionadosPerfeccionamiento);
    }
  }
  console.log('Selección Perfeccionamiento Final:', this.listaContratosSeleccionadosPerfeccionamiento);
}

  actualizarListaExpedienteInformeRenovacion(event: any, element: any) {
    console.log('Evento de selección informe renovación:', event.checked);
    console.log('Elemento seleccionado:', element);

    if (event.checked) {
      if (!this.listaInformesRenovacionSeleccionados.some(item => item.idInformeRenovacion === element.idInformeRenovacion)) {
        this.listaInformesRenovacionSeleccionados.push(element);
        console.log('Añadido informe renovación. Lista actual:', this.listaInformesRenovacionSeleccionados);
      }
    } else {
      const index = this.listaInformesRenovacionSeleccionados.findIndex(item => item.idInformeRenovacion === element.idInformeRenovacion);
      if (index > -1) {
        this.listaInformesRenovacionSeleccionados.splice(index, 1);
        console.log('Eliminado informe renovación. Lista actual:', this.listaInformesRenovacionSeleccionados);
      }
    }
    console.log('Selección Informe Renovación Final:', this.listaInformesRenovacionSeleccionados);
  }

historyApproveAndSignPerfeccionamiento(row: any) {
    this.dialog.open(ModalAprobadorHistorialContratoComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        idContrato: row.idContrato
      }
    });
  }

  flagInformeRenovacion: boolean = true;
  aprobarVistoBuenoFirmarInformeRenovacion(action: string) {
    if (this.listaInformesRenovacionSeleccionados.length === 0) {
      alert('Debe seleccionar al menos un informe de renovación para Aprobar/Visto Bueno/Firmar.');
      return;
    }

    this.dialog.open(ModalAprobadorInformeRenovacionComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        tipo: 'informeRenovacion',
        accion: action,
        elementosSeleccionados: this.listaInformesRenovacionSeleccionados,
      },
    }).afterClosed().subscribe(result => {
      if (result === 'OK') {
        this.flagInformeRenovacion = false;
        this.buscarInformeRenovacion();
        this.listaInformesRenovacionSeleccionados = [];
      } else {
        this.flagInformeRenovacion = true;
        console.log('Proceso de aprobación/firma masiva de informes de renovación cancelado o no completado.');
      }
    });
  }

  historyApproveAndSignInformeRenovacion(row: any) {
    this.dialog.open(ModalAprobadorHistorialContratoComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        idInformeRenovacion: row.idInformeRenovacion
      }
    });
  }

  redireccionAProbarPaces() {
    this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.SOLICITUDES_LIST_APROBACION_PACES]);
  }

  getRangoMensual(): { fecha_desde: string, fecha_hasta: string } {
    const ahora = new Date();
    const primerDia = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const ultimoDia = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);
    
    return {
      fecha_desde: this.formatDate(primerDia),
      fecha_hasta: this.formatDate(ultimoDia)
    };
  }
  
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  obtenerFiltroHistorialInformeRenovacion() {
    let filtroInformeRenovacion: any = {
      ...this.getRangoMensual(),
      resultado: null,
      documento_id:null ,
      grupo: null,
      page: this.paginatorHistoriaInformeRenovacion?.pageIndex ?? 0,
      size: this.paginatorHistoriaInformeRenovacion?.pageSize ?? 10,
    };
    return filtroInformeRenovacion;
  }

  pageChangeHistorialInformeRenovacion(event: any) {
    this.historialAprobaciones();
  }

  historialAprobaciones(){
    this.mostrarHistorial = !this.mostrarHistorial;
    this.mostrarCards = !this.mostrarCards;

    const filtro = this.obtenerFiltroHistorialInformeRenovacion();
    console.log('historialAprobaciones', filtro);

    this.dataSourceHistorial.data = [];
    this.isLoading = true;

    this.solicitudService.buscarHistorialAprobacionesInformesRenovacion(filtro)
      .subscribe(
        (data) => {
          console.log('historialAprobaciones', JSON.stringify(data));
          this.dataSourceHistorial.data = data.historial_aprobaciones || [];
          if (this.paginatorHistoriaInformeRenovacion) {
            this.paginatorHistoriaInformeRenovacion.length = data.total_registros || 0;
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Error al cargar historial de aprobaciones de informe de renovación:', error);
          this.isLoading = false;
        }
      );
  }

  returnTabView(){
    this.mostrarHistorial = !this.mostrarHistorial;
    this.mostrarCards = !this.mostrarCards;
  }
  irAInformeRenovacion() {
    this.selectedTabIndex = 2; 
  }
}
