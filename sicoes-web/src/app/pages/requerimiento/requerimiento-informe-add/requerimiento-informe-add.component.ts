import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { RequerimientoInformePnAddComponent } from './informe-pn-add/requerimiento-informe-pn-add.component';
import { RequerimientoInformeService } from 'src/app/service/requerimiento-informe.service';
import { REQUERIMIENTO_INFORME_CONSTANTS } from 'src/helpers/requerimiento.constants';

@Component({
  selector: 'vex-requerimiento-informe-add',
  templateUrl: './requerimiento-informe-add.component.html',
  styleUrls: ['./requerimiento-informe-add.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class RequerimientoInformeAddComponent implements OnInit, OnDestroy {

  @ViewChild(RequerimientoInformePnAddComponent) informeComponent: RequerimientoInformePnAddComponent;

  usuario$ = this.authFacade.user$;
  requerimiento: any;
  add: boolean = false;
  requerimientoUuid: string;
  
  private readonly destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private requerimientoInformeService: RequerimientoInformeService,
    private authFacade: AuthFacade
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeComponent(): void {
    this.activeRoute.data
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.add = data.add || false;
      });

    this.activeRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.requerimientoUuid = params['requerimientoUuid'];
      });
  }

  cancelar(): void {
    this.router.navigate([...REQUERIMIENTO_INFORME_CONSTANTS.ROUTES.CANCEL]);
  }

  async enviar(): Promise<void> {
    try {
      // Validaciones previas
      if (!this.validatePrerequisites()) {
        return;
      }

      // Confirmación del usuario
      const isConfirmed = await this.confirmEnvio();
      if (!isConfirmed) {
        return;
      }

      // Envío del informe
      await this.sendInforme();

    } catch (error) {
      console.error('Error en el proceso de envío:', error);
      await this.showError(REQUERIMIENTO_INFORME_CONSTANTS.MESSAGES.ERROR_UNEXPECTED);
    }
  }

  private validatePrerequisites(): boolean {
    if (!this.requerimientoUuid) {
      this.showError(REQUERIMIENTO_INFORME_CONSTANTS.MESSAGES.ERROR_NO_REQUERIMIENTO);
      return false;
    }

    const formData = this.informeComponent?.obtenerDatosInforme();
    if (!formData) {
      this.showError(REQUERIMIENTO_INFORME_CONSTANTS.MESSAGES.ERROR_NO_DATA);
      return false;
    }

    // Validar datos del informe usando el servicio
    const validation = this.requerimientoInformeService.validateInformeData(formData);
    if (!validation.isValid) {
      const errorMessage = validation.errors.join('\n');
      this.showError(`${REQUERIMIENTO_INFORME_CONSTANTS.MESSAGES.VALIDATION_ERRORS}\n${errorMessage}`);
      return false;
    }

    return true;
  }

  private async confirmEnvio(): Promise<boolean> {
    const result = await functionsAlert.questionSiNo(REQUERIMIENTO_INFORME_CONSTANTS.MESSAGES.CONFIRMATION);
    return result.isConfirmed;
  }

  private async sendInforme(): Promise<void> {
    const formData = this.informeComponent.obtenerDatosInforme();
    const requerimientoInformeDetalle = this.requerimientoInformeService.buildRequerimientoInformeDetalle(
      this.requerimientoUuid, 
      formData
    );

    this.requerimientoInformeService.enviarInforme(requerimientoInformeDetalle)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (response) => {
          await this.handleSuccess();
        },
        error: async (error) => {
          console.error('Error al enviar informe:', error);
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
    this.router.navigate([...REQUERIMIENTO_INFORME_CONSTANTS.ROUTES.SUCCESS], {
      queryParams: { tab: REQUERIMIENTO_INFORME_CONSTANTS.QUERY_PARAMS.TAB }
    });
  }
}
