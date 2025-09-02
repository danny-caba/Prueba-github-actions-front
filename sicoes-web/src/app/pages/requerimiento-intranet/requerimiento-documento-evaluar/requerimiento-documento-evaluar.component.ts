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
  titulo = 'Evaluar Documentos';
  isReview: boolean = false;
  isFinalized: boolean = false;
  isCorrectEvaluate: boolean;
  isNotificarCoordinador: boolean = false;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private authFacade: AuthFacade,
    private requerimientoService: RequerimientoService,
  ) { }

  ngOnInit(): void {
    if (this.router.url.includes('/revisar/')) {
      this.titulo = 'Revisar Documentos';
    }
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
        
        if (this.evaluate) {
          this.requisitos = this.requisitos.filter(requisito => requisito.origenRequisito.codigo === 'EXTERNO');
        }

        if (this.isReview) {
          this.requisitos = this.requisitos.map(requisito => {
            if (requisito.flagVistoBueno === undefined || requisito.flagVistoBueno === null) {
              requisito.flagVistoBueno = '0';
            }
            return requisito;
          });
          this.isFinalized = this.requisitos.some(requisito => requisito.flagVistoBueno !== '0');
        }
        
        this.isLoading = false;
      });

    this.activeRoute.data
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.evaluate = data.evaluate || false;
        this.isReview = data.review || false;
      });

  }

  cancelar(): void {
    this.router.navigate([...REQUERIMIENTO_INFORME_CONSTANTS.ROUTES.CANCEL]);
  }

  async finalizarEvaluacion(): Promise<void> {
    try {
      this.isCorrectEvaluate = false;
      if(this.evaluate) {
        this.isCorrectEvaluate = this.requisitos.every(requisito => requisito.evaluacion?.codigo === 'CUMPLE');
      }

      if(this.isReview) {
        this.isCorrectEvaluate = this.requisitos.every(requisito => requisito.flagVistoBueno === '1');
        this.isNotificarCoordinador = this.requisitos.some(requisito => {
          return requisito.origenRequisito.codigo === 'REQUERIMIENTO'
          && requisito.flagVistoBueno === '0';
        });
      }

      const isConfirmed = await this.confirmEnvio();
      if (!isConfirmed) {
        return;
      }

      await this.sendDocumento();

    } catch (error) {
      console.error('Error en el proceso de envío:', error);
      await this.showError(REQUERIMIENTO_INFORME_CONSTANTS.MESSAGES.ERROR_UNEXPECTED);
    }
  }

  private async confirmEnvio(): Promise<boolean> {
    let mensajeConfirmacion: string;
    
    if (!this.evaluate && !this.isReview) {
      // Carga Documentos
      mensajeConfirmacion = REQUERIMIENTO_CONSTANTS.MESSAGES.DOCUMENTO_CONFIRMATION;
    } else if (this.isReview && this.isCorrectEvaluate) {
      // Revision
      mensajeConfirmacion = REQUERIMIENTO_CONSTANTS.MESSAGES.REVISAR_CONFIRMATION;
    } else if (this.isReview && !this.isCorrectEvaluate && this.isNotificarCoordinador) {
      // Revision con errores - notificar para subsanar al coordinador
      mensajeConfirmacion = REQUERIMIENTO_CONSTANTS.MESSAGES.REVISAR_NO_COORDINADOR_CONFIRMATION;
    } else if (this.isReview && !this.isCorrectEvaluate && !this.isNotificarCoordinador) {
      // Revision con errores - notificar para subsanar al supervisor persona natural
      mensajeConfirmacion = REQUERIMIENTO_CONSTANTS.MESSAGES.REVISAR_NO_SUPERVISOR_CONFIRMATION;
    } else if (this.evaluate && this.isCorrectEvaluate) {
      // Evaluación exitosa - finalizar
      mensajeConfirmacion = REQUERIMIENTO_CONSTANTS.MESSAGES.EVALUAR_CONFIRMATION;
    } else if (this.evaluate && !this.isCorrectEvaluate) {
      // Evaluación con errores - notificar para subsanar
      mensajeConfirmacion = REQUERIMIENTO_CONSTANTS.MESSAGES.EVALUAR_NO_CONFIRMATION;
    }

    const result = await functionsAlert.questionSiNo(mensajeConfirmacion);
    return result.isConfirmed;
  }

  private async sendDocumento(): Promise<void> {
    const apiCall = !this.evaluate
      ? this.requerimientoService.finalizarRevisarDocumento(this.requisitos, this.requerimientoDocumentoUuid)
      : this.requerimientoService.finalizarEvaluarDocumento(this.requisitos, this.requerimientoDocumentoUuid);

    apiCall.pipe(takeUntil(this.destroy$)).subscribe({
      next: async () => {
        await this.handleSuccess();
      },
      error: async (error) => {
        console.log('Error al enviar informe:', error);
      }
    });
  }


  private async handleSuccess(): Promise<void> {
    await functionsAlert.success(REQUERIMIENTO_INFORME_CONSTANTS.MESSAGES.SUCCESS_EVALUAR);
    this.regresar();
  }

  private async showError(message: string): Promise<void> {
    await functionsAlert.error(message);
  }

  regresar(): void {
    this.router.navigate([...REQUERIMIENTO_CONSTANTS.ROUTES.CANCEL]);
  }
}