import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthFacade } from 'src/app/auth/store/auth.facade';

@Component({
  selector: 'vex-requerimiento-documento-evaluar-detalle',
  templateUrl: './requerimiento-documento-evaluar-detalle.component.html'
})
export class RequerimientoDocumentoEvaluarDetalleComponent implements OnDestroy {

  usuario$ = this.authFacade.user$;
  evaluateDetail: boolean = false;
  requerimientoDocumentoDetalleUuid: string;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly authFacade: AuthFacade
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
