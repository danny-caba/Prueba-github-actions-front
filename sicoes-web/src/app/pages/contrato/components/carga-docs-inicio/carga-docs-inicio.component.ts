import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-carga-docs-inicio',
  templateUrl: './carga-docs-inicio.component.html',
  styleUrls: ['./carga-docs-inicio.component.scss']
})
export class CargaDocsInicioComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto', 'perfil', 'fechaRegistro', 'fechaInicioContractual', 'estadoReemplazo', 'estadoDocumento', 'actions'];
  allowedToReplace: boolean = true;
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
