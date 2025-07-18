import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, switchMap, takeUntil } from "rxjs";
import { ListadoDetalle } from "src/app/interface/listado.model";
import { AdjuntosService } from "src/app/service/adjuntos.service";
import { ArchivoService } from "src/app/service/archivo.service";
import { ParametriaService } from "src/app/service/parametria.service";
import { RequerimientoService } from "src/app/service/requerimiento.service";
import { ListadoEnum } from "src/helpers/constantes.components";

@Component({
  selector: "vex-layout-evaluar-adjunto",
  templateUrl: "./layout-evaluar-adjunto.component.html"
})
export class LayoutEvaluarAdjuntoComponent implements OnInit, OnDestroy {

  archivo: any;
  isLoading = true;
  destroy$ = new Subject<void>();
  requerimientoDocumentoDetalleUuid: string;
  estadosReqDocumentoDetalle: ListadoDetalle[] = [];

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
  ) { }

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
          return this.archivoService.obtenerArchivoPorReqDocumentoDetalle(this.requerimientoDocumentoDetalleUuid);
        }),
      )
      .subscribe({
        next: (res) => {
          this.archivo = res;
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
          this.formGroup.patchValue({
            evaluacion: res.evaluacion,
            observacion: res.observacion,
            usuarioEvaluador: res.usuario?.nombreUsuario,
            fechaEvaluacion: res.fechaEvaluacion,
          });
          console.log(this.formGroup.value);
          
        },
        error: (error) => {
          console.error('Error al evaluar documento detalle:', error);
        }
      });
    } else {
      this.router.navigate(['/requerimiento-documento-list']);
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
} 