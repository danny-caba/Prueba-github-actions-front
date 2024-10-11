import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { DocumentoService } from 'src/app/service/documento.service';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { RolEnum, SolicitudEstadoEnum } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { BasePageComponent } from '../components/base-page.component';
import { ModalDocumentosAcreditanPJComponent } from '../modal-documentos-acreditan-pj/modal-documentos-acreditan-pj.component';

@Component({
  selector: 'vex-layout-documento-acredita-exp',
  templateUrl: './layout-documento-acredita-exp.component.html',
  styleUrls: ['./layout-documento-acredita-exp.component.scss'],
  animations: [
    stagger80ms
  ]
})
export class LayoutDocumentoAcreditaExpComponent extends BasePageComponent<any> implements OnInit, OnDestroy {

  suscriptionSolicitud: Subscription;
  solicitud: Partial<Solicitud>
  @Input() editable: boolean = false;

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
    private solicitudService: SolicitudService,
    private authFacade: AuthFacade,
    private dialog: MatDialog,
    private documentoService: DocumentoService,
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
        'nombreEntidad',
        'subSector',
        'descripcionContrato',
        'codigoContrato',
        'fechaInicio',
        'fechaFin',
        'cuentaConformidad',
        'tipoCambio',
        'montoContratado',
        'montoTipoCambio',
        'montoContratoSol',
        'archivo',
        //'estado',
        'acciones'
      ];
    }else if(this.esExterno){
      this.displayedColumns = [
        'nombreEntidad',
        'subSector',
        'descripcionContrato',
        'codigoContrato',
        'fechaInicio',
        'fechaFin',
        'cuentaConformidad',
        'tipoCambio',
        'montoContratado',
        'montoTipoCambio',
        'montoContratoSol',
        'archivo',
        //'estado',
        'acciones'
      ];
    }else{
      this.displayedColumns = [
        'nombreEntidad',
        'subSector',
        'descripcionContrato',
        'codigoContrato',
        'fechaInicio',
        'fechaFin',
        'cuentaConformidad',
        'tipoCambio',
        'montoContratado',
        'montoTipoCambio',
        'montoContratoSol',
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

        if([SolicitudEstadoEnum.ARCHIVADO.valueOf(), SolicitudEstadoEnum.CONCLUIDO.valueOf(), SolicitudEstadoEnum.OBSERVADO.valueOf()].includes(this.solicitud.estado.codigo)){
          this.displayedColumns = [
            'nombreEntidad',
            'subSector',
            'descripcionContrato',
            'codigoContrato',
            'fechaInicio',
            'fechaFin',
            'cuentaConformidad',
            'tipoCambio',
            'montoContratado',
            'montoTipoCambio',
            'montoContratoSol',
            'archivo',
            'estado',
            'acciones'
          ];
        }

      }
    });
  }

  agregarDocumento() {
    this.dialog.open(ModalDocumentosAcreditanPJComponent, {
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
    this.dialog.open(ModalDocumentosAcreditanPJComponent, {
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

  evaluar(obj, action) {
    this.dialog.open(ModalDocumentosAcreditanPJComponent, {
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

}
