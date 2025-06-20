import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { CapacitacionService } from 'src/app/service/capacitacion.service';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { RolEnum, SolicitudEstadoEnum } from 'src/helpers/constantes.components';
import { functions } from 'src/helpers/functions';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { BasePageComponent } from '../components/base-page.component';
import { ModalCapacitacionComponent } from '../modal-capacitacion/modal-capacitacion.component';

@Component({
  selector: 'vex-layout-capacitacion',
  templateUrl: './layout-capacitacion.component.html',
  styleUrls: ['./layout-capacitacion.component.scss'],
  animations: [
    stagger80ms
  ]
})
export class LayoutCapacitacionComponent extends BasePageComponent<any> implements OnInit, OnDestroy {

  listCapacitacion: any[];
  suscriptionSolicitud: Subscription;
  solicitud: Partial<Solicitud>

  usuario$ = this.authFacade.user$;
  esExterno: boolean = false;
  @Input() editModified = false;

  displayedColumns: string[] = [];

  serviceTable(filtro: any) {
    return this.capacitacionService.buscarCapacitacion(filtro);
  }

  obtenerFiltro() {
    return {
      solicitudUuid: this.solicitud.solicitudUuid
    };
  }
  constructor(
    private solicitudService: SolicitudService,
    private authFacade: AuthFacade,
    private dialog: MatDialog,
    private capacitacionService: CapacitacionService,
    private adjuntoService: AdjuntosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.suscribirSolicitud();
    this.validarUsuarioExterno();
  }

  validarUsuarioExterno(){
    this.usuario$.subscribe(usu => {
      if(usu){
        let rolExterno = usu.roles?.find(c => c.codigo == RolEnum.USU_EXTER);
        if(rolExterno){
          this.esExterno = true;
        }else{
          this.esExterno = false;
        }
        this.mostrarColumnas();
      }
    })
  }

  mostrarColumnas(){
    if(this.esExterno && [SolicitudEstadoEnum.ARCHIVADO.valueOf(), SolicitudEstadoEnum.CONCLUIDO.valueOf(), SolicitudEstadoEnum.OBSERVADO.valueOf()].includes(this.solicitud?.estado?.codigo)){
      this.displayedColumns = [
        'tipoCapacitacion',
        'institucion',
        'nombreCapacitacion',
        'nroHoras',
        'fechaVigencia',
        'archivo',
        //'estado',
        'acciones'
      ];
    }else if(this.esExterno && this.editModified){
      this.displayedColumns = [
        'tipoCapacitacion',
        'institucion',
        'nombreCapacitacion',
        'nroHoras',
        'fechaVigencia',
        'archivo',
        'estado',
        'acciones'
      ];
    }else if(this.esExterno){
      this.displayedColumns = [
        'tipoCapacitacion',
        'institucion',
        'nombreCapacitacion',
        'nroHoras',
        'fechaVigencia',
        'archivo',
        //'estado',
        'acciones'
      ];
    }else{
      this.displayedColumns = [
        'tipoCapacitacion',
        'institucion',
        'nombreCapacitacion',
        'nroHoras',
        'fechaVigencia',
        'archivo',
        //'estado',
        'acciones'
      ];
    }
  }

  ngOnDestroy() {
    this.suscriptionSolicitud.unsubscribe();
  }

  private suscribirSolicitud() {
    this.suscriptionSolicitud = this.solicitudService.suscribeSolicitud().subscribe(sol => {
      this.solicitud = sol;
      if (this.solicitud?.solicitudUuid) {
        this.cargarTabla();
        this.mostrarColumnas();
      }
    });
  }

  agregarCapacitacion() {
    this.dialog.open(ModalCapacitacionComponent, {
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

  actualizarVer(obj, action) {
    if (action == 'verObservacion') {
      action = 'viewEval'
      obj.idEstudio = obj.idEstudioPadre;
    }
    if (action == 'ACC_EDITAR_ARCHIVO' && this.isOriginal(obj)) {
      action = 'editFile'
    }
    if (action == 'ACC_EDITAR_ARCHIVO' && !this.isOriginal(obj)) {
      action = 'edit'
    }
    this.dialog.open(ModalCapacitacionComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        solicitud: this.solicitud,
        accion: action,
        capacitacion: obj,
      },
    }).afterClosed().subscribe(() => {
      this.cargarTabla();
    });
  }

  eliminarPerfil(obj) {
    functionsAlert.questionSiNo('¿Seguro que desea eliminar el registro?').then((result) => {
      if (result.isConfirmed) {
        this.capacitacionService.eliminar(obj.idEstudio).subscribe(sol => {
          functionsAlert.success('Registro Eliminado').then((result) => {
            this.cargarTabla();
          });
        });
      }
    });
  }

  descargarArchivo(adj) {
    let nombreAdjunto = adj.nombre != null ? adj.nombre : adj.nombreReal
    this.adjuntoService.descargarWindowsJWT(adj.codigo, nombreAdjunto);
  }
  
  isOriginal(obj) {
    return obj?.estado?.nombre.toUpperCase() == 'ORIGINAL';
  }

}

