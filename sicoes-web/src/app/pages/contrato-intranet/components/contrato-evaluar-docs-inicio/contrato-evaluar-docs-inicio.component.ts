import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { PersonalReemplazo } from 'src/app/interface/reemplazo-personal.model';
import { Supervisora } from 'src/app/interface/supervisora.model';
import { PersonalReemplazoService } from 'src/app/service/personal-reemplazo.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';
import * as CryptoJS from 'crypto-js';

const URL_DECRYPT = '3ncr1pt10nK3yuR1';

@Component({
  selector: 'vex-contrato-evaluar-docs-inicio',
  templateUrl: './contrato-evaluar-docs-inicio.component.html',
  styleUrls: ['./contrato-evaluar-docs-inicio.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ContratoEvaluarDocsInicioComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto', 'perfil', 'fechaRegistro', 'estadoEvalDocReemp', 'estadoAprobInforme', 'estadoAprobAdenda', 'estadoEvalDocIniServ', 'actions'];

  private destroy$ = new Subject<void>();
  idSolicitud: number;
  listPersonalReemplazo: PersonalReemplazo[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

  cargarTabla() {
    const idSolicitudHashed = this.route.snapshot.paramMap.get('idSolicitud');
    this.idSolicitud = Number(idSolicitudHashed);

    this.personalReemplazoService
    .listarPersonalReemplazo(this.idSolicitud)
    .subscribe(response => {
      this.listPersonalReemplazo = response.content.filter(
          (item) =>
            item.estadoEvalDocIniServ?.codigo === "BORRADOR" &&
            item.estadoDocIniServ?.codigo === "EN_EVALUACION"
        );
    });
  }

  goToBandejaSolicitudes() {
    functionsAlert.questionSiNo('¿Desea ir a la bandeja de contratos?').then((result) => {
            if (result.isConfirmed) {
              this.router.navigate([Link.INTRANET, Link.CONTRATOS_LIST]);
            }
          });
  }

  goToEvaluarDocsInicioForm(row: any) {
    const idReemplazoPersonal = row.idReemplazo;
    this.router.navigate(['/intranet/contratos/' + Link.EVAL_DOCS_INICIO_FORM + '/' + row.idSolicitud + '/' + idReemplazoPersonal]);
  }

  getNombreCompleto(persona: Supervisora): string {
        if (!persona) return '';
        return `${persona.nombres} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`.trim();
    }
  
    decrypt(encryptedData: string): string {
          const bytes = CryptoJS.AES.decrypt(encryptedData, URL_DECRYPT);
          const decrypted = bytes.toString(CryptoJS.enc.Utf8);
          return decrypted;
  }

}
