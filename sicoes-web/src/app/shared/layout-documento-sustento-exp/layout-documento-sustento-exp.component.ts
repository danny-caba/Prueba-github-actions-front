import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { Documento } from 'src/app/interface/documento.model';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { DocumentoService } from 'src/app/service/documento.service';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { RolEnum, SolicitudEstadoEnum } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { BasePageComponent } from '../components/base-page.component';
import { ModalDocumentosSustentanComponent } from '../modal-documentos-sustentan/modal-documentos-sustentan.component';

@Component({
  selector: 'vex-layout-documento-sustento-exp',
  templateUrl: './layout-documento-sustento-exp.component.html',
  styleUrls: ['./layout-documento-sustento-exp.component.scss'],
  animations: [
    stagger80ms
  ]
})
export class LayoutDocumentoSustentoExpComponent extends BasePageComponent<Documento> implements OnInit, OnDestroy {

  suscriptionSolicitud: Subscription;
  solicitud: Partial<Solicitud>
  bolEvaluar: boolean = false

  usuario$ = this.authFacade.user$;
  esExterno: boolean = false;

  displayedColumns: string[] = [];

  serviceTable(filtro: any) {
    return this.documentoService.buscarDocumentos(filtro);
  }

  obtenerFiltro() {
    return {
      solicitudUuid: this.solicitud.solicitudUuid
    };
  }

  constructor(
    private dialog: MatDialog,
    private authFacade: AuthFacade,
    private solicitudService: SolicitudService,
    private documentoService: DocumentoService,
    private adjuntoService: AdjuntosService

  ) {
    super();
  }

  ngOnInit(): void {
    this.suscribirSolicitud();
    if (this.solicitud?.estado?.idListadoDetalle == 70) {
      this.bolEvaluar = true
    }
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
        'nombreEntidad',
        'descripcionContrato',
        'fechaInicio',
        'fechaFin',
        'duracion',
        'archivo',
        //'estado',
        'acciones'
      ];
    }else if(this.esExterno){
      this.displayedColumns = [
        'nombreEntidad',
        'descripcionContrato',
        'fechaInicio',
        'fechaFin',
        'duracion',
        'archivo',
        //'estado',
        'acciones'
      ];
    }else{
      this.displayedColumns = [
        'nombreEntidad',
        'descripcionContrato',
        'fechaInicio',
        'fechaFin',
        'duracion',
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
      if (sol) {
        this.solicitud = sol;
        this.cargarTabla();
        this.mostrarColumnas();
      }
    });
  }

  agregarDocumento() {
    this.dialog.open(ModalDocumentosSustentanComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        solicitud: this.solicitud,
        accion: 'add',
        flagTerminos: !this.iteneRegistros()
      },
    }).afterClosed().subscribe(() => {
      this.cargarTabla();
    });
  }

  actualizarVer(obj, action) {
    if (action == 'verObservacion') {
      action = 'viewEval'
      obj.idDocumento = obj.idDocumentoPadre;
    }
    this.dialog.open(ModalDocumentosSustentanComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
        solicitud: this.solicitud,
        accion: action,
        documento: obj,
        flagTerminos: false
      },
    }).afterClosed().subscribe(() => {
      this.cargarTabla();
    });
  }

  eliminarDocumento(obj) {
    functionsAlert.questionSiNo('¿Seguro que desea eliminar el registro?').then((result) => {
      if (result.isConfirmed) {
        this.documentoService.eliminar(obj.idDocumento).subscribe(sol => {
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
}
