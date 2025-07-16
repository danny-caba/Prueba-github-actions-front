import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-reemplazo-personal',
  templateUrl: './reemplazo-personal.component.html',
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ReemplazoPersonalComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto', 'perfil', 'fechaRegistro', 'fechaInicioContractual', 'estadoReemplazo', 'estadoDocumento', 'actions'];
  allowedToReplace: boolean = true;
  btnReplace: string = 'Reemplazar';
  private destroy$ = new Subject<void>();
  dummyDataSource = [
    {
      tipoDocumento: "DNI",
      numeroDocumento: '09856442',
      nombreCompleto: 'CLAUDIA ROSA JIMENEZ PEREZ',
      perfil: 'DB1_456',
      fechaRegistro: '2023-10-01',
      fechaInicioContractual: '2023-10-01',
      estadoReemplazo: 'Preliminar',
      estadoDocumento: 'Aprobado'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  doNothing(): void {

  }

  toGoReemplazoPersonalForm() {
    const encryptedId = this.route.snapshot.paramMap.get('idSolicitud');
    this.router.navigate([Link.EXTRANET, Link.CONTRATOS_LIST, Link.REEMPLAZO_PERSONAL_FORM, encryptedId]);
  }

  toGoDocumentosInicioServicioForm() {
    const encryptedId = this.route.snapshot.paramMap.get('idSolicitud');
    this.router.navigate([Link.EXTRANET, Link.CONTRATOS_LIST, Link.CARGA_DOCS_INICIO_FORM, encryptedId]);
  }

  toGoBandejaContratos() {
      functionsAlert.questionSiNo('¿Desea ir a la bandeja de contratos?').then((result) => {
          if (result.isConfirmed) {
            this.router.navigate([Link.EXTRANET, Link.CONTRATOS_LIST]);
          }
        });
  }
}
