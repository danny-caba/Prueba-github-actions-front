import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonalReemplazoService } from 'src/app/service/personal-reemplazo.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Link } from 'src/helpers/internal-urls.components';
import * as CryptoJS from 'crypto-js';
import { functionsAlert } from 'src/helpers/functionsAlert';

const URL_DECRYPT = '3ncr1pt10nK3yuR1';
@Component({
  selector: 'vex-reemplazo-pers-form',
  templateUrl: './reemplazo-pers-form.component.html'
})
export class ReemplazoPersFormComponent extends BaseComponent implements OnInit {

  btnRegister: string = 'Registrar';
  idSolicitud: string = '';
  uuidSolicitud: string= '';
  isCargaDocsInicio: boolean = false;
  perfilBaja: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personalReemplazoService: PersonalReemplazoService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if(data.isCargaDocsInicio){
        this.isCargaDocsInicio = data.isCargaDocsInicio;
      }
    });
    this.getIdSolicitud();
  }

  toGoBandejaContratos() {
        functionsAlert.questionSiNo('¿Desea regresar a la sección de reemplazo de personal propuesto?').then((result) => {
            if (result.isConfirmed) {
              this.router.navigate([Link.EXTRANET, Link.CONTRATOS_LIST, Link.REEMPLAZO_PERSONAL_ADD, this.idSolicitud]);
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

  recibirPerfilBaja(perfil: any): void {
    this.perfilBaja = perfil;
    console.log('Perfil de baja recibido:', perfil);
  }

  registrar(){
      const body = {
        idReemplazo: this.perfilBaja?.idReemplazo
      }
  
      functionsAlert.questionSiNo('¿Seguro de registrar la gestión de reemplazar a personal propuesto?').then((result) => {
        if (result.isConfirmed) {
          this.personalReemplazoService
          .registrarReemplazo(body)
          .subscribe(response => {
            console.log('Personal Reemplazo:', response);  
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
