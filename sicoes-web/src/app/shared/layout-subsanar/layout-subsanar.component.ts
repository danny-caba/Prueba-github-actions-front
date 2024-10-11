import { Component,  OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { BaseComponent } from '../components/base.component';
import { functions } from 'src/helpers/functions';
import { SolicitudEstadoEnum } from 'src/helpers/constantes.components';

@Component({
  selector: 'vex-layout-subsanar',
  templateUrl: './layout-subsanar.component.html',
  styleUrls: ['./layout-subsanar.component.scss']
})
export class LayoutSubsanarComponent extends BaseComponent implements OnInit, OnDestroy {

  suscriptionSolicitud: Subscription;
  solicitud: Partial<Solicitud>
  solicitudUuid: any;
  solicitudUuidPrincipal: any;

  ctrlFechaMaxima: UntypedFormControl = new UntypedFormControl();

  constructor(
    private solicitudService: SolicitudService
    ) {
    super();
  }

  ngOnInit(): void {
    this.suscribirSolicitud();
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
        this.solicitudUuidPrincipal = this.solicitudUuid;
        this.cargarDatos();
      }
    });
  }

  cargarDatos(){
    if(functions.esVacio(this.solicitudUuid)) return;
    this.solicitudService.obtenerSolicitud(this.solicitudUuid).subscribe( resp => {
      this.ctrlFechaMaxima.setValue(resp.fechaPlazoSub);
    })
  }

  verObservacion(){

  }
}
