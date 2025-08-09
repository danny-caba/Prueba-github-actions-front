import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { EstadoRequerimientoEnum } from 'src/helpers/constantes.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { ParametriaService } from 'src/app/service/parametria.service';
import { Division } from 'src/app/interface/division.model';
import { GestionUsuarioService } from 'src/app/service/gestion-usuarios.service';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ModalCrearRequerimientoComponent } from 'src/app/shared/modal-crear-requerimiento/modal-crear-requerimiento.component';
import { RequerimientoService } from 'src/app/service/requerimiento.service';
import { Requerimiento } from 'src/app/interface/requerimiento.model';
import { ModalArchivarRequerimientoComponent } from 'src/app/shared/modal-archivar-requerimiento/modal-archivar-requerimiento.component';
import { REQUERIMIENTO_CONSTANTS } from 'src/helpers/requerimiento.constants';

@Component({
  selector: 'vex-requerimiento-list',
  templateUrl: './requerimiento-list.component.html',
  styleUrls: ['./requerimiento-list.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class RequerimientoListComponent extends BasePageComponent<Requerimiento> implements OnInit, OnDestroy {

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;
  dateHoy = new Date();

  ACC_NUEVO_REQUERIMIENTO = 'ACC_NUEVO_REQUERIMIENTO';
  ACC_ELABORAR_INFORME = 'ACC_ELABORAR_INFORME';
  ACC_ENVIAR_INVITACION = 'ACC_ENVIAR_INVITACION';
  ACC_ARCHIVAR_REQUERIMIENTO = 'ACC_ARCHIVAR_REQUERIMIENTO';

  formGroup = this.fb.group({
    fechaInicio: [''],
    fechaFin:    ['', this.fechaFinValidator()],
    division:    [null],
    perfil:       [null]
  });

  listDivision: Division[] = [];
  dataSourcePerfil = new MatTableDataSource<any>();
  listAllPerfilesDetalle: any;

  // Lista filtrada por división actual
  listPerfilesFiltradosPorDivision: any[] = [];
  filteredStatesTecnico$: Observable<any[]>;

  displayedColumns: string[] = [...REQUERIMIENTO_CONSTANTS.COLUMNAS_LISTA_REQUERIMIENTOS];

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
    private gestionUsuarioService: GestionUsuarioService,
    private dialog: MatDialog,
    private requerimientoService: RequerimientoService
  ) {
    super();
  }

  ngOnInit(): void {
    this.cargarCombo();
    this.cargarTabla();
    this.setupFechaValidators();
  }

  ngOnDestroy(): void {
  }

  cargarCombo() {
    // Cargar divisiones
    this.parametriaService.listarDivisiones().subscribe(res => {
      this.listDivision = res;
    });

    // Cargar perfiles
    this.gestionUsuarioService.listarPerfilesDetalle()
    .subscribe(respuesta => {
      // Filtramos solamente los perfiles S4
      this.dataSourcePerfil.data = respuesta.filter(perfil => perfil.dePerfil.toUpperCase().includes('PERFIL S4'));
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

  // Servicio para cargar la tabla de requerimientos
  serviceTable(filtro) {
    return this.requerimientoService.listarRequerimientos(filtro);
  }

  buscar() {
    this.paginator.pageIndex = 0;
    this.cargarTabla();
  }

  limpiar() {
    this.formGroup.reset();
    this.cargarCombo();
    this.buscar();
  }

  obtenerFiltro() {
    let filtro: any = {
      division:    this.formGroup.controls.division?.value?.idDivision,
      perfil:       this.formGroup.controls.perfil?.value?.idListadoDetalle,
      fechaInicio: this.formGroup.controls.fechaInicio.value,
      fechaFin:    this.formGroup.controls.fechaFin.value,
    }
    return filtro;
  }

  crearRequerimiento(accion: string) {
    this.dialog
      .open(ModalCrearRequerimientoComponent, {
        disableClose: true,
        width: "800px",
        maxHeight: "auto",
        data: {
          accion,
          perfiles: this.listAllPerfilesDetalle
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.cargarTabla();
          this.paginator.firstPage();
        }
      });
  }

  archivarRequerimiento(req: Requerimiento) {
    this.dialog
    .open(ModalArchivarRequerimientoComponent, {
      disableClose: true,
      width: "400px",
      maxHeight: "auto",
      data: {
        accion: 'Archivar Requerimiento',
        uuid: req.requerimientoUuid
      },
    })
    .afterClosed()
    .subscribe((result) => {
      if (result) {
        this.cargarTabla();
        this.paginator.firstPage();
      }
    });
  }

  mostrarOpcion(opt, objReq) {
    // Validaciones de acciones
    if(opt == this.ACC_ELABORAR_INFORME && 
      this.preliminarEnabled(objReq)) return true;

    if(opt == this.ACC_ENVIAR_INVITACION && 
      this.enProcesoEnabled(objReq)) return true;

    if(opt == this.ACC_ARCHIVAR_REQUERIMIENTO && 
      this.enProcesoEnabled(objReq)) return true;

    return false;
  }

  displayFn(codi: any): string {
    return codi && codi.dePerfil ? codi.dePerfil : '';
  }

  blurEvaluadorTecnico() {
    setTimeout(() => {
      if (!(this.formGroup.controls.perfil.value instanceof Object)) {
        this.formGroup.controls.perfil.setValue("");
        this.formGroup.controls.perfil.markAsTouched();
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
  preliminarEnabled(req: Requerimiento) {
    // return req.estado?.codigo == EstadoRequerimientoEnum.PRELIMINAR;
    return REQUERIMIENTO_CONSTANTS.ESTADO_VALIDACIONES[EstadoRequerimientoEnum.PRELIMINAR](req);
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
  elaborarInforme(req: Requerimiento) {
    this.router.navigate([Link.INTRANET, Link.REQUERIMIENTOS_LIST, Link.REQUERIMIENTOS_INFORME, Link.INFORME_ADD, req.requerimientoUuid]);
  }

  enviarInvitacion(req: Requerimiento) {
    this.requerimientoService.setRequerimiento(req);
    this.router.navigate([Link.INTRANET, Link.REQUERIMIENTOS_LIST, Link.REQUERIMIENTOS_INVITACION, Link.INVITACION_SEND, req.requerimientoUuid]);
  }

}
