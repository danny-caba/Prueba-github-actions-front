import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { functions } from 'src/helpers/functions';
import { BasePageComponent } from '../components/base-page.component';

@Component({
  selector: 'vex-layout-documento-expediente',
  templateUrl: './layout-documento-expediente.component.html',
  styleUrls: ['./layout-documento-expediente.component.scss'],
  animations: [
    stagger80ms
  ]
})
export class LayoutDocumentoExpedienteComponent extends BasePageComponent<any> implements OnInit, OnDestroy {
  
  suscriptionSolicitud: Subscription;
  solitidud: Partial<Solicitud>

  displayedColumns: string[] = [
    'documento',
    'asunto',
    'archivo',
    'fechaCreacion',
    'creador'
  ];
  
  serviceTable(filtro: any) {
    return this.solicitudService.expedienteDocumento(filtro);
  }

  obtenerFiltro() {
    return { 
      solicitudUuid: this.solitidud.solicitudUuid 
    };
  }

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
        this.solitidud = sol;
        this.cargarTablaNoContent();
      }
    });
  }

  paserFecha(str){
    return functions.getDateParse(str);
  }
}
