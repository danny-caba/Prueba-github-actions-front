import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { EstadoReqDocumentoEnum, ListadoEnum } from 'src/helpers/constantes.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { ParametriaService } from 'src/app/service/parametria.service';
import { RequerimientoService } from 'src/app/service/requerimiento.service';
import { Requerimiento, RequerimientoDocumento } from 'src/app/interface/requerimiento.model';
import { REQUERIMIENTO_CONSTANTS } from 'src/helpers/requerimiento.constants';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { Observable, Subscription } from 'rxjs';

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

  ACC_CARGAR_DOCUMENTO = 'ACC_CARGAR_DOCUMENTO';

  formGroup = this.fb.group({
    fechaInicio: [''],
    fechaFin: ['', this.fechaFinValidator()],
    estado: [null]
  });

  listEstadoReqDocumento: ListadoDetalle[] = [];
  displayedColumns: string[] = [...REQUERIMIENTO_CONSTANTS.COLUMNAS_LISTA_REQUERIMIENTOS_DOCUMENTOS];

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
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
    if (this.tabSubscription) {
      this.tabSubscription.unsubscribe();
    }
  }

  cargarCombo() {
    const dataString = sessionStorage.getItem('ESTADO_REQ_DOCUMENTO');
    if (dataString) {
      this.listEstadoReqDocumento = JSON.parse(dataString);
    } else {
      this.parametriaService.obtenerMultipleListadoDetalle([
        ListadoEnum.ESTADO_REQ_DOCUMENTO
      ]).subscribe(res => {
        this.listEstadoReqDocumento = res[0];
      });
    }
  }

  serviceTable(filtro) {
    return this.requerimientoService.listarDocumentos(filtro);
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
      fechaFin: this.formGroup.controls.fechaFin.value,
    }
    return filtro;
  }

  mostrarOpcion(opt, objReq) {
    // Validaciones de acciones
    if (opt == this.ACC_CARGAR_DOCUMENTO &&
      this.preliminarEnabled(objReq)) return true;

    return false;
  }

  displayFn(codi: any): string {
    return codi && codi.dePerfil ? codi.dePerfil : '';
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
    return REQUERIMIENTO_CONSTANTS.ESTADO_VALIDACIONES_DOCUMENTO[EstadoReqDocumentoEnum.SOLICITUD_PRELIMINAR](reqDoc);
  }

  enProcesoEnabled(reqDoc: RequerimientoDocumento) {
    return REQUERIMIENTO_CONSTANTS.ESTADO_VALIDACIONES_DOCUMENTO[EstadoReqDocumentoEnum.EN_PROCESO](reqDoc);
  }

  accionesEnabled(reqDoc: RequerimientoDocumento) {
    return REQUERIMIENTO_CONSTANTS.ESTADOS_CON_ACCIONES_DOCUMENTO.some(estado =>
      REQUERIMIENTO_CONSTANTS.ESTADO_VALIDACIONES_DOCUMENTO[estado](reqDoc)
    );
  }

  isSubsanar(reqDoc: RequerimientoDocumento) {
    return REQUERIMIENTO_CONSTANTS.TIPO_DOCUMENTO.includes(reqDoc.tipo?.codigo as any);
  }

  // Acciones
  cargarDocumento(doc: RequerimientoDocumento) {
    this.requerimientoService.validarFechaPlazoEntrega(doc.requerimientoDocumentoUuid).subscribe({
      next: (res) => {
        this.router.navigate([Link.EXTRANET, Link.REQUERIMIENTOS_LIST,
          Link.REQUERIMIENTOS_DOCUMENTO, Link.DOCUMENTO_ADD, doc.requerimientoDocumentoUuid]);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  subsanarDocumento(doc: RequerimientoDocumento) {
    this.requerimientoService.validarFechaPlazoEntrega(doc.requerimientoDocumentoUuid).subscribe({
      next: (res) => {
        this.router.navigate([Link.EXTRANET, Link.REQUERIMIENTOS_LIST,
          Link.REQUERIMIENTOS_DOCUMENTO, Link.DOCUMENTO_SUBSANAR, doc.requerimientoDocumentoUuid]);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

}
