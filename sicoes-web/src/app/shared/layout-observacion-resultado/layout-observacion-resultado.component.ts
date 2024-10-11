import { Component,  OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { SolicitudEstadoEnum } from 'src/helpers/constantes.components';
import { functions } from 'src/helpers/functions';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { BaseComponent } from '../components/base.component';

@Component({
  selector: 'vex-layout-observacion-resultado',
  templateUrl: './layout-observacion-resultado.component.html',
  styleUrls: ['./layout-observacion-resultado.component.scss']
})
export class LayoutObservacionResultadoComponent extends BaseComponent implements OnInit, OnDestroy {
  
  suscriptionSolicitud: Subscription;
  solicitud: Partial<Solicitud>
  cmpTipoRevisionEdit: boolean = false;
  ultimaVersion = true;

  tieneCambiosPendientesAdm: boolean = true
  tieneCambiosPendientesTec: boolean = true

  formGroup = this.fb.group({
    ctrlObsAdmini: [''],
    ctrlObsTecnic: ['']
  });

  constructor(
    private solicitudService: SolicitudService,
    private fb: FormBuilder
    ) {
    super();
  }

  ngOnInit(): void {
    this.suscribirSolicitud();
    this.formGroup.controls.ctrlObsAdmini.valueChanges.subscribe(value => {
      console.info("cambAd")
      this.tieneCambiosPendientesAdm = true;
    })

    this.formGroup.controls.ctrlObsTecnic.valueChanges.subscribe(value => {
      console.info("cambTe")
      this.tieneCambiosPendientesTec = true;
    })
  }

  ngOnDestroy() {
    this.suscriptionSolicitud.unsubscribe();
  }

  private suscribirSolicitud(){
    this.suscriptionSolicitud = this.solicitudService.suscribeSolicitud().subscribe(sol => {
      if(sol?.solicitudUuid){
        this.solicitud = sol;
        if(this.solicitud.estado.codigo == SolicitudEstadoEnum.OBSERVADO && functions.noEsVacio(this.solicitud.solicitudUuidPadre)){
          this.solicitudUuid = this.solicitud?.solicitudUuidPadre;
        }else{
          this.solicitudUuid = this.solicitud?.solicitudUuid;
        }
        this.cargarDatos();
      }
    });
  }

  cargarDatos(){
    if(functions.esVacio(this.solicitudUuid)) return;
    this.solicitudService.obtenerSolicitud(this.solicitudUuid).subscribe( resp => {
      this.formGroup.controls.ctrlObsAdmini.setValue(resp.observacionAdmnistrativa)
      this.formGroup.controls.ctrlObsTecnic.setValue(resp.observacionTecnica)
    })

    if (this.cmpTipoRevisionEdit == false && functions.noEsVacio(this.solicitud.solicitudUuidPadre)) {
      if(this.solicitud.estado.codigo != SolicitudEstadoEnum.OBSERVADO){
        this.cmpTipoRevisionEdit = true;
      }
    }

  }

  guadarObsAdmin(){
    let objSol: any = {
      solicitudUuid: this.solicitud.solicitudUuid,
      observacionAdmnistrativa: this.formGroup.controls.ctrlObsAdmini.getRawValue(),
      observacionTecnica: this.formGroup.controls.ctrlObsTecnic.getRawValue()
    }

    this.solicitudService.registrarObservacionAdm(objSol).subscribe(obj => {
      this.tieneCambiosPendientesAdm = false;
      this.solicitud.observacionAdmnistrativa = obj.observacionAdmnistrativa;
      functionsAlert.successDescargar('Observación Actualizada').then((result) => {
        
      });
    });
  }

  guadarObsTecn(){
    let objSol: any = {
      solicitudUuid: this.solicitud.solicitudUuid,
      observacionAdmnistrativa: this.formGroup.controls.ctrlObsAdmini.getRawValue(),
      observacionTecnica: this.formGroup.controls.ctrlObsTecnic.getRawValue()
    }

    this.solicitudService.registrarObservacionTec(objSol).subscribe(obj => {
      this.tieneCambiosPendientesTec = false;
      this.solicitud.observacionTecnica = obj.observacionTecnica;
      functionsAlert.successDescargar('Observación Actualizada').then((result) => {
        
      });
    });
  }

  solicitudUuidPrincipal;
  solicitudUuid;

  changeVersion(version: any) {
    if (version.codigo == 'V1') {
      this.solicitudUuidPrincipal = this.solicitud.solicitudUuid;
      this.solicitudUuid = this.solicitud?.solicitudUuidPadre
      this.ultimaVersion = false;
      this.cargarDatos();
    } else {
      this.solicitudUuid = this.solicitudUuidPrincipal;
      this.ultimaVersion = true;
      this.cargarDatos();
    }
  }

  validarCambiosAdm(){
    let b = false;
    if(this.tieneCambiosPendientesAdm){
      console.info(this.formGroup.controls.ctrlObsAdmini.getRawValue() != this.solicitud.observacionAdmnistrativa)
      b = this.formGroup.controls.ctrlObsAdmini.getRawValue() != this.solicitud.observacionAdmnistrativa;
    }
    return b;
  }

  validarCambiosTec(){
    let b = false;
    if(this.tieneCambiosPendientesTec){
      console.info(this.formGroup.controls.ctrlObsTecnic.getRawValue() != this.solicitud.observacionTecnica)
      b = this.formGroup.controls.ctrlObsTecnic.getRawValue() != this.solicitud.observacionTecnica;
    }
    return b;
  }
  
}
