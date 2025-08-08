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
import * as CryptoJS from 'crypto-js';

const URL_DECRYPT = '3ncr1pt10nK3yuR1';

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
  listPersonalReemplazo: PersonalReemplazo[] = [];
  idSolicitud: number;

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

  doNothing(): void {

  }

  toGoRevisarReemplazoPersonalForm(row: PersonalReemplazo) {
    const encryptedId = this.route.snapshot.paramMap.get('idSolicitud');
    const idReemplazoPersonal = row.idReemplazo;
    this.router.navigate(['/intranet/contratos/' + Link.REEMPLAZO_PERSONAL_REVIEW_FORM + '/' + encryptedId + '/' + idReemplazoPersonal]);
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

  cargarTabla() {
    const idSolicitudHashed = this.route.snapshot.paramMap.get('idSolicitud');
    this.idSolicitud = Number(idSolicitudHashed);

    this.personalReemplazoService
    .listarPersonalReemplazo(this.idSolicitud)
    .subscribe(response => {
      this.listPersonalReemplazo = response.content.filter(item => !!item.estadoReemplazo);
    });
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
