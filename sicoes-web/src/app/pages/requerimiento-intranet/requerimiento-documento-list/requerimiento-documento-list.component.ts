import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { EstadoRequerimientoEnum, ListadoEnum } from 'src/helpers/constantes.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { ParametriaService } from 'src/app/service/parametria.service';
import { RequerimientoService } from 'src/app/service/requerimiento.service';
import { Requerimiento, RequerimientoDocumento } from 'src/app/interface/requerimiento.model';
import { REQUERIMIENTO_CONSTANTS } from 'src/helpers/requerimiento.constants';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { Division } from 'src/app/interface/division.model';
import { MatTableDataSource } from '@angular/material/table';
import { GestionUsuarioService } from 'src/app/service/gestion-usuarios.service';
import { SupervisoraService } from 'src/app/service/supervisora.service';

@Component({
  selector: 'vex-requerimiento-documento-list',
  templateUrl: './requerimiento-documento-list.component.html',
  styleUrls: ['./requerimiento-documento-list.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class RequerimientoDocumentoListComponent extends BasePageComponent<Requerimiento> implements OnInit, OnDestroy {

  @Input() tabActivo$: Observable<boolean>;
  private tabSubscription: Subscription;

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;
  dateHoy = new Date();

  ACC_EVALUAR_DOCUMENTO = 'ACC_EVALUAR_DOCUMENTO';

  formGroup = this.fb.group({
    fechaInicio: [''],
    fechaFin:    ['', this.fechaFinValidator()],
    division:    [null],
    perfil:      [null],
    estado:      [null],
    supervisor:  [null]
  });

  listEstadoReqDocumento: ListadoDetalle[] = [];
  displayedColumns: string[] = [...REQUERIMIENTO_CONSTANTS.COLUMNAS_LISTA_REQUERIMIENTOS_DOCUMENTOS_INTRANET];

  listDivision: Division[] = [];
  dataSourcePerfil = new MatTableDataSource<any>();
  listAllPerfilesDetalle: any;
  dataSourceSupervisor = new MatTableDataSource<any>();
  listAllSupervisores: any;
  // Lista filtrada por división actual
  listPerfilesFiltradosPorDivision: any[] = [];
  filteredStatesTecnico$: Observable<any[]>;
  filteredSupervisores$: Observable<any[]>;
  listSupervisoresFiltradosPorPerfil: any[] = [];

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
    private requerimientoService: RequerimientoService,
    private gestionUsuarioService: GestionUsuarioService,
    private supervisoraService: SupervisoraService
  ) {
    super();
  }

  ngOnInit(): void {
    this.cargarCombo();
    this.cargarTabla();
    this.setupFechaValidators();
  }

  ngOnDestroy(): void {
    if (this.tabSubscription) {
      this.tabSubscription.unsubscribe();
    }
  }

  cargarCombo() {
    const dataString = sessionStorage.getItem('ESTADO_REQ_DOCUMENTO');
    if(dataString){
      this.listEstadoReqDocumento = JSON.parse(dataString);
    } else {
      this.parametriaService.obtenerMultipleListadoDetalle([
        ListadoEnum.ESTADO_REQ_DOCUMENTO
      ]).subscribe(res => {
        this.listEstadoReqDocumento = res[0];
      });
    }

    // Cargar divisiones
    this.parametriaService.listarDivisiones().subscribe(res => {
      this.listDivision = res;
    });

    // Cargar perfiles
    this.gestionUsuarioService.listarPerfilesDetalle()
    .subscribe(respuesta => {
      this.dataSourcePerfil.data = respuesta;
      this.listAllPerfilesDetalle = this.dataSourcePerfil.data;
      this.setListPerfilesDetalle(this.listAllPerfilesDetalle);
    });
  }

  setListPerfilesDetalle(list: any) {
    // Guardamos la lista de perfiles filtrados por división
    this.listPerfilesFiltradosPorDivision = list;

    // Filtrar perfiles
    this.filteredStatesTecnico$ = this.formGroup.controls.perfil.valueChanges.pipe(
      startWith(''),
      map((value: any) => typeof value === 'string' ? value : value?.detalle),
      map(state => state ? this.filterStatesTec(state) : this.listPerfilesFiltradosPorDivision.slice())
    );
  }

  filterStatesTec(nombreUsuario: string) {
    // Filtramos únicamente entre los perfiles de la división seleccionada
    return this.listPerfilesFiltradosPorDivision.filter(state =>
      state.dePerfil?.toLowerCase().indexOf(nombreUsuario?.toLowerCase()) >= 0);
  }

  serviceTable(filtro) {
    return this.requerimientoService.listarDocumentosCoordinador(filtro);
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
      estado: this.formGroup.controls.estado?.value?.idListadoDetalle,
      fechaInicio: this.formGroup.controls.fechaInicio.value,
      fechaFin:    this.formGroup.controls.fechaFin.value,
    }
    return filtro;
  }

  mostrarOpcion(opt, objReq) {
    // Validaciones de acciones
    if(opt == this.ACC_EVALUAR_DOCUMENTO && 
      this.enProcesoEnabled(objReq)) return true;

    return false;
  }

  displayFn(codi: any): string {
    return codi && codi.dePerfil ? codi.dePerfil : '';
  }

  displayFnSupervisor(supervisor: any): string {
    return supervisor && supervisor.nombre ? supervisor.nombre : '';
  }

  blurEvaluadorTecnico() {
    setTimeout(() => {
      if (!(this.formGroup.controls.perfil.value instanceof Object)) {
        this.formGroup.controls.perfil.setValue("");
        this.formGroup.controls.perfil.markAsTouched();
      }
    }, 200);
  }

  blurSupervisor() {
    setTimeout(() => {
      if (!(this.formGroup.controls.supervisor.value instanceof Object)) {
        this.formGroup.controls.supervisor.setValue("");
        this.formGroup.controls.supervisor.markAsTouched();
      }
    }, 200);
  }

  listarPerfilesPorDivision(event) {
    // Limpiamos el perfil seleccionado
    this.formGroup.get('perfil').setValue('');
    
    if (!event.value || !event.value.idDivision) {
      // Si no hay división seleccionada, limpiamos la lista de perfiles
      this.setListPerfilesDetalle([]);
      return;
    }
    
    // Filtramos los perfiles por la división seleccionada
    const perfilesPorDivision = this.listAllPerfilesDetalle.filter(perfil => 
      perfil.idDivision === event.value.idDivision
    );
    
    // Actualizamos la lista filtrada y configuramos el observable
    this.setListPerfilesDetalle(perfilesPorDivision);
  }

  // Validador personalizado para fechaHasta
  fechaFinValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null;
      }
      
      const fechaFinValue = control.value;
      if (!fechaFinValue) {
        return null;
      }
      
      const fechaInicioValue = control.parent.get('fechaInicio')?.value;
      if (!fechaInicioValue) {
        return null;
      }
      
      const fechaInicio = new Date(fechaInicioValue);
      const fechaFin = new Date(fechaFinValue);
      
      return fechaFin < fechaInicio ? { fechaInvalida: true } : null;
    };
  }
  
  setupFechaValidators() {
    // Observar cambios en fechaInicio para revalidar fechaFin
    this.formGroup.controls.fechaInicio.valueChanges.subscribe(fechaInicio => {
      if (fechaInicio) {
        // Volver a validar fechaFin cuando cambie fechaInicio
        this.formGroup.controls.fechaFin.updateValueAndValidity();
      }
    });
    
    // También validar cuando el usuario introduce manualmente una fecha
    this.formGroup.controls.fechaFin.valueChanges.subscribe(fechaFin => {
      if (fechaFin) {
        const fechaInicio = this.formGroup.controls.fechaInicio.value;
        if (fechaInicio && new Date(fechaFin) < new Date(fechaInicio)) {
          // Marca el campo como inválido pero no reseteamos el valor para que el usuario vea el error
          this.formGroup.controls.fechaFin.markAsDirty();
          this.formGroup.controls.fechaFin.markAsTouched();
        }
      }
    });
  }
  
  // Obtener la fecha mínima para fechaFin basada en fechaInicio
  getFechaMinima() {
    const fechaInicio = this.formGroup.controls.fechaInicio.value;
    return fechaInicio ? fechaInicio : '1900-01-01';
  }

  // Validaciones de estado de requerimiento
  preliminarEnabled(reqDoc: RequerimientoDocumento) {
    // return req.estado?.codigo == EstadoRequerimientoEnum.PRELIMINAR;
    return REQUERIMIENTO_CONSTANTS.ESTADO_VALIDACIONES[EstadoRequerimientoEnum.PRELIMINAR](reqDoc);
  }

  enProcesoEnabled(req: Requerimiento) {
    // return req.estado?.codigo == EstadoRequerimientoEnum.EN_PROCESO;
    return REQUERIMIENTO_CONSTANTS.ESTADO_VALIDACIONES[EstadoRequerimientoEnum.EN_PROCESO](req);
  }

  accionesEnabled(req: Requerimiento) {
    return REQUERIMIENTO_CONSTANTS.ESTADOS_CON_ACCIONES.some(estado => 
      REQUERIMIENTO_CONSTANTS.ESTADO_VALIDACIONES[estado](req)
    );
  }

  // Acciones
  evaluarDocumento(doc: RequerimientoDocumento) {
    this.router.navigate([Link.INTRANET, Link.REQUERIMIENTOS_LIST, 
      Link.REQUERIMIENTOS_DOCUMENTO, Link.DOCUMENTO_EVALUAR, doc.requerimientoDocumentoUuid]);
  }

  setListSupervisores(list: any) {
    this.listSupervisoresFiltradosPorPerfil = list;

    this.filteredSupervisores$ = this.formGroup.controls.supervisor.valueChanges.pipe(
      startWith(''),
      map((value: any) => typeof value === 'string' ? value : value?.nombres),
      map(supervisor => supervisor ? this.filterSupervisores(supervisor) : this.listSupervisoresFiltradosPorPerfil.slice())
    );
  }

  filterSupervisores(nombreUsuario: string) {
    return this.listSupervisoresFiltradosPorPerfil.filter(supervisor =>
      supervisor.nombres?.toLowerCase().indexOf(nombreUsuario?.toLowerCase()) >= 0);
  }

  listarSupervisoresPorPerfil() {
    this.formGroup.get('supervisor').setValue('');

    const perfilSeleccionado = this.formGroup.controls.perfil.value;
    if (!perfilSeleccionado || !perfilSeleccionado.idListadoDetalle) {
      // Si no hay perfil seleccionado o no tiene idListadoDetalle, limpiar la lista de supervisores
      this.setListSupervisores([]);
      return;
    }

    this.supervisoraService.listarProfesionalesPerfil(perfilSeleccionado.idListadoDetalle)
      .subscribe(respuesta => {
        this.dataSourceSupervisor.data = respuesta;
        this.listAllSupervisores = this.dataSourceSupervisor.data;
        this.setListSupervisores(respuesta);
      });
  }

  onPerfilSelected() {
    console.log('onPerfilSelected');
    this.formGroup.get('supervisor').setValue('');
    this.listarSupervisoresPorPerfil();
  }

}
