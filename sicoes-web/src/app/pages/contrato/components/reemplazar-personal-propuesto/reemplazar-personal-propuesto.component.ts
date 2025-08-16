import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { ListadoEnum, REQUERIMIENTO, UsuariosRoles } from 'src/helpers/constantes.components';
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
import { debounceTime, distinctUntilChanged, filter, map, Observable, startWith, switchMap } from 'rxjs';
import { SelectedReemplazarItem } from 'src/app/interface/reemplazo-personal.model';

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

  @Input() usuario: any;
  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;
  SOLICITUD: any;
  tipousuario = "GL"

  ACC_HISTORIAL = 'ACC_HISTORIAL';
  ACC_REGISTRAR = 'ACC_REGISTRAR';
  ACC_EDITAR = 'ACC_EDITAR';
  ACC_VER = 'ACC_VER';

  formGroup = this.fb.group({
    nroExpediente: [''],
    contratista: [''],
    tipoSolicitud: [null],
    tipoAprobacion: [null],
    estadoAprobacion: [null]
  });

  listContratista: any[];
  listTipoSolicitud: any[];
  listTipoAprobacionP: any[];
  listEstadoAprobacionP: any[];
  idRoles: number[] = [];
  roles = UsuariosRoles;
  listaContratosSeleccionadosPerfeccionamiento: SelectedReemplazarItem[] = [];


  displayedColumnsPersonal: string[] = [
    'tipoAprobacion',
    'numeroExpediente',
    'documento',
    'tp',
    'contratista',
    'tipoSolictiud',
    'fechaIngreso',
    'estadoAprobacion',
    'estadoAprobacionLogistica',
    'estadoVbGAF',
    'actionsPersonal'
  ];

  dataSourceReemplazar = new MatTableDataSource<any>();
  filteredContratistas!: Observable<any[]>;

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
    this.dataSourceReemplazar.data = []
    //this.cargarTabla();
    this.filteredContratistas = this.formGroup.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.contratista),
      map(nombre => nombre ? this._filterContratistas(nombre) : this.listContratista.slice())
    );


    this.filteredContratistas = this.formGroup.get('contratista')!.valueChanges.pipe(
      filter(value => typeof value === 'string' && value.length >= 3),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.solicitudService.buscarContratista(value))
    );

    this.usuario = JSON.parse(sessionStorage.getItem("rolesusuario") || "[]");
    this.idRoles = this.usuario.map(u => u.idRol);
    console.log("this.usuario", this.usuario);

    this.buscar();
  }
  private _filterContratistas(nombre: string): any[] {
    const filterValue = nombre.toLowerCase();
    return this.listContratista.filter(option => option.valor.toLowerCase().includes(filterValue));
  }

  displayContratista(obj: any): string {
    return obj && obj.valor ? obj.valor : '';
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.TIPO_SOLICITUD,
      ListadoEnum.TIPO_APROBACION,
      ListadoEnum.ESTADO_APROBACION_REEMP
    ]).subscribe(listRes => {
      this.listTipoSolicitud = listRes[0];
      this.listTipoAprobacionP = listRes[1];
      this.listEstadoAprobacionP = listRes[2];
    });
  }

  serviceTable(filtro) {
    return this.solicitudService.buscarSolicitudesAprobador(filtro);
  }

  buscar() {
    this.paginator.pageIndex = 0;
    let requerimiento = "";
    if (this.idRoles.includes(this.roles.GER_G2)) {
      requerimiento = REQUERIMIENTO.EVAL_INFO_APROB_G2_GER_DIV;
    } else if (this.idRoles.includes(this.roles.GER_03)) {
      requerimiento = REQUERIMIENTO.EVAL_INFO_APROB_G3_GER_LIN;
    }

    this.solicitudService.buscarAprobaciones(
      requerimiento,
      this.getValidNumber('tipoAprobacion'),
      this.getValidNumber('estadoAprobacion'),
      this.getValidNumber('tipoSolicitud'),
      this.getValidNumber('contratista'),
      this.getValidNumber('nroExpediente')
    ).subscribe(resp => {
      this.dataSourceReemplazar.data = resp;
      this.paginatorReemplazar.length = this.dataSourceReemplazar.data.length;
    });
  }

  getValidNumber(controlName: string): number | null {
    const value = this.formGroup.get(controlName)?.value;

    // Si el valor es un objeto con la propiedad 'orden', usamos esa propiedad
    if (value && typeof value === 'object' && 'orden' in value) {
      return value.idListadoDetalle !== null && value.idListadoDetalle !== undefined && value.idListadoDetalle !== '' ? Number(value.idListadoDetalle) : null;
    }
    if (controlName == 'contratista') {
      return value.id !== null && value.id !== undefined && value.id !== '' ? Number(value.id) : null;
    }

    // Si no es objeto, validamos directamente
    return value !== null && value !== undefined && value !== '' ? Number(value) : null;
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
        tipo: this.idRoles,
        accion: action,
        elementosSeleccionados: this.listaContratosSeleccionadosPerfeccionamiento,
      },
    }).afterClosed().subscribe(result => {
      console.log(result);
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



  actualizarListaExpedientePersonal(event: any, element: any) {
    console.log('Evento de selección:', event.checked);
    console.log('Elemento seleccionado:', element);

    const selectedItem: SelectedReemplazarItem = {
      estadoAprob: element.idEsAprob,
      idAprobacion: element.id,
      idArchivo:element.idArchivo
    };

    console.log('selectedItem a añadir/eliminar:', selectedItem);

    if (event.checked) {
      if (!this.listaContratosSeleccionadosPerfeccionamiento.some(item => item.idAprobacion === selectedItem.idAprobacion)) {
        this.listaContratosSeleccionadosPerfeccionamiento.push(selectedItem);
        console.log('Añadido. Lista actual:', this.listaContratosSeleccionadosPerfeccionamiento);
      }
    } else {
      const index = this.listaContratosSeleccionadosPerfeccionamiento.findIndex(item => item.idAprobacion === selectedItem.idAprobacion);
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

  modalInformativo(descripcion: string) {
    this.dialog.open(ModalInformativoComponent, {
      width: '600px',
      maxHeight: '90%',
      panelClass: 'abarca-cabecera',
      data: {
        title: 'Mensaje Informativo',
        description: descripcion,
        titleConfirm: "Aceptar"
      },
    })
  }

  descargar(id: string, nombre: string) {
    console.log("entrando a descargar", id);
    if (id != undefined && id != null) {
      this.adjuntoService.descargarWindowsJWT(id, nombre);
    }else{
      this.modalInformativo('No existe Archivo para descargar');
    }

  }
}