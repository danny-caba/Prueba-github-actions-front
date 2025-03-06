import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Seccion } from 'src/app/interface/seccion.model';
import { DocumentoContratoComponent } from 'src/app/pages/contrato/components/documento-contrato/documento-contrato.component';
import { FielCumplimientoComponent } from 'src/app/pages/contrato/components/fiel-cumplimiento/fiel-cumplimiento.component';
import { MontoDiferencialComponent } from 'src/app/pages/contrato/components/monto-diferencial/monto-diferencial.component';
import { PersonalPropuestoComponent } from 'src/app/pages/contrato/components/personal-propuesto/personal-propuesto.component';
import { ContratoService } from 'src/app/service/contrato.service';
import { ParametriaService } from 'src/app/service/parametria.service';
import { SeccionService } from 'src/app/service/seccion.service';
import { ListadoEnum } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';

@Component({
  selector: 'vex-contrato-form-evaluar',
  templateUrl: './contrato-form-evaluar.component.html'
})
export class ContratoFormEvaluarComponent implements OnInit {

  documentoContratoComponents: DocumentoContratoComponent[] = [];
  personalPropuestoComponents: PersonalPropuestoComponent[] = [];
  fielCumplimientoComponents: FielCumplimientoComponent[] = [];
  montoDiferencialComponents: MontoDiferencialComponent[] = []; 

  secciones: Seccion[] = [];
  listTipoContrato: any;
  contrato: any;
  editable: boolean;
  evaluar: boolean;
  view: boolean;
  tipoContratoSeleccionado: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private seccionService: SeccionService,
    private contratoService: ContratoService,
    private parametriaService: ParametriaService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      if (data.hasOwnProperty('editable')) {
        this.editable = data.editable;
      }
      if (data.hasOwnProperty('evaluar')) {
        this.evaluar = data.evaluar;
      }
      if (data.hasOwnProperty('view')) {
        this.view = data.view;
      }
    });
    
    this.obtenerSolicitud();
    this.cargarTipoContrato();
  }

  obtenerSolicitud() {
    let idSolicitud = this.activatedRoute.snapshot.paramMap.get('idSolicitud');
    
    if (idSolicitud) {
      this.seccionService.obtenerSeccionPorSolicitud(Number(idSolicitud)).subscribe((response) => {
        this.secciones = Array.isArray(response) ? response : [response];
      });

      this.contratoService.obtenerSolicitudPorId(Number(idSolicitud)).subscribe((response) => {
        this.contrato = response;
        this.tipoContratoSeleccionado = this.contrato.tipoContratacion.idListadoDetalle;
      });
    }
  }

  registrarRevision() {
    functionsAlert.questionSiNo('¿Seguro que desea finalizar la evaluación?').then((result) => {
      if (result.isConfirmed) {
        let formValues = this.obtenerDatos();
        let listFormValues = [];
        listFormValues.push(...formValues.documentoContrato);
        listFormValues.push(...formValues.fielCumplimiento);
        listFormValues.push(...formValues.montoDiferencial);

        // this.contratoService.registrarPerfeccionamiento(Number(this.activatedRoute.snapshot.paramMap.get('idSolicitud')), this.tipoContratoSeleccionado, listFormValues).subscribe(obj => {
        //   let nroExpDes = `Se ha registrado la solicitud de perfeccionamiento de contrato y los archivos han sido subidos al expediente ${obj.propuesta.procesoItem.proceso.numeroExpediente}`;
        //   functionsAlert.success(nroExpDes).then((result) => {
        //     if (result.isConfirmed) {

        //       this.router.navigate([Link.INTRANET, Link.CONTRATOS_LIST]);
        //     }
        //   });
        // });

        this.contratoService.finalizarEvaluacion(Number(this.activatedRoute.snapshot.paramMap.get('idSolicitud')), listFormValues).subscribe(obj => {
          functionsAlert.success('Se ha finalizado la evaluación').then((result) => {
            if (result.isConfirmed) {
              this.router.navigate([Link.INTRANET, Link.CONTRATOS_LIST]);
            }
          });
        });
        
      }
    });
  }

  toGoBandejaContratos() {
    functionsAlert.questionSiNo('¿Desea ir a la bandeja de contratos?').then((result) => {
        if (result.isConfirmed) {
          this.router.navigate([Link.INTRANET, Link.CONTRATOS_LIST]);
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
      console.log(personalPropuesto.getValues());
      
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
