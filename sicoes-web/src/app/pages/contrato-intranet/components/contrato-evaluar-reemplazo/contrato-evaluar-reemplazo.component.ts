import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-contrato-evaluar-reemplazo',
  templateUrl: './contrato-evaluar-reemplazo.component.html',
  styleUrls: ['./contrato-evaluar-reemplazo.component.scss'],
  animations: [
    fadeInRight400ms,
    stagger80ms
  ]
})
export class ContratoEvaluarReemplazoComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto', 'perfil', 'fechaRegistro', 'estadoEvalDocReemp', 'estadoAprobInforme', 'estadoAprobAdenda', 'estadoEvalDocIniServ', 'actions'];

  dummyDataSource = [
    {
      tipoDocumento: "DNI",
      numeroDocumento: '09856442',
      nombreCompleto: 'CLAUDIA ROSA JIMENEZ PEREZ',
      perfil: 'DB1_456',
      fechaRegistro: '2023-10-01',
      fechaInicioContractual: '2023-10-01',
      estadoReemplazo: 'Preliminar',
      estadoDocumento: ''
    }
  ];

  constructor(
    private router: Router
  ) {
    super();
   }

  ngOnInit(): void {
  }

  goToBandejaSolicitudes() {
    functionsAlert.questionSiNo('¿Desea ir a la bandeja de contratos?').then((result) => {
            if (result.isConfirmed) {
              this.router.navigate([Link.INTRANET, Link.CONTRATOS_LIST]);
            }
          });
  }

  goToEvaluarReemplazoForm(row: any) {
    this.router.navigate(['/intranet/contratos/' + Link.EVAL_REEMPLAZO_PERSONAL_FORM + '/' + row.idSolicitud]);
  }

  doNothing(){

  }

}
