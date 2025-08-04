import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-revisar-doc-reemplazo',
  templateUrl: './revisar-doc-reemplazo.component.html',
  styleUrls: ['./revisar-doc-reemplazo.component.scss'],
  animations: [
    fadeInRight400ms,
    stagger80ms
  ]
})
export class RevisarDocReemplazoComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto', 'perfil', 'fechaRegistro', 'estadoRevision', 'estadoAprobInforme', 'estadoAprobAdenda', 'estadoEvaluarDocsInicio' ,'actions'];
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

  toGoRevisarReemplazoPersonalForm() {
    const encryptedId = this.route.snapshot.paramMap.get('idSolicitud');
    this.router.navigate(['/intranet/contratos/' + Link.REEMPLAZO_PERSONAL_REVIEW_FORM + '/' + encryptedId]);
  }

  toGoCargarAdendaForm() {
    const encryptedId = this.route.snapshot.paramMap.get('idSolicitud');
    this.router.navigate(['/intranet/contratos/' + Link.CARGA_ADENDA_FORM + '/' + encryptedId]);

  }

  toGoBandejaContratos() {
      functionsAlert.questionSiNo('¿Desea ir a la bandeja de contratos?').then((result) => {
          if (result.isConfirmed) {
            this.router.navigate([Link.INTRANET, Link.CONTRATOS_LIST]);
          }
        });
  }
}
