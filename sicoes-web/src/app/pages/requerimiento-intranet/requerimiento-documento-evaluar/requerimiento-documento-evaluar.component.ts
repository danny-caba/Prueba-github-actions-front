import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { REQUERIMIENTO_CONSTANTS, REQUERIMIENTO_INFORME_CONSTANTS } from 'src/helpers/requerimiento.constants';
import { RequerimientoService } from 'src/app/service/requerimiento.service';
import { RequerimientoDocumentoDetalle } from 'src/app/interface/requerimiento.model';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-requerimiento-documento-evaluar',
  templateUrl: './requerimiento-documento-evaluar.component.html'
})
export class RequerimientoDocumentoEvaluarComponent implements OnInit, OnDestroy {

  usuario$ = this.authFacade.user$;
  requerimiento: any;
  evaluate: boolean = false;
  evaluateDetail: boolean = false;
  requerimientoDocumentoUuid: string;
  requisitos: RequerimientoDocumentoDetalle[];
  rutaEvaluarDetalle: string[] = [Link.INTRANET, Link.REQUERIMIENTOS_LIST, 
    Link.REQUERIMIENTOS_DOCUMENTO, Link.DOCUMENTO_EVALUAR, Link.EVALUAR_DETALLE];
  isLoading: boolean = false;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private authFacade: AuthFacade,
    private requerimientoService: RequerimientoService
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeComponent(): void {
    this.isLoading = true;
    this.activeRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap(params => {
          this.requerimientoDocumentoUuid = params['requerimientoDocumentoUuid'];
          return this.requerimientoService.obtenerDocumentoDetalle(this.requerimientoDocumentoUuid);
        })
      )
      .subscribe(listRes => {
        this.requisitos = listRes;
        this.isLoading = false;
      });

    this.activeRoute.data
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.evaluate = data.evaluate || false;
      });

  }

  cancelar(): void {
    this.router.navigate([...REQUERIMIENTO_INFORME_CONSTANTS.ROUTES.CANCEL]);
  }

  async finalizarEvaluacion(): Promise<void> {
    try {
      // Confirmación del usuario
      const isConfirmed = await this.confirmEnvio();
      if (!isConfirmed) {
        return;
      }

      // Envío del documento
      await this.sendDocumento();

    } catch (error) {
      console.error('Error en el proceso de envío:', error);
      await this.showError(REQUERIMIENTO_INFORME_CONSTANTS.MESSAGES.ERROR_UNEXPECTED);
    }
  }

  private async confirmEnvio(): Promise<boolean> {
    const result = await functionsAlert.questionSiNo(REQUERIMIENTO_CONSTANTS.MESSAGES.DOCUMENTO_CONFIRMATION);
    return result.isConfirmed;
  }

  private async sendDocumento(): Promise<void> {
    this.requerimientoService.finalizarEvaluarDocumento(this.requisitos, this.requerimientoDocumentoUuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (response) => {
          await this.handleSuccess();
        },
        error: async (error) => {
          console.log('Error al enviar informe:', error);
        }
      });
  }

  private async handleSuccess(): Promise<void> {
    await functionsAlert.success(REQUERIMIENTO_INFORME_CONSTANTS.MESSAGES.SUCCESS);
    this.regresar();
  }

  private async showError(message: string): Promise<void> {
    await functionsAlert.error(message);
  }

  regresar(): void {
    this.router.navigate([...REQUERIMIENTO_CONSTANTS.ROUTES.CANCEL]);
  }
}