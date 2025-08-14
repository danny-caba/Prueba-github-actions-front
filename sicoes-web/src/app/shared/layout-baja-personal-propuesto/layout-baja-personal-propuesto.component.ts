import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
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
  @Input() personalReemplazo: PersonalReemplazo;

  @Output() perfilBajaEvent = new EventEmitter<any>();
  @Output() seccionCompletada = new EventEmitter<any>();

  displayedColumns: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto', 'perfil', 'fechaRegistro', 'fechaBaja', 'fechaDesvinculacion', 'actions'];
  displayedColumnsReview: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto', 'perfil', 'fechaRegistro', 'fechaBaja', 'fechaFinContrato'];

  listBajaPersonalPropuesto: SupervisoraPerfil[] = null;
  listPersonalBaja: PersonalReemplazo[] = [];
  listPersonalBajaReview: PersonalReemplazo[] = [];

  contrato: any;
  idSolicitudDecrypt: number;
  perfilBaja: any = null;

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
    this.isReview = this.isReview ?? false;
    this.isReviewExt = this.isReviewExt ?? false;
    this.isCargaAdenda = this.isCargaAdenda ?? false;

    if (!this.isReviewExt) {
      this.cargarCombo();
      this.cargarTabla();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['personalReemplazo'] && changes['personalReemplazo'].currentValue) {
        const nuevoPersonal = changes['personalReemplazo'].currentValue;
        this.cargarTablaReview(nuevoPersonal);
      }

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
            next: (resp) => {
              this.perfilBajaEvent.emit(resp);
              this.perfilBaja = resp;
              this.cargarTabla();
              this.seccionCompletada.emit(true);

            },
            error: (err) => {
              console.error('Error al registrar la baja', err);
            }
          });
      }

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
        this.cargarTabla();
        this.seccionCompletada.emit(false);
      }
    });
  }

  cargarTabla() {
    this.idSolicitudDecrypt = Number(this.decrypt(this.idSolicitud));

    this.reemplazoService
    .listarPersonalReemplazo(this.idSolicitudDecrypt)
    .subscribe(response => {
      this.listPersonalBaja = response.content.filter(item => !!item.personaBaja && item.idReemplazo == this.perfilBaja?.idReemplazo);
    });
  }


  cargarCombo(): void {
    let idSolicitudDecrypt = Number(this.decrypt(this.idSolicitud));

    this.reemplazoService.listarSupervisoraPerfil(idSolicitudDecrypt).subscribe((response) => {
      this.listBajaPersonalPropuesto = response.content;
    });
  }

  cargarTablaReview(personalReemplazo: PersonalReemplazo): void {
    this.listPersonalBajaReview = [...this.listPersonalBajaReview, personalReemplazo];
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
    if (typeof fecha === 'string') {
      const [year, month, day] = fecha.split('-').map(Number);
      return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    } else {
      const fechaObj = new Date(fecha);
      return `${String(fechaObj.getDate()).padStart(2, '0')}/${
        String(fechaObj.getMonth() + 1).padStart(2, '0')}/${fechaObj.getFullYear()}`;
    }
  }

}
