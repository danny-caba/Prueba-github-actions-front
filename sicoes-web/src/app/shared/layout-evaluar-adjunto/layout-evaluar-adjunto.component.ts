import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin, Subject, switchMap, takeUntil } from "rxjs";
import { ListadoDetalle } from "src/app/interface/listado.model";
import { RequerimientoDocumentoDetalle } from "src/app/interface/requerimiento.model";
import { AdjuntosService } from "src/app/service/adjuntos.service";
import { ArchivoService } from "src/app/service/archivo.service";
import { ParametriaService } from "src/app/service/parametria.service";
import { RequerimientoService } from "src/app/service/requerimiento.service";
import { EstadoReqDocDetalleEvalEnum, ListadoEnum, TipoDocumentoEnum } from "src/helpers/constantes.components";
import { BaseComponent } from "src/app/shared/components/base.component";

@Component({
  selector: "vex-layout-evaluar-adjunto",
  templateUrl: "./layout-evaluar-adjunto.component.html"
})
export class LayoutEvaluarAdjuntoComponent extends BaseComponent implements OnInit, OnDestroy {

  archivo: any;
  requisito: any;
  isLoading = true;
  destroy$ = new Subject<void>();
  requerimientoDocumentoDetalleUuid: string;
  estadosReqDocumentoDetalle: ListadoDetalle[] = [];
  formBloqueado = false;

  ACC_REGISTRAR = 'ACC_REGISTRAR';
  ACC_CANCELAR = 'ACC_CANCELAR';

  formGroup = this.fb.group({
    evaluacion: [null, Validators.required],
    observacion: ['', Validators.required],
    usuarioEvaluador: [null],
    fechaEvaluacion: [null],
  });

  constructor(
    private fb: FormBuilder,
    private adjuntosService: AdjuntosService,
    private activeRoute: ActivatedRoute,
    private archivoService: ArchivoService,
    private parametriaService: ParametriaService,
    private router: Router,
    private requerimientoService: RequerimientoService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initializeComponent();
  }

  private initializeComponent(): void {
    this.isLoading = true;

    this.activeRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap(params => {
          this.requerimientoDocumentoDetalleUuid = params['requerimientoDocumentoDetalleUuid'];
          return forkJoin({
            archivo: this.archivoService.obtenerArchivoPorReqDocumentoDetalle(this.requerimientoDocumentoDetalleUuid),
            requisito: this.requerimientoService.obtenerDocumentoDetalleEvaluar(this.requerimientoDocumentoDetalleUuid)
          })
        }),
      )
      .subscribe({
        next: ({archivo, requisito}) => {
          // Obtener el archivo
          this.archivo = archivo;
          this.adjuntosService.obtenerUrlVisualizacion(this.archivo?.codigo).subscribe({
            next: (url) => {
              this.archivo = {
                url: url,
                tipo: 'PDF'
              };
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error al cargar url visualizacion:', error);
              this.isLoading = false;
            }
          });

          // Obtener el requisito
          this.requisito = requisito;
          // Buscar la referencia correcta en la lista para evaluacion
          const evaluacionSeleccionada = this.estadosReqDocumentoDetalle.find(
            e => e.codigo === this.requisito.evaluacion?.codigo
          );
          this.formGroup.patchValue({
            evaluacion: evaluacionSeleccionada as any,
            observacion: this.requisito.observacion,
            usuarioEvaluador: this.requisito.usuario?.nombreUsuario,
            fechaEvaluacion: this.requisito.fechaEvaluacion,
          });
          this.bloquearFormularioSiCorresponde();
        },
        error: (error) => {
          console.error('Error al cargar obtener archivo:', error);
          this.isLoading = false;
        }
      });

    const dataString = sessionStorage.getItem('ESTADO_REQ_DOCUMENTO_DETALLE');
    if(dataString){
      this.estadosReqDocumentoDetalle = JSON.parse(dataString);
    } else {
      this.parametriaService.obtenerMultipleListadoDetalle([
        ListadoEnum.ESTADO_REQ_DOCUMENTO_DETALLE
      ]).subscribe(res => {
        this.estadosReqDocumentoDetalle = res[0];
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  accion(accion: string) {
    if(accion == this.ACC_REGISTRAR) {
      let data = {
        ...this.formGroup.value,
        requerimientoDocumentoDetalleUuid: this.requerimientoDocumentoDetalleUuid,
      }
      this.requerimientoService.evaluarDocumentoDetalle(data).subscribe({
        next: (res) => {
          // Buscar la referencia correcta en la lista para evaluacion
          const evaluacionSeleccionada = this.estadosReqDocumentoDetalle.find(
            e => e.codigo === res.evaluacion?.codigo
          );
          this.formGroup.patchValue({
            evaluacion: evaluacionSeleccionada as any,
            observacion: res.observacion,
            usuarioEvaluador: res.usuario?.nombreUsuario,
            fechaEvaluacion: res.fechaEvaluacion,
          });
          this.bloquearFormularioSiCorresponde();
        },
        error: (error) => {
          console.error('Error al evaluar documento detalle:', error);
        }
      });
    } else {
      this.router.navigate(['intranet', 'requerimientos', 'documentos', 'evaluar', this.requisito.requerimientoDocumento.requerimientoDocumentoUuid]);
    }
  }

  onChangeEstado(event: any) {
    if(event.value.codigo == 'OBSERVADO') {
      this.formGroup.controls.observacion.setValidators([Validators.required]);
      this.formGroup.controls.observacion.updateValueAndValidity();
      this.formGroup.controls.observacion.setValue('');
    } else {
      this.formGroup.controls.observacion.clearValidators();
      this.formGroup.controls.observacion.updateValueAndValidity();
    }
  }

  private bloquearFormularioSiCorresponde() {

    // if (this.requisito.tipo?.codigo === TipoDocumentoEnum.SUBSANACION 
    //   && this.requisito.evaluacion?.codigo === EstadoReqDocDetalleEvalEnum.OBSERVADO) {
    //   this.formBloqueado = false;
    //   this.formGroup.enable();
    // } else {
      const v = this.formGroup.value;
      if (v.evaluacion && v.usuarioEvaluador && v.fechaEvaluacion) {
        this.formBloqueado = true;
        this.formGroup.disable();
      } else {
        this.formBloqueado = false;
        this.formGroup.enable();
      }
    // }
  }
}