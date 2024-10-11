import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { BaseComponent } from '../components/base.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { Subscription } from 'rxjs';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { EvaluadorService } from 'src/app/service/evaluador.service';
import { EvaluadorRol } from 'src/helpers/constantes.components';
import { functions } from 'src/helpers/functions';

@Component({
  selector: 'vex-modal-perfil-asignacion',
  templateUrl: './modal-perfil-asignacion.component.html',
  styleUrls: ['./modal-perfil-asignacion.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ModalPerfilAsignacionComponent extends BaseComponent implements OnInit, OnDestroy {

  suscriptionSolicitud: Subscription;
  solicitud: Partial<Solicitud>
  perfil: any;
  listarEvaladoresAsignadosAdministrativo;
  listarEvaladoresAsignadosTecnico;
  cmpTipoRevisionEdit: boolean = false;
  ultimaVersion = true;
  modify: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<ModalPerfilAsignacionComponent>,
    private solicitudService: SolicitudService,
    private evaluadorService: EvaluadorService
  ) {
    super();
    this.suscribirSolicitud();
    this.solicitud = data?.solicitud;
    this.perfil = data.perfil;
    this.modify = data.accion == 'modify';
   }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

  private suscribirSolicitud() {
    this.suscriptionSolicitud = this.solicitudService.suscribeSolicitud().subscribe(sol => {
      if(sol?.solicitudUuid){
        this.solicitud = sol;
        if (this.cmpTipoRevisionEdit == false && functions.noEsVacio(this.solicitud.solicitudUuidPadre)) {
          //if(this.solicitud.estado.codigo != SolicitudEstadoEnum.OBSERVADO){
            this.cmpTipoRevisionEdit = true;
          //}
        }
      }
    });
  }

}


