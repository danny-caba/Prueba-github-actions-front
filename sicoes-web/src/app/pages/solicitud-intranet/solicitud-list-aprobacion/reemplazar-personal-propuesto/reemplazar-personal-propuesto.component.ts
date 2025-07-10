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
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { Contrato, SelectedPerfeccionamientoItem } from 'src/app/interface/contrato.model';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalAprobadorFirmaAccionComponent } from 'src/app/shared/modal-aprobador-firma-accion/modal-aprobador-firma-accion.component';
import { LayoutAprobacionHistorialComponent } from 'src/app/shared/layout-aprobacion-historial/layout-aprobacion-historial.component';
import { ModalAprobadorHistorialContratoComponent } from 'src/app/shared/modal-aprobador-historial-contrato/modal-aprobador-historial-contrato.component';
import { ModalAprobadorPersonalComponent } from 'src/app/shared/modal-aprobador-personal/modal-aprobador-personal.component';
import { ModalInformativoComponent } from 'src/app/shared/modal-informativo/modal-informativo.component';

@Component({
  selector: 'reemplazar-personal-propuesto',
  templateUrl: './reemplazar-personal-propuesto.component.html',
  styleUrls: ['./reemplazar-personal-propuesto.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ReemplazarPersonalComponent extends BasePageComponent<Solicitud> implements OnInit {

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;
  SOLICITUD: any;
  tipousuario="GL"

  ACC_HISTORIAL = 'ACC_HISTORIAL';
  ACC_REGISTRAR = 'ACC_REGISTRAR';
  ACC_EDITAR = 'ACC_EDITAR';
  ACC_VER = 'ACC_VER';

  formGroup = this.fb.group({
    nroExpediente: [''],
    contratista: [''],
    tipoSolicitud: [null],
    tipoAprobacion:[null],
    estadoAprobacion: [null]
  });

  listContratista:any[];
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


  displayedColumnsPersonal: string[] = [
    'select',
    'tipoAprobacion',
    'numeroExpediente',
    'documento',
    'tp',
    'contratista',
    'tipoSolicitud',
    'fechaIngreso',
    'estadoAprobacion',
    'estadoAprobacionLogistica',
    'estadoVbGAF',
    'actionsPersonal'
  ];

  dataSourceReemplazar = new MatTableDataSource<any>();
 

  @ViewChild('paginatorReemplazar') paginatorReemplazar: MatPaginator;

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
     this.dataSourceReemplazar.data=[{'tipoAprobacion':"Aprobar",
    'numeroExpediente':"1234",
    'documento':"fecha.pdf",
    'tp':"PJ",
    'contratista':"Volvo peru",
    'tipoSolicitud':"",
    'fechaIngreso':"17/12/2024",
    'estadoAprobacion':"Aprobado",
    'estadoAprobacionLogistica':"",
    'estadoVbGAF':"",}]
    //this.cargarTabla();
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
      //idEstadoRevision: this.formGroup.controls.estadoRevision.value?.idListadoDetalle,
      //idEstadoEvaluacionTecnica: this.formGroup.controls.estadoEvalTecnica.value?.idListadoDetalle,
      //idEstadoEvaluacionAdministrativa: this.formGroup.controls.estadoEvalAdministrativa.value?.idListadoDetalle,
      nroExpediente: this.formGroup.controls.nroExpediente.value,
     // solicitante: this.formGroup.controls.solicitante.value,
    };
    return filtro;
  }

  verPersonal(contrato: any) {
    this.router.navigate([Link.INTRANET, Link.PERFECCIONAMIENTO_LIST, Link.PERFECCIONAMIENTO_VIEW, contrato.idContrato]);
  }



  descargarItem(item: any) {
    this.adjuntoService.descargarWindowsJWT(item.codigo, item.nombreReal);
  }


  aprobar_firmar(sol: Solicitud) {
    this.router.navigate([Link.INTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_APROBAR, sol.solicitudUuid]);
  }

  flagContrato: boolean = true;
  aprobarPersonal(action: string) {
    if (this.listaContratosSeleccionadosPerfeccionamiento.length == 0) {
      this.modalInformativo('Debe seleccionar al menos un contrato para Aprobar/Visto Bueno/Firmar.');
      return;
    }

    if (this.listaContratosSeleccionadosPerfeccionamiento.length > 1) {
      this.modalInformativo('Debe seleccionar solo un contrato para Aprobar/Visto Bueno/Firmar.');
      return;
    }

    this.dialog.open(ModalAprobadorPersonalComponent, {
      width: '1000px',
      maxHeight: '100%',
      data: {
        tipo: 'contrato',
        accion: action,
        elementosSeleccionados: this.listaContratosSeleccionadosPerfeccionamiento,
      },
    }).afterClosed().subscribe(result => {
      if (result === 'OK') { 
        this.flagContrato = false;
        this.buscar(); 
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

  actualizarListaExpedientePersonal(event: any, element: any) {
  console.log('Evento de selección:', event.checked);
  console.log('Elemento seleccionado:', element);

  const selectedItem: SelectedPerfeccionamientoItem = {
    numeroExpediente: element.numeroExpediente,
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

historyApproveAndSignPersonal(row: any) {
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

  modalInformativo(descripcion: string){
    this.dialog.open(ModalInformativoComponent, {
      width: '600px',
      maxHeight: '90%',
      data: {
        title: 'Mensaje Informativo',
        description: descripcion,
        titleConfirm:"Aceptar"
      },
    })
  }
}