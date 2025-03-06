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
import { Observable } from 'rxjs';
import { LoadingDialogService } from 'src/helpers/loading';
import { BaseComponent } from 'src/app/shared/components/base.component';
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private seccionService: SeccionService,
    private contratoService: ContratoService,
    private parametriaService: ParametriaService,
    private router: Router
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
    let idSolicitud = this.activatedRoute.snapshot.paramMap.get('idSolicitud');
    
    if (idSolicitud) {
      this.seccionService.obtenerSeccionPorSolicitud(Number(idSolicitud)).subscribe((response) => {
        this.secciones = Array.isArray(response) ? response : [response];
        this.contratoService.obtenerSolicitudPorId(Number(idSolicitud)).subscribe((response) => {
          this.contrato = response;
          this.tipoContratoSeleccionado = this.contrato.tipoContratacion.idListadoDetalle;
          this.esSubsanacion = this.contrato?.tipoSolicitud === '2';
        });
      });

    }
  }

  registrar() {
    functionsAlert.questionSiNo('¿Está seguro de querer registrar los requisitos del formulario de Perfeccionamiento de Contrato?').then((result) => {
      if (result.isConfirmed) {
        let formValues = this.obtenerDatos();
        let listFormValues = [
          ...formValues.documentoContrato,
          ...formValues.fielCumplimiento,
          ...formValues.montoDiferencial
        ];

        this.contratoService.registrarPerfeccionamiento(Number(this.activatedRoute.snapshot.paramMap.get('idSolicitud')),   this.tipoContratoSeleccionado, listFormValues).subscribe(expediente => {
          let nroExpDes = `Se ha registrado la solicitud de perfeccionamiento de contrato y los archivos han sido subidos al expediente ${expediente}`;
          functionsAlert.success(nroExpDes).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate([Link.EXTRANET, Link.CONTRATOS_LIST]);
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

  obtenerDatos() {
    let formValues: any = {};

    this.documentoContratoComponents.forEach((docContrato) => {
      formValues.documentoContrato = docContrato.getValues();
    });

    this.personalPropuestoComponents.forEach((personalPropuesto) => {
      // formValues.personalPropuesto = personalPropuesto.getValues();
      // console.log(personalPropuesto.getValues());
      
    });
    
    this.fielCumplimientoComponents.forEach((fielCumplimiento) => {
      formValues.fielCumplimiento = fielCumplimiento.getValues();
      
    });

    this.montoDiferencialComponents.forEach((montoDiferencial) => {
      formValues.montoDiferencial = montoDiferencial.getValues();
    });
    
    return formValues;
  }

  cargarTipoContrato() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.TIPO_CONTRATO,
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

}
