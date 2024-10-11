import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { EvaluadorService } from 'src/app/service/evaluador.service';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { EvaluadorRol } from 'src/helpers/constantes.components';
import { functions } from 'src/helpers/functions';
import { BaseComponent } from '../components/base.component';
import { TipoPersonaEnum } from 'src/helpers/constantes.components';

@Component({
  selector: 'vex-layout-asignacion',
  templateUrl: './layout-asignacion.component.html',
  styleUrls: ['./layout-asignacion.component.scss'],
  animations: [
    stagger80ms
  ]
})
export class LayoutAsignacionComponent extends BaseComponent implements OnInit, OnDestroy {
  
  suscriptionSolicitud: Subscription;
  solicitud: Partial<Solicitud>

  cmpTipoRevisionEdit: boolean = false;
  ultimaVersion = true;
  esJuridico: boolean = false;
  
  constructor(
    private solicitudService: SolicitudService,
    private evaluadorService: EvaluadorService
    ) {
    super();
    this.suscribirSolicitud()
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy() {
    this.suscriptionSolicitud.unsubscribe();
  }

  private suscribirSolicitud(){
    this.suscriptionSolicitud = this.solicitudService.suscribeSolicitud().subscribe(sol => {
      if(sol?.solicitudUuid){
        this.solicitud = sol;
        this.listarAsignados(this.solicitud.solicitudUuid);
        if (this.cmpTipoRevisionEdit == false && functions.noEsVacio(this.solicitud.solicitudUuidPadre)) {
          //if(this.solicitud.estado.codigo != SolicitudEstadoEnum.OBSERVADO){
            this.cmpTipoRevisionEdit = true;
          //}
        }

        if (this.solicitud?.persona?.tipoPersona?.codigo != TipoPersonaEnum.PN_PERS_PROPUESTO) {
          this.esJuridico = true;
        }
      }
    });
  }

  //solicitudUuidPrincipal;

  changeVersion(version: any) {
    if (version.codigo == 'V1') {
      let data = {
        accion: 'viewEval'
      }
      //this.solicitudUuidPrincipal = this.solicitud.solicitudUuidPadre
      this.listarAsignados(this.solicitud.solicitudUuidPadre);
      this.ultimaVersion = false;
    } else {
      this.listarAsignados(this.solicitud.solicitudUuid);
      this.ultimaVersion = true;
    }
  }

  listarEvaladoresAsignadosAdministrativo;
  listarEvaladoresAsignadosTecnico;

  listarAsignados(solicitudUuid) {
    this.listarEvaladoresAsignadosAdministrativo = [];
    this.listarEvaladoresAsignadosTecnico = [];
    this.evaluadorService.listarAsignaciones({ solicitudUuid: solicitudUuid, size: 1000 }).subscribe(listRes => {
      listRes.content?.forEach(obj => {
        if (obj.tipo.codigo == EvaluadorRol.ADMINIS_COD) {
          this.listarEvaladoresAsignadosAdministrativo.push(obj.usuario);
        }
        if (obj.tipo.codigo == EvaluadorRol.TECNICO_COD) {
          this.listarEvaladoresAsignadosTecnico.push(obj.usuario);
        }
      })
    })
  }

}
