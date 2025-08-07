import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator'; 
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { ListadoEnum, UsuariosRoles } from 'src/helpers/constantes.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { SolicitudService } from 'src/app/service/solicitud.service'; 
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
import { ModalAprobadorContratoComponent } from 'src/app/shared/modal-aprobador-contrato/modal-aprobador-contrato.component';
import { ModalAprobadorHistorialContratoComponent } from 'src/app/shared/modal-aprobador-historial-contrato/modal-aprobador-historial-contrato.component';

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

  formGroupPerfeccionamiento = this.fb.group({
    nroExpedienteP: [''],
    contratistaP: [''],
    tipoContratoP: [null],
    tipoAprobacionP: [null],
    estadoAprobacionP: [null]
  });

  listTipoSolicitud: any[];
  listEstadoRevision: any[];
  listEstadoEvaluacionTecnica: any[];
  listEstadoEvaluacionAdminis: any[];
  listEstadoAprobacion: any[];

  listTipoContrato: any[];
  listTipoAprobacionP: any[];
  listEstadoAprobacionP: any[];

  listaNroExpedienteSeleccionado: string[] = [];
  listaSolicitudUuidSeleccionado: string[] = [];

  listaContratosSeleccionadosPerfeccionamiento: SelectedPerfeccionamientoItem[] = [];

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

  usuario:any[]=[];
  idRoles: number[] = [];
  roles=UsuariosRoles;
  dataSourcePerfeccionamiento = new MatTableDataSource<any>();

  @ViewChild('paginatorPerfeccionamiento') paginatorPerfeccionamiento: MatPaginator;

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
    this.usuario = JSON.parse(sessionStorage.getItem("rolesusuario") || "[]");
    this.idRoles = this.usuario.map(u => u.idRol);
    console.log("this.idRoles",this.idRoles)
    this.cargarCombo();
    this.cargarTabla();
    this.cargarTablaPerfeccionamiento();
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.TIPO_SOLICITUD,
      ListadoEnum.ESTADO_REVISION,
      ListadoEnum.RESULTADO_EVALUACION_TEC_ADM,
      ListadoEnum.TIPO_CONTRATO,
      ListadoEnum.TIPO_APROBACION_PERFECCIONAMIENTO,
      ListadoEnum.ESTADO_APROBACION_PERFECCIONAMIENTO
    ]).subscribe(listRes => {
      this.listTipoSolicitud = listRes[0];
      this.listEstadoRevision = listRes[1];
      this.listEstadoEvaluacionTecnica = listRes[2];
      this.listEstadoEvaluacionAdminis = listRes[2];

      this.listTipoContrato = listRes[3];
      this.listTipoAprobacionP = listRes[4];
      this.listEstadoAprobacionP = listRes[5];
    });


  }

  serviceTable(filtro) {
    return this.solicitudService.buscarSolicitudesAprobador(filtro);
  }

  serviceTablePerfeccionamiento(filtroPerfeccionamiento: any) {
    return this.solicitudService.buscarSolicitudesAprobadorPerfeccionamiento(filtroPerfeccionamiento);
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

  limpiar() {
    this.formGroup.reset();
    this.buscar();
  }

  limpiarPerfeccionamiento() {
    this.formGroupPerfeccionamiento.reset();
    this.listaContratosSeleccionadosPerfeccionamiento = [];
    this.buscarPerfeccionamiento();
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

  cargarTablaPerfeccionamiento() {
  const filtro = this.obtenerFiltroPerfeccionamiento();
  this.dataSourcePerfeccionamiento.data = [];
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

  pageChangePerfeccionamiento(event: any) {
    this.cargarTablaPerfeccionamiento();
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

historyApproveAndSignPerfeccionamiento(row: any) {
    this.dialog.open(ModalAprobadorHistorialContratoComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        idContrato: row.idContrato
      }
    });
  }

  redireccionAProbarPaces() {
    this.router.navigate([Link.INTRANET, Link.PROCESOS_LIST, Link.SOLICITUDES_LIST_APROBACION_PACES]);
  }
}