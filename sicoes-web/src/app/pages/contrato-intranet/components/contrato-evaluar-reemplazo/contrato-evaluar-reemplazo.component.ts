import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { PersonalReemplazo } from 'src/app/interface/reemplazo-personal.model';
import { Supervisora } from 'src/app/interface/supervisora.model';
import { PersonalReemplazoService } from 'src/app/service/personal-reemplazo.service';
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

  listPersonalReemplazo: PersonalReemplazo[] = [];
  
  idSolicitud: number;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private personalReemplazoService: PersonalReemplazoService
  ) {
    super();
   }

  ngOnInit(): void {
    this.cargarTabla();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToBandejaSolicitudes() {
    functionsAlert.questionSiNo('¿Desea ir a la bandeja de contratos?').then((result) => {
            if (result.isConfirmed) {
              this.router.navigate([Link.INTRANET, Link.CONTRATOS_LIST]);
            }
          });
  }

  goToEvaluarReemplazoForm(row: any) {
    const encryptedId = this.route.snapshot.paramMap.get('idSolicitud');
    const idReemplazoPersonal = row.idReemplazo;
    this.router.navigate(['/intranet/contratos/' + Link.EVAL_REEMPLAZO_PERSONAL_FORM + '/' + encryptedId + '/' + idReemplazoPersonal]);
  }

  cargarTabla() {
      const idSolicitudHashed = this.route.snapshot.paramMap.get('idSolicitud');
      this.idSolicitud = Number(idSolicitudHashed);
  
      this.personalReemplazoService
      .listarPersonalReemplazo(this.idSolicitud)
      .subscribe(response => {
        this.listPersonalReemplazo = response.content.filter(item => item.estadoReemplazo?.codigo === 'EN_EVALUACION');
      });
    }
  
    getNombreCompleto(persona: Supervisora): string {
        if (!persona) return '';
        return `${persona.nombres} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`.trim();
    }

}
