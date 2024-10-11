import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { EvaluadorService } from 'src/app/service/evaluador.service';
import { BasePageComponent } from '../components/base-page.component';
import { ModalAprobadorComponent } from '../modal-aprobador/modal-aprobador.component';
import { EvaluadorRol } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { CmpAprobadorComponent } from '../cmp-aprobador/cmp-aprobador.component';

@Component({
  selector: 'vex-layout-aprobacion',
  templateUrl: './layout-aprobacion.component.html',
  styleUrls: ['./layout-aprobacion.component.scss'],
  animations: [
    stagger80ms
  ]
})
export class LayoutAprobacionComponent extends BasePageComponent<any> implements OnInit, OnDestroy {
  
  @ViewChild('cmpAprobador', { static: false }) cmpAprobador: CmpAprobadorComponent;

  suscriptionSolicitud: Subscription;
  solicitud: Partial<Solicitud>

  displayedColumns: string[] = [
    'usuario',
    'grupo',
    'fecha',
    'estado'
  ];

  displayedColumnsView: string[] = [
    'usuario',
    'grupo',
    'fecha',
    'estado'
  ];
  
  serviceTable(filtro: any) {
    return this.evaluadorService.listarAsignaciones(filtro);
  }

  obtenerFiltro() {
    return { 
      codigoTipoAprobador: EvaluadorRol.APROBADOR_TECNICO_COD,
      solicitudUuid: this.solicitud?.solicitudUuid 
    };
  }

  constructor(
    private dialog: MatDialog,
    private solicitudService: SolicitudService,
    private evaluadorService: EvaluadorService,
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
      this.solicitud = sol;
      if(this.solicitud?.solicitudUuid){
        this.cargarTabla();
      }
    });
  }

  agregarPerfil(){
    this.dialog.open(ModalAprobadorComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        solicitud: this.solicitud,
        accion: 'add'
      },
    }).afterClosed().subscribe(() => {
      this.cargarTabla();
    });
  }

  eliminar(obj){
    this.cmpAprobador.eliminar(obj);
  }

  modificar(obj) {
    this.dialog.open(ModalAprobadorComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        solicitud: this.solicitud,
        accion: 'modify',
        aprobador: obj
      },
    }).afterClosed().subscribe(() => {
      this.cargarTabla();
    });
  }

}
