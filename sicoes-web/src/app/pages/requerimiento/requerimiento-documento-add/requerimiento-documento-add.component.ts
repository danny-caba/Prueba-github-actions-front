import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, switchMap, takeUntil } from "rxjs";
import { AuthFacade } from "src/app/auth/store/auth.facade";
import { functionsAlert } from "src/helpers/functionsAlert";
import {
  REQUERIMIENTO_CONSTANTS,
  REQUERIMIENTO_INFORME_CONSTANTS,
} from "src/helpers/requerimiento.constants";
import { RequerimientoService } from "src/app/service/requerimiento.service";
import {
  RequerimientoDocumento,
  RequerimientoDocumentoDetalle,
} from "src/app/interface/requerimiento.model";
import { EstadoReqDocumentoEnum } from "src/helpers/constantes.components";

@Component({
  selector: "vex-requerimiento-documento-add",
  templateUrl: "./requerimiento-documento-add.component.html",
})
export class RequerimientoDocumentoAddComponent implements OnInit, OnDestroy {
  usuario$ = this.authFacade.user$;
  requerimiento: any;
  add: boolean = false;
  subsanar: boolean = false;
  requerimientoDocumentoUuid: string;
  requisitos: RequerimientoDocumentoDetalle[];
  isLoading: boolean = false;
  requerimientoDocumento: Partial<RequerimientoDocumento>;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly activeRoute: ActivatedRoute,
    private readonly authFacade: AuthFacade,
    private readonly requerimientoService: RequerimientoService
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
        switchMap((params) => {
          this.requerimientoDocumentoUuid = params["documentoUuid"];
          return this.requerimientoService.obtenerDocumentoDetalle(
            this.requerimientoDocumentoUuid
          );
        })
      )
      .subscribe((listRes) => {
        this.requisitos = listRes;
        this.requerimientoDocumento = listRes[0].requerimientoDocumento;
        if (
          this.requerimientoDocumento.estado.codigo !==
          EstadoReqDocumentoEnum.SOLICITUD_PRELIMINAR
        ) {
          this.changeToView();
        }
        this.isLoading = false;
      });

    this.activeRoute.data.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.add = data.add ?? false;
      this.subsanar = data.subsanar ?? false;
    });
  }

  cancelar(): void {
    this.router.navigate([...REQUERIMIENTO_INFORME_CONSTANTS.ROUTES.CANCEL]);
  }

  async registrar(): Promise<void> {
    try {
      // Confirmación del usuario
      const isConfirmed = await this.confirmEnvio();
      if (!isConfirmed) {
        return;
      }

      // Envío del documento
      await this.sendDocumento();
    } catch (error) {
      console.error("Error en el proceso de envío:", error);
      await this.showError(
        REQUERIMIENTO_INFORME_CONSTANTS.MESSAGES.ERROR_UNEXPECTED
      );
    }
  }

  private async confirmEnvio(): Promise<boolean> {
    const result = await functionsAlert.questionSiNo(
      REQUERIMIENTO_CONSTANTS.MESSAGES.DOCUMENTO_CONFIRMATION
    );
    return result.isConfirmed;
  }

  private async sendDocumento(): Promise<void> {
    this.requisitos.forEach((requisito) => {
      requisito.usuario = null;
      requisito.requerimientoDocumento.estado = null;
    });
    this.requerimientoService
      .registrarDocumento(this.requisitos)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (response) => {
          await this.handleSuccess();
        },
        error: async (error) => {
          console.error("Error al enviar informe:", error);
        },
      });
  }

  private async handleSuccess(): Promise<void> {
    await functionsAlert.success(
      REQUERIMIENTO_INFORME_CONSTANTS.MESSAGES.SUCCESS
    );
    this.changeToView();
  }

  private async showError(message: string): Promise<void> {
    await functionsAlert.error(message);
  }

  changeToView(): void {
    this.router.navigate([...REQUERIMIENTO_CONSTANTS.ROUTES.SUCCESS]);
  }

  regresar(): void {
    this.router.navigate([...REQUERIMIENTO_CONSTANTS.ROUTES.SUCCESS]);
  }

  mostrarBotonRegistrar(): boolean {
    return (this.add || this.subsanar) && !this.isLoading;
  }
}
