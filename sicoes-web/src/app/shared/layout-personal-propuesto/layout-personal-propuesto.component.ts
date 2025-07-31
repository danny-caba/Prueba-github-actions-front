import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../components/base.component';
import { FormBuilder, Validators } from '@angular/forms';
import { PersonalPropuesto, PersonalReemplazo } from 'src/app/interface/reemplazo-personal.model';
import { ActivatedRoute } from '@angular/router';
import { SeccionService } from 'src/app/service/seccion.service';
import { ContratoService } from 'src/app/service/contrato.service';
import { Seccion } from 'src/app/interface/seccion.model';
import * as CryptoJS from 'crypto-js';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { PersonalReemplazoService } from 'src/app/service/personal-reemplazo.service';
import { Supervisora, SupervisoraPerfil } from 'src/app/interface/supervisora.model';

const URL_DECRYPT = '3ncr1pt10nK3yuR1';

@Component({
  selector: 'vex-layout-personal-propuesto',
  templateUrl: './layout-personal-propuesto.component.html',
  styleUrls: ['./layout-personal-propuesto.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class LayoutPersonalPropuestoComponent extends BaseComponent implements OnInit {

  @Input() isReview: boolean;
  @Input() isReviewExt: boolean;
  @Input() isCargaAdenda: boolean;
  @Input() idSolicitud: string;
  @Input() uuidSolicitud: string;
  @Input() perfilBaja: any;
  
  displayedColumns: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto', 'djNepotismo', 'djImpedimento', 'djNoVinculo', 'otrosDocumentos', 'actions'];
  displayedColumnsReview: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto'];

  listPersonalApto: SupervisoraPerfil[] = null;
  listPersonalPropuesto: PersonalReemplazo[] = null;
  listPersonalAgregado: PersonalPropuesto[] = [];

  secciones: Seccion[] = [];
  listTipoContrato: any;
  contrato: any;
  solicitud: any;
  editable: boolean = true;
  evaluar: boolean;
  view: boolean;
  tipoContratoSeleccionado: number;
  adjuntoCargadoDjNepotismo: boolean = false;
  adjuntoCargadoDjImpedimento: boolean = false;
  adjuntoCargadoDjNoVinculo: boolean = false;
  adjuntoCargadoOtros: boolean = false;
  marcaDjNepotismo: 'si' | 'no' | null = null;
  marcaDjImpedimento: 'si' | 'no' | null = null;
  marcaDjNoVinculo: 'si' | 'no' | null = null;
  marcaOtros: 'si' | 'no' | null = null;


  constructor(
    private fb: FormBuilder,
    private contratoService: ContratoService,
    private solicitudService: SolicitudService,
    private reemplazoService: PersonalReemplazoService
  ) {
    super();
  }

  formGroup = this.fb.group({
      nombreCompleto: [null, Validators.required],
      flagDjNepotismo: [false, Validators.requiredTrue],
      flagDjImpedimento: [false, Validators.requiredTrue],
      flagDjNoVinculo: [false, Validators.requiredTrue],
      flagOtros: [false, Validators.requiredTrue]
    });

  ngOnInit(): void {
    this.cargarCombo();
    this.obtenerSolicitud();
  }

  ngOnChanges() {
    if (this.perfilBaja) {
      this.cargarCombo();
      console.log('Ya puedo usar el perfilBaja:', this.perfilBaja);
    }
  }

  obtenerSolicitud() {
    let idSolicitudDecrypt = Number(this.decrypt(this.idSolicitud));

    this.solicitudService.buscarSolicitudes(idSolicitudDecrypt).subscribe( resp => {
    });
    
    
    if (idSolicitudDecrypt) {
      this.contratoService.obtenerSolicitudPorId(Number(idSolicitudDecrypt)).subscribe((response) => {
        this.contrato = response;
        this.tipoContratoSeleccionado = this.contrato.tipoContratacion.idListadoDetalle;
      });
    }
  }

  guardarPersonalPropuesto(): void {
      if (this.formGroup.valid) {
        const seleccionado: SupervisoraPerfil = this.formGroup.get('nombreCompleto')!.value as unknown as SupervisoraPerfil;
  
        if (seleccionado) { 
          const idPropuesto = seleccionado.supervisora.idSupervisora;

          let personalPropuesto: any = {
            idReemplazo: this.perfilBaja?.idReemplazo,
            personaPropuesta: seleccionado.supervisora,
            perfil: seleccionado.perfil
          }
  
          this.reemplazoService
            .guardarPersonalPropuesto(personalPropuesto)
            .subscribe({
              next: () => {
                console.log('Personal propuesto registrado correctamente');
                this.cargarTabla();
                this.cargarDocumentosReemplazo();
  
              },
              error: (err) => {
                console.error('Error al registrar propuesto', err);
              }
            });
        }
  
        this.cargarTabla();
      } else {
        this.formGroup.markAllAsTouched();
        console.error('Formulario inválido');
      }
    }
  
    eliminarPersonalPropuesto(row: PersonalReemplazo): void {
      const body = {
        idReemplazo: this.perfilBaja?.idReemplazo
      };
  
      this.reemplazoService.eliminarPersonalPropuesto(body).subscribe({
        next: () => {
          console.log('Baja personal eliminada correctamente');
          this.cargarTabla();
        }
      });
    }

  cargarCombo(): void {
    if (this.perfilBaja){
      this.reemplazoService
        .listarSupervisoraApto(this.perfilBaja.perfilBaja.idListadoDetalle)
        .subscribe(response => {
          this.listPersonalApto = response.content;
          console.log('Personal apto:', this.listPersonalApto);
        });
    }

  }

  cargarTabla() {
    const idSolicitudDecrypt = Number(this.decrypt(this.idSolicitud));

    this.reemplazoService
    .listarPersonalReemplazo(idSolicitudDecrypt)
    .subscribe(response => {
      this.listPersonalPropuesto = response.content.filter(item => !!item.personaPropuesta && item.idReemplazo == this.perfilBaja?.idReemplazo);
      console.log('Lista de personal propuesto:', this.listPersonalPropuesto);
    });


  }

  cargarDocumentosReemplazo() {
    this.reemplazoService.listarDocsReemplazo(this.perfilBaja.idReemplazo).subscribe(response => {
      console.log('Documentos de reemplazo:', response.content);
    });
  }

  setValueCheckedDjNepotismo(obj, even) {
    obj.flagDjNepotismo = even.value;
  }

  setValueCheckedDjImpedimento(obj, even) {
    obj.flagDjImpedimento = even.value;
  }

  setValueCheckedDjNoVinculo(obj, even) {
    obj.flagDjNoVinculo = even.value;
  }

  setValueCheckedOtros(obj, even) {
    obj.flagOtros = even.value;
  }

  onDjNepotismoAdjunta(valor: boolean) {
    this.adjuntoCargadoDjNepotismo = valor;
    this.formGroup.get('flagDjNepotismo')?.setValue(valor);
  }

  onDjImpedimentoAdjunta(valor: boolean) {
    this.adjuntoCargadoDjImpedimento = valor;
    this.formGroup.get('flagDjImpedimento')?.setValue(valor);
  }

  onDjNoVinculoAdjunta(valor: boolean) {
    this.adjuntoCargadoDjNoVinculo = valor;
    this.formGroup.get('flagDjNoVinculo')?.setValue(valor);
  }

  onOtrosAdjunta(valor: boolean) {
    this.adjuntoCargadoOtros = valor;
    this.formGroup.get('flagOtros')?.setValue(valor);
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

  descargaDjNepotismo() {}
  descargaDjImpedimento() {}
  descargaDjNoVinculo() {}
  descargaOtros() {}

}
