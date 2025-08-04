import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-contrato-form-eval-reemp',
  templateUrl: './contrato-form-eval-reemp.component.html',
  styleUrls: ['./contrato-form-eval-reemp.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ContratoFormEvalReempComponent extends BaseComponent implements OnInit {

  btnApprove: string = 'Aprobar';
  btnReject: string = 'Rechazar';
  idSolicitud: string = '';
  uuidSolicitud: string= '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.getIdSolicitud();
  }

  toGoBandejaContratos() {
      functionsAlert.questionSiNo('¿Desea regresar a la sección de evaluación de reemplazo de personal propuesto?').then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/intranet/contratos/' + Link.REEMPLAZO_PERSONAL_ADD + '/' + this.idSolicitud]);
            }
          });
  }

  getIdSolicitud(): void {
    this.idSolicitud = this.route.snapshot.paramMap.get('idSolicitud');
    this.uuidSolicitud = this.route.snapshot.paramMap.get('solicitudUuid');
    console.log("idSolicitud -> ", this.idSolicitud);
    console.log("uuidSolicitud -> ", this.uuidSolicitud);
  }

  doNothing(): void {

  }
}
