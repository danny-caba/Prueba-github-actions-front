import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '../components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { PersonalPropuesto, PersonalReemplazo } from 'src/app/interface/reemplazo-personal.model';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { ContratoService } from 'src/app/service/contrato.service';
import * as CryptoJS from 'crypto-js';
import { PersonalReemplazoService } from 'src/app/service/personal-reemplazo.service';
import { Supervisora, SupervisoraPerfil } from 'src/app/interface/supervisora.model';
import { id } from 'date-fns/locale';

const URL_DECRYPT = '3ncr1pt10nK3yuR1';

@Component({
  selector: 'vex-layout-baja-personal-propuesto',
  templateUrl: './layout-baja-personal-propuesto.component.html',
  styleUrls: ['./layout-baja-personal-propuesto.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class LayoutBajaPersonalPropuestoComponent extends BaseComponent implements OnInit {

  @Input() isReview?: boolean;
  @Input() isReviewExt?: boolean;
  @Input() isCargaAdenda?: boolean;
  @Input() idSolicitud: string;

  displayedColumns: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto', 'perfil', 'fechaRegistro', 'fechaBaja', 'fechaDesvinculacion', 'actions'];
  displayedColumnsReview: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto', 'perfil', 'fechaRegistro', 'fechaBaja', 'fechaFinContrato'];

  listBajaPersonalPropuesto: SupervisoraPerfil[] = null;
  listPersonalBaja: PersonalReemplazo[] = [];

  contrato: any;
  tipoContratoSeleccionado: number;
  idSolicitudDecrypt: number;

  constructor(
    private fb: FormBuilder,
    private contratoService: ContratoService,
    private reemplazoService: PersonalReemplazoService
  ) {
    super();
  }

  formGroup = this.fb.group({
    nombres: [null, Validators.required],
    fechaDesvinculacion: [null, Validators.required]
  });



  ngOnInit(): void {
    this.cargarCombo();
    this.cargarTabla();
    this.isReview = this.isReview ?? false;
    this.isReviewExt = this.isReviewExt ?? false;
    this.isCargaAdenda = this.isCargaAdenda ?? false;
  }

  guardarBajaPersonalPropuesto(): void {
    if (this.formGroup.valid) {
      const seleccionado: SupervisoraPerfil = this.formGroup.get('nombres')!.value as unknown as SupervisoraPerfil;
      const fechaDesvinculacion = this.formGroup.get('fechaDesvinculacion')!.value as unknown as string;

      if (seleccionado) {
        const idSolicitudDecrypt = Number(this.decrypt(this.idSolicitud));

        let personalBaja: any = {
          idSolicitud: idSolicitudDecrypt,
          personaBaja: seleccionado.supervisora,
          perfilBaja: seleccionado.perfil,
          feFechaDesvinculacion: this.formatearFecha(fechaDesvinculacion),
        }

        this.reemplazoService
          .guardarBajaPersonal(personalBaja)
          .subscribe({
            next: () => {
              console.log('Baja personal registrada correctamente');
              this.formGroup.reset();
            },
            error: (err) => {
              console.error('Error al registrar la baja', err);
            }
          });
      }

      this.formGroup.reset();
      this.cargarTabla();
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  eliminarPersonalBaja(row: PersonalReemplazo): void {
    let idSolicitudDecrypt = Number(this.decrypt(this.idSolicitud));
    const idReemplazo = row.idReemplazo;

    this.reemplazoService.eliminarBajaPersonal(idReemplazo, idSolicitudDecrypt).subscribe({
      next: () => {
        console.log('Baja personal eliminada correctamente');
        this.cargarTabla();
      }
    });
  }

  cargarTabla() {
    this.idSolicitudDecrypt = Number(this.decrypt(this.idSolicitud));

    this.reemplazoService
    .listarPersonalReemplazo(this.idSolicitudDecrypt)
    .subscribe(response => {
      this.listPersonalBaja = response.content.filter(item => !!item.personaBaja);
    });
  }


  cargarCombo(): void {
    let idSolicitudDecrypt = Number(this.decrypt(this.idSolicitud));
        console.log("ID SOLICITUD -> ", idSolicitudDecrypt);

    this.contratoService.obtenerSolicitudPorId(Number(idSolicitudDecrypt)).subscribe((response) => {
        this.contrato = response;
        console.log("CONTRATO -> ", this.contrato)
        this.tipoContratoSeleccionado = this.contrato.tipoContratacion.idListadoDetalle;
      });

      //contrato.propuesta?.idPropuesta

    this.reemplazoService.listarSupervisoraPerfil(1121).subscribe((response) => {
      this.listBajaPersonalPropuesto = response.content;
      console.log("LISTA DE BAJA PERSONAL PROPUESTO -> ", this.listBajaPersonalPropuesto);
    });


  }

  decrypt(encryptedData: string): string {
        const bytes = CryptoJS.AES.decrypt(encryptedData, URL_DECRYPT);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted;
  }

  getNombreCompleto(persona: Supervisora): string {
    if (!persona) return '';
    return `${persona.nombres} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`.trim();
  }

  private formatearFecha(fecha: string | Date): string {
  const fechaObj = new Date(fecha);
  return `${String(fechaObj.getDate()).padStart(2, '0')}/${
    String(fechaObj.getMonth() + 1).padStart(2, '0')}/${fechaObj.getFullYear()}`;
}
}
