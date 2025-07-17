import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, switchMap, takeUntil } from "rxjs";
import { AdjuntosService } from "src/app/service/adjuntos.service";
import { ArchivoService } from "src/app/service/archivo.service";

@Component({
  selector: "vex-layout-evaluar-adjunto",
  templateUrl: "./layout-evaluar-adjunto.component.html"
})
export class LayoutEvaluarAdjuntoComponent implements OnInit, OnDestroy {

  archivo: any;
  isLoading = true;
  destroy$ = new Subject<void>();
  requerimientoDocumentoDetalleUuid: string;

  formGroup = this.fb.group({
    estado: [null, Validators.required],
    observacion: ['', Validators.required],
    usuarioEvaluador: [null],
    fechaEvaluacion: [null],
  });

  constructor(
    private fb: FormBuilder,
    private adjuntosService: AdjuntosService,
    private activeRoute: ActivatedRoute,
    private archivoService: ArchivoService
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  accion() {
    console.log(this.formGroup.value);
  }
} 