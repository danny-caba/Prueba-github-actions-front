import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonalReemplazoService } from 'src/app/service/personal-reemplazo.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { Link } from 'src/helpers/internal-urls.components';
import * as CryptoJS from 'crypto-js';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { AdjuntosService } from 'src/app/service/adjuntos.service';

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
  puedeRegistrar: boolean = false;

  perfilBaja: any = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly personalReemplazoService: PersonalReemplazoService,
    private readonly adjunto:AdjuntosService
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
  }

  recibirPerfilBaja(perfil: any): void {
    this.perfilBaja = perfil;
  }

  recibirFlagSeccionesCompletadas(flag: boolean): void {
    this.puedeRegistrar = flag;
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
            console.log(response);
            if(response.archivo!=undefined && response.archivo!=null){
              this.adjunto.descargarWindowsJWT(response.archivo.codigo,response.archivo.nombreReal);
              this.router.navigate([Link.EXTRANET, Link.CONTRATOS_LIST, Link.REEMPLAZO_PERSONAL_ADD, this.idSolicitud]);  
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
