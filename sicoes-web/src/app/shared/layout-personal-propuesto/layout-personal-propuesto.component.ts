import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../components/base.component';
import { FormBuilder, Validators } from '@angular/forms';
import { PersonalPropuesto } from 'src/app/interface/reemplazo-personal.model';
import { ActivatedRoute } from '@angular/router';
import { SeccionService } from 'src/app/service/seccion.service';
import { ContratoService } from 'src/app/service/contrato.service';
import { Seccion } from 'src/app/interface/seccion.model';
import * as CryptoJS from 'crypto-js';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';

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
  
  displayedColumns: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto', 'djNepotismo', 'djImpedimento', 'djNoVinculo', 'otrosDocumentos', 'actions'];
  displayedColumnsReview: string[] = ['tipoDocumento', 'numeroDocumento', 'nombreCompleto'];

  listPersonalPropuesto: PersonalPropuesto[] = null;
  listPersonalAgregado: PersonalPropuesto[] = [];

  secciones: Seccion[] = [];
  listTipoContrato: any;
  contrato: any;
  solicitud: any;
  editable: boolean = true;
  evaluar: boolean;
  view: boolean;
  tipoContratoSeleccionado: number;
  marcaDjNepotismo: 'si' | 'no' | null = null;
  marcaDjImpedimento: 'si' | 'no' | null = null;
  marcaDjNoVinculo: 'si' | 'no' | null = null;
  marcaOtros: 'si' | 'no' | null = null;


  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private seccionService: SeccionService,
    private contratoService: ContratoService,
    private solicitudService: SolicitudService
  ) {
    super();
  }

  formGroup = this.fb.group({
      nombreCompleto: [null, Validators.required],
      flagDjNepotismo: [null, Validators.required],
      flagDjImpedimento: [null, Validators.required],
      flagDjNoVinculo: [null, Validators.required],
      flagOtros: [null, Validators.required]
    });

  ngOnInit(): void {
    this.listPersonalPropuesto = [
      {
        idPersonal: 1,
        tipoDocumento: 'DNI',
        numeroDocumento: '12345678',
        nombreCompleto: 'Juan Pérez García',
        perfil: 'RND-11',
        fechaRegistro: '2025-06-10',
        fechaBaja: '',
        fechaDesvinculacion: '',
        docs: {
          nepotismo: {
            idListadoDetalle: 1,
            codigo: 'NEPOTISMO_1',
            nombre: 'DJ Nepotismo',
          },
          impedimento: {
            idListadoDetalle: 2,
            codigo: 'IMPEDIMENTO_1',
            nombre: 'DJ Impedimento',
          },
          novinculo: {
            idListadoDetalle: 3,
            codigo: 'NOVINCULO_1',
            nombre: 'DJ No Vínculo',
          },
          otros: {
            idListadoDetalle: 4,
            codigo: 'OTROS_1',
            nombre: 'Otros Documentos',
          }
        }
      }
    ];
    this.obtenerSolicitud();
    this.listPersonalAgregado = this.listPersonalPropuesto;
  }

  obtenerSolicitud() {
    let idSolicitudDecrypt = Number(this.decrypt(this.idSolicitud));

    this.solicitudService.buscarSolicitudes(idSolicitudDecrypt).subscribe( resp => {
    });
    
    
    if (idSolicitudDecrypt) {
      this.seccionService.obtenerSeccionPorSolicitud(Number(idSolicitudDecrypt)).subscribe((response) => {
        this.secciones = Array.isArray(response) ? response : [response];
      });

      this.contratoService.obtenerSolicitudPorId(Number(idSolicitudDecrypt)).subscribe((response) => {
        this.contrato = response;
        this.tipoContratoSeleccionado = this.contrato.tipoContratacion.idListadoDetalle;
      });
    }
  }

  doNothing(): void {


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

  decrypt(encryptedData: string): string {
      const bytes = CryptoJS.AES.decrypt(encryptedData, URL_DECRYPT);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted;
    }

}
