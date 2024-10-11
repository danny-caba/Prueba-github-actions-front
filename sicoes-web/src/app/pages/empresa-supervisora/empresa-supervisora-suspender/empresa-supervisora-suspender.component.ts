import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { ListadoEnum, TipoSuspensionCancelacionEnum } from 'src/helpers/constantes.components';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { ParametriaService } from 'src/app/service/parametria.service';
import { SupervisoraService } from 'src/app/service/supervisora.service';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { DatePipe } from '@angular/common';
import { SuspeCancService } from 'src/app/service/susp-canc.service';
import { functions } from 'src/helpers/functions';

@Component({
  selector: 'vex-empresa-supervisora-suspender',
  templateUrl: './empresa-supervisora-suspender.component.html',
  styleUrls: ['./empresa-supervisora-suspender.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class EmpresaSupervisoraSuspenderComponent extends BaseComponent implements OnInit, OnChanges {

  SUPERVISORA: any
  @Input() SUSPENCION_CANCELACION: any
  @Input() editable: any = true

  formGroup = this.fb.group({
    numeroDocumento: [{value: '', disabled: true }],
    razonSocial: [{value: '', disabled: true }],
    causal: [null],
    sustento: [''],
    fechaInicio: [null],
    fechaFin: [null],
  });

  listCausalSuspender: any[]

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private intUrls: InternalUrls,
    private datePipe: DatePipe,
    private parametriaService: ParametriaService,
    private supervisoraService: SupervisoraService,
    private suspeCancService: SuspeCancService
  ) {
    super();
  }

  ngOnInit(): void {
    this.cargarCombo();

    let idSupervisora = this.activeRoute.snapshot.paramMap.get('idSupervisora');
    if(idSupervisora){
      this.supervisoraService.obtenerSupervisora(idSupervisora).subscribe( resp => {
        this.SUPERVISORA = resp;

        let nombres = this.SUPERVISORA.nombreRazonSocial ||  (this.SUPERVISORA.nombres + ' ' + this.SUPERVISORA.apellidoPaterno + ' ' + this.SUPERVISORA.apellidoMaterno);

        this.formGroup.controls.numeroDocumento.setValue(this.SUPERVISORA.numeroDocumento)
        this.formGroup.controls.razonSocial.setValue(nombres)

      })
    }

  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.CAUSAL_SUSPENSION
    ]).subscribe(listRes => {
      this.listCausalSuspender = listRes[0]
    })
  }

  eliminar(){
    functionsAlert.questionSiNo('¿Seguro que desea eliminar programación?').then((result) => {
      if (result.isConfirmed) {
        this.suspeCancService.eliminarSuspCanc(this.SUSPENCION_CANCELACION?.idSuspensionCancelacion).subscribe(obj => {
          functionsAlert.successHtml('Programación Eliminada').then((result) => {
            this.router.navigate([Link.INTRANET, Link.EMPRESA_SUPER_LIST]);
          });
        });
        
      }
    })
  }

  suspender(){
    if(functions.esVacio(this.SUSPENCION_CANCELACION?.idSuspensionCancelacion)){
      this.guardar();
    }else{
      this.actualizar();
    }
  }

  guardar(){
    functionsAlert.questionSiNo('¿Seguro que desea suspender?').then((result) => {
      if (result.isConfirmed) {
        let formValues = {
          ... this.formGroup.getRawValue(),
          supervisora: {
            idSupervisora: this.SUPERVISORA.idSupervisora
          },
          tipo: {
            codigo: TipoSuspensionCancelacionEnum.SUSPENDIDA
          },
          fechaInicio: this.datePipe.transform(this.formGroup.controls['fechaInicio']?.value, 'dd/MM/yyyy'),
          fechaFin: this.datePipe.transform(this.formGroup.controls['fechaFin']?.value, 'dd/MM/yyyy'),
        }
        
        let msj = `Se realizó la suspensión en el Registro de Precalificación de Empresas Supervisoras del Nro de Identificación Tributaria <b>Nro ${this.SUPERVISORA.codigoRuc}</b>`;

        this.suspeCancService.registrarSuspension(formValues).subscribe(obj => {
          functionsAlert.successHtml(msj).then((result) => {
            this.router.navigate([Link.INTRANET, Link.EMPRESA_SUPER_LIST]);
          });
        });
      }
    });
  }

  actualizar(){
    functionsAlert.questionSiNo('¿Seguro que desea actualizar?').then((result) => {
      if (result.isConfirmed) {
        let formValues = {
          idSuspensionCancelacion: this.SUSPENCION_CANCELACION.idSuspensionCancelacion,
          ... this.formGroup.getRawValue(),
          supervisora: {
            idSupervisora: this.SUSPENCION_CANCELACION.supervisora.idSupervisora
          },
          tipo: {
            codigo: TipoSuspensionCancelacionEnum.SUSPENDIDA
          },
          fechaInicio: this.datePipe.transform(this.formGroup.controls['fechaInicio']?.value, 'dd/MM/yyyy'),
          fechaFin: this.datePipe.transform(this.formGroup.controls['fechaFin']?.value, 'dd/MM/yyyy'),
        }
        
        let msj = `Se realizó la suspensión en el Registro de Precalificación de Empresas Supervisoras del Nro de Identificación Tributaria <b>Nro ${this.SUSPENCION_CANCELACION.supervisora.numeroDocumento}</b>`;

        this.suspeCancService.actualizarSuspension(formValues, this.SUSPENCION_CANCELACION.idSuspensionCancelacion).subscribe(obj => {
          functionsAlert.successHtml(msj).then((result) => {
            this.router.navigate([Link.INTRANET, Link.EMPRESA_SUPER_LIST]);
          });
        });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.SUSPENCION_CANCELACION) {
      let nombres = this.SUSPENCION_CANCELACION.supervisora.nombreRazonSocial ||  
        (this.SUSPENCION_CANCELACION.supervisora.nombres + ' ' + this.SUSPENCION_CANCELACION.supervisora.apellidoPaterno + ' ' + this.SUSPENCION_CANCELACION.supervisora.apellidoMaterno);

      this.formGroup.controls.numeroDocumento.setValue(this.SUSPENCION_CANCELACION.supervisora.numeroDocumento)
      this.formGroup.controls.razonSocial.setValue(nombres)
      this.formGroup.patchValue(this.SUSPENCION_CANCELACION)

      this.formGroup.controls.fechaInicio.setValue(functions.getFechaString(this.SUSPENCION_CANCELACION.fechaInicio));
      this.formGroup.controls.fechaFin.setValue(functions.getFechaString(this.SUSPENCION_CANCELACION.fechaFin));
    }

    if (!this.editable) {
      this.disableAllForm(this.formGroup);
    }
  }
}
