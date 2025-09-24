import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { SeccionReemplazoPersonal } from 'src/app/interface/seccion.model';
import { PersonalReemplazoService } from 'src/app/service/personal-reemplazo.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import * as CryptoJS from 'crypto-js';
import { functionsAlert } from 'src/helpers/functionsAlert';

const URL_DECRYPT = '3ncr1pt10nK3yuR1';


@Component({
  selector: 'vex-reemplazo-pers-form-edit',
  templateUrl: './reemplazo-pers-form-edit.component.html',
  styleUrls: ['./reemplazo-pers-form-edit.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ReemplazoPersFormEditComponent extends BaseComponent implements OnInit {

  @Input() idSolicitud: string;
  @Input() uuidSolicitud: string;

  @Output() perfilBajaEvent = new EventEmitter<any>();
  @Output() seccionesCompletadas = new EventEmitter<boolean>();

  itemSeccion: number = 0;

  isReview: boolean = false;
  seccionBajaPersonalFlag: boolean = false;
  seccionPersonalPropuestoFlag: boolean = false;
  seccionSolicitudReemplazoSupervisorFlag: boolean = false;
  secciones: SeccionReemplazoPersonal[] = [];

  perfilBaja: any = null;

  constructor(
    private readonly personalReemplazoService: PersonalReemplazoService
  ) {
    super();
   }

  ngOnInit(): void {
    this.cargarSecciones();
  }

  cargarSecciones(): void {
    this.personalReemplazoService.listarSeccionesPersonalReemplazo().subscribe((response) => {
        this.secciones = Array.isArray(response) ? response : [response];
      });
  }

  recibirPerfilBaja(perfil: any): void {
    this.perfilBaja = perfil;
    this.perfilBajaEvent.emit(perfil);
  }

  seccionBajaPersonalCompletada(completada: boolean): void {
    this.seccionBajaPersonalFlag = completada;
    this.verificarSeccionesCompletadas();
  }

  seccionPersonalPropuestoCompletada(completada: boolean): void {
    this.seccionPersonalPropuestoFlag = completada;
    this.verificarSeccionesCompletadas();
  }

  seccionSolicitudReemplazoSupervisorCompletada(completada: boolean): void {
    this.seccionSolicitudReemplazoSupervisorFlag = completada;
    this.verificarSeccionesCompletadas();
  }

  private verificarSeccionesCompletadas(): void {
    const todasCompletadas = this.seccionBajaPersonalFlag &&
                              this.seccionPersonalPropuestoFlag &&
                              this.seccionSolicitudReemplazoSupervisorFlag;

    this.seccionesCompletadas.emit(todasCompletadas);
  }

  registrar(){
    const idSolicitudDecrypt = Number(this.decrypt(this.idSolicitud));

    functionsAlert.questionSiNo('¿Desea ir a la bandeja de contratos?').then((result) => {
      if (result.isConfirmed) {
        this.personalReemplazoService
        .listarPersonalReemplazo(idSolicitudDecrypt)
        .subscribe(response => {
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
