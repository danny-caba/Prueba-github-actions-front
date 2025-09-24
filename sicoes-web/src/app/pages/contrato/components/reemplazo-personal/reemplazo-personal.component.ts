import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { PersonalReemplazo } from 'src/app/interface/reemplazo-personal.model';
import { PersonalReemplazoService } from 'src/app/service/personal-reemplazo.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';
import * as CryptoJS from 'crypto-js';
import { Supervisora } from 'src/app/interface/supervisora.model';

const URL_DECRYPT = '3ncr1pt10nK3yuR1';
@Component({
  selector: 'vex-reemplazo-personal',
  templateUrl: './reemplazo-personal.component.html',
  styleUrls: ['./reemplazo-personal.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ReemplazoPersonalComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto', 'perfil', 'fechaRegistro', 'fechaInicioContractual', 'estadoReemplazo', 'estadoDocumento', 'actions'];
  allowedToReplace: boolean = true;
  btnReplace: string = 'Reemplazar';
  private readonly destroy$ = new Subject<void>();
  listPersonalReemplazo: PersonalReemplazo[] = [];
  idSolicitud: number;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly personalReemplazoService: PersonalReemplazoService
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

  toGoReemplazoPersonalForm() {
    const encryptedId = this.route.snapshot.paramMap.get('idSolicitud');
    this.router.navigate([Link.EXTRANET, Link.CONTRATOS_LIST, Link.REEMPLAZO_PERSONAL_FORM, encryptedId]);
  }
  
  toGoBandejaContratos() {
      functionsAlert.questionSiNo('¿Desea ir a la bandeja de contratos?').then((result) => {
          if (result.isConfirmed) {
            this.router.navigate([Link.EXTRANET, Link.CONTRATOS_LIST]);
          }
        });
  }

  cargarTabla() {
    const idSolicitudHashed = this.route.snapshot.paramMap.get('idSolicitud');
    this.idSolicitud = Number(this.decrypt(idSolicitudHashed));

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

  deletePersonalReemplazo(personalReemplazo: PersonalReemplazo): void {    
    functionsAlert.questionSiNo(
      `¿Está seguro que desea eliminar al personal de reemplazo con ID ${personalReemplazo.idReemplazo}?`
    ).then((result) => {
      if (result.isConfirmed) {
        this.personalReemplazoService.eliminarPersonalReemplazo(personalReemplazo.idReemplazo)
          .subscribe({
            next: () => {
              functionsAlert.success('Eliminación exitosa');
              this.cargarTabla();
            },
            error: (err) => {
              console.error(err);
              functionsAlert.error('Error al eliminar');
            }
          });
        }
    });
}

  decrypt(encryptedData: string): string {
      const bytes = CryptoJS.AES.decrypt(encryptedData, URL_DECRYPT);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted;
  }
  
}
