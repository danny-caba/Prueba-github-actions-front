import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { EstudioService } from 'src/app/service/estudio.service';
import { PidoService } from 'src/app/service/pido.service';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { RolEnum, SolicitudEstadoEnum } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { BasePageComponent } from '../components/base-page.component';
import { ModalGradosTitulosComponent } from '../modal-grados-titulos/modal-grados-titulos.component';

@Component({
  selector: 'vex-layout-grado-academico',
  templateUrl: './layout-grado-academico.component.html',
  styleUrls: ['./layout-grado-academico.component.scss'],
  animations: [
    stagger80ms
  ]
})
export class LayoutGradoAcademicoComponent extends BasePageComponent<any> implements OnInit, OnDestroy {

  suscriptionSolicitud: Subscription;
  solicitud: Partial<Solicitud>
  bolEvaluar: boolean
  @Input() editModified = false;

  usuario$ = this.authFacade.user$;
  esExterno: boolean = false;

  listEstudios: any

  displayedColumns: string[] = [];

  serviceTable(filtro: any) {
    return this.estudioService.buscarEstudios(filtro);
  }

  obtenerFiltro() {
    return {
      solicitudUuid: this.solicitud.solicitudUuid
    };
  }

  constructor(
    private pidoService: PidoService,
    private authFacade: AuthFacade,
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private solicitudService: SolicitudService,
    private estudioService: EstudioService,
    private adjuntoService: AdjuntosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.suscribirSolicitud();
    this.validarUsuarioExterno();
  }

  ngOnDestroy() {
    this.suscriptionSolicitud.unsubscribe();
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
    console.log(
      this.esExterno,
      this.editModified,
      this.solicitud?.estado?.codigo
    );
    
    if(this.esExterno && [SolicitudEstadoEnum.ARCHIVADO.valueOf(), SolicitudEstadoEnum.CONCLUIDO.valueOf(), SolicitudEstadoEnum.OBSERVADO.valueOf()].includes(this.solicitud?.estado?.codigo)){
      this.displayedColumns = [
        'fuente',
        'grado',
        'colegiado',
        'especialidad',
        'fechaDiploma',
        'institucion',
        'archivo',
        //'estado',
        'acciones'
      ];
    }else if(this.esExterno && this.editModified){
      this.displayedColumns = [
        'fuente',
        'grado',
        'colegiado',
        'especialidad',
        'fechaDiploma',
        'institucion',
        'archivo',
        'estado',
        'acciones'
      ];
    }else if(this.esExterno){
      this.displayedColumns = [
        'fuente',
        'grado',
        'colegiado',
        'especialidad',
        'fechaDiploma',
        'institucion',
        'archivo',
        //'estado',
        'acciones'
      ];
    }else{
      this.displayedColumns = [
        'fuente',
        'grado',
        'colegiado',
        'especialidad',
        'fechaDiploma',
        'institucion',
        'archivo',
        //'estado',
        'acciones'
      ];
    }
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

  obtenerSunedu() {
    let solicitudUuid = this.activeRoute.snapshot.paramMap.get('solicitudUuid');
    functionsAlert.questionSiNo('Se obtendrán datos de la SUNEDU.\n La segunda vez que se consulte por este medio\n se eliminarán los registros y los adjuntos\n que tengan como fuente SUNEDU.\n ¿Desea continuar?').then((result) => {
      if (result.isConfirmed) {
        this.pidoService.buscarSunedu(solicitudUuid).subscribe(res => {
          this.cargarTabla();
        });
      }
    });
  }

  agregarGrado() {
    this.dialog.open(ModalGradosTitulosComponent, {
      width: '700px',
      height: 'auto',
      data: {
        accion: 'add',
        solicitud: this.solicitud
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
    this.dialog.open(ModalGradosTitulosComponent, {
      width: '700px',
      height: 'auto',
      data: {
        estudio: obj,
        accion: action,
        solicitud: this.solicitud,
      },
    }).afterClosed().subscribe(() => {
      this.cargarTabla();
    });
  }

  validarBtnEliminar(obj) {
    if (obj.fuente.idListadoDetalle == 123) {
      return true;
    } else {
      return false;
    }
  }

  eliminarEstudio(estudio) {
    functionsAlert.questionSiNo('¿Seguro que desea eliminar el registro?').then((result) => {
      if (result.isConfirmed) {
        this.estudioService.eliminar(estudio.idEstudio).subscribe(res => {
          functionsAlert.success('Registro Eliminado').then((result) => {
            this.cargarTabla();
          });
        });
      }
    });
  }

  //FALTA VALIDAR FUNCION
  validarGrados() {
    let solicitudUuid = this.activeRoute.snapshot.paramMap.get('solicitudUuid');
    this.pidoService.obtenerEstudios(solicitudUuid).subscribe(res => {
      this.listEstudios = res.content
      this.listEstudios.length = res.totalElements;
    })

    if (this.listEstudios.length >= 1) {
      return true;
    } else {
      return false;
    }
  }

  descargarArchivo(adj) {
    let nombreAdjunto = adj.nombre != null ? adj.nombre : adj.nombreReal
    this.adjuntoService.descargarWindowsJWT(adj.codigo, nombreAdjunto);
  }
  
  isOriginal(obj) {
    return obj?.estado?.nombre.toUpperCase() == 'ORIGINAL';
  }

}
