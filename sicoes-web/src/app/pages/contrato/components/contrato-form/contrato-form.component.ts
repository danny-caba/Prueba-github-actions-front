import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Seccion } from 'src/app/interface/seccion.model';
import { SeccionService } from 'src/app/service/seccion.service';
import { DocumentoContratoComponent } from '../documento-contrato/documento-contrato.component';
import { PersonalPropuestoComponent } from '../personal-propuesto/personal-propuesto.component';
import { FielCumplimientoComponent } from '../fiel-cumplimiento/fiel-cumplimiento.component';
import { MontoDiferencialComponent } from '../monto-diferencial/monto-diferencial.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { ContratoService } from '../../../../service/contrato.service';
import { ParametriaService } from '../../../../service/parametria.service';
import { ListadoEnum } from 'src/helpers/constantes.components';
import { Link } from 'src/helpers/internal-urls.components';
import { BaseComponent } from 'src/app/shared/components/base.component';
import * as CryptoJS from 'crypto-js';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { LoadingDialogService } from 'src/helpers/loading';

const URL_DECRYPT = '3ncr1pt10nK3yuR1';

@Component({
  selector: 'vex-contrato-form',
  templateUrl: './contrato-form.component.html'
})
export class ContratoFormComponent extends BaseComponent implements OnInit {

  documentoContratoComponents: DocumentoContratoComponent[] = [];
  personalPropuestoComponents: PersonalPropuestoComponent[] = [];
  fielCumplimientoComponents: FielCumplimientoComponent[] = [];
  montoDiferencialComponents: MontoDiferencialComponent[] = []; 

  secciones: Seccion[] = [];
  listTipoContrato: any;
  contrato: any;
  esSubsanacion: boolean = false;
  editable: boolean = false;
  tipoContratoSeleccionado: number;
  idSolicitud: number;
  btnRegister: string = 'Registrar';

  constructor(
    private activatedRoute: ActivatedRoute,
    private seccionService: SeccionService,
    private contratoService: ContratoService,
    private parametriaService: ParametriaService,
    private router: Router,
    private loader: LoadingBarService,
    private loadingDialogService: LoadingDialogService
  ) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      if(data.editable){
        this.editable = data.editable;
      }
    });
    this.cargarTipoContrato();
  }

  obtenerSolicitud() {
    let idSolicitudHashed = this.activatedRoute.snapshot.paramMap.get('idSolicitud');

    this.idSolicitud = Number(this.decrypt(idSolicitudHashed));
    
    if (this.idSolicitud) {
      this.seccionService.obtenerSeccionPorSolicitud(this.idSolicitud).subscribe((response) => {
        this.secciones = Array.isArray(response) ? response : [response];
        this.contratoService.obtenerSolicitudPorId(this.idSolicitud).subscribe((response) => {
          this.contrato = response;
          this.tipoContratoSeleccionado = this.contrato.tipoContratacion.idListadoDetalle;
          this.esSubsanacion = this.contrato?.tipoSolicitud === '2';
          this.btnRegister = this.esSubsanacion ? 'Subsanar' : 'Registrar';
        });
      });
    }
  }

  registrar() {
    functionsAlert.questionSiNo('¿Está seguro de querer registrar los requisitos del formulario de Perfeccionamiento de Contrato?').then((result) => {
      if (result.isConfirmed) {
        const loaderRef = this.loader.useRef();
        loaderRef.start();
        this.loadingDialogService.openDialog();

        this.obtenerDatos().then(formValues => {
          let listFormValues = [
            ...formValues.documentoContrato,
            ...formValues.fielCumplimiento,
            ...formValues.montoDiferencial
          ];
          
          this.contratoService.registrarPerfeccionamiento(this.idSolicitud, this.tipoContratoSeleccionado, listFormValues).subscribe({
            next: (expediente) => {
              loaderRef.complete();
              this.loadingDialogService.hideDialog();

              let nroExpDes = `Se ha registrado la solicitud de perfeccionamiento de contrato y los archivos han sido subidos al expediente ${expediente}`;
              functionsAlert.success(nroExpDes).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate([Link.EXTRANET, Link.CONTRATOS_LIST]);
                }
              });
            },
            error: (err) => {
              loaderRef.complete();
              this.loadingDialogService.hideDialog();

              functionsAlert.error('Ha ocurrido un error al registrar los requisitos del formulario de Perfeccionamiento de Contrato.');
            }
          });
        });
      }
    });
  }

  toGoBandejaContratos() {
    functionsAlert.questionSiNo('¿Desea ir a la bandeja de contratos?').then((result) => {
        if (result.isConfirmed) {
          this.router.navigate([Link.EXTRANET, Link.CONTRATOS_LIST]);
        }
      });
  }

  obtenerDatos(): Promise<any> {
    return new Promise((resolve) => {
      let formValues: any = {};

      this.documentoContratoComponents.forEach((docContrato) => {
        formValues.documentoContrato = docContrato.getValues();
      });

      this.personalPropuestoComponents.forEach((personalPropuesto) => {
        // formValues.personalPropuesto = personalPropuesto.getValues();
        // console.log(personalPropuesto.getValues());
      });
      
      formValues.fielCumplimiento = [];
      formValues.montoDiferencial = [];
      
      const promesaFielCumplimiento = new Promise<void>((resolveFiel) => {
        if (this.fielCumplimientoComponents.length > 0) {
          const seccionParent = this.secciones.find(seccion => 
            seccion.deSeccion.includes('CARTA FIANZA DE FIEL CUMPLIMIENTO'));
            
          if (seccionParent) {
            this.seccionService.obtenerSeccionMaestraPorId(seccionParent.idSeccion).subscribe({
              next: (seccionMaestra) => {
                const adjudicacionStr = this.contrato.valorAdjSimplificada.toString().replace(',', '.');
                const MONTO_FIJO = Number(adjudicacionStr);
                let importeStr = this.contrato?.propuesta?.propuestaEconomica?.importe?.toString().replace(',', '.');
                let importe = Number(importeStr);
                
                if (seccionMaestra.flVisibleSeccion === '0') {
                  if (importe > MONTO_FIJO) {
                    formValues.fielCumplimiento = this.fielCumplimientoComponents[0].getValues();
                  }
                } else {
                  formValues.fielCumplimiento = this.fielCumplimientoComponents[0].getValues();
                }
                resolveFiel();
              },
              error: (err) => {
                console.error('Error al obtener sección maestra:', err);
                resolveFiel();
              }
            });
          } else {
            resolveFiel();
          }
        } else {
          resolveFiel();
        }
      });
      
      this.montoDiferencialComponents.forEach((montoDiferencial) => {
        formValues.montoDiferencial = montoDiferencial.getValues();
      });
      
      Promise.all([promesaFielCumplimiento]).then(() => {
        resolve(formValues);
      });
    });
  }

  cargarTipoContrato() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.TIPO_CONTRATO
    ]).subscribe(listRes => {
      this.listTipoContrato = listRes[0].filter((element) => element.orden !== 1);
      this.tipoContratoSeleccionado = this.listTipoContrato[0]?.idListadoDetalle;
      this.obtenerSolicitud();
    });
  }

  obtenerTipoContrato(event) {
    this.tipoContratoSeleccionado = event.value;
  }

  onDocumentoContratoInitialized(component: DocumentoContratoComponent) {
    this.documentoContratoComponents.push(component);
  }

  onPersonalPropuestoInitialized(component: PersonalPropuestoComponent) {
    this.personalPropuestoComponents.push(component);
  }

  onFielCumplimientoInitialized(component: FielCumplimientoComponent) {
    this.fielCumplimientoComponents.push(component);
  }
  
  onMontoDiferencialInitialized(component: MontoDiferencialComponent) {
    this.montoDiferencialComponents.push(component);
  }

  decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, URL_DECRYPT);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  }

}
