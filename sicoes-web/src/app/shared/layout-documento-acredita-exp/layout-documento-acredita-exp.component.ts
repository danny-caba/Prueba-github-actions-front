import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { DocumentoService } from 'src/app/service/documento.service';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { EvaluadorRol, RolEnum, SolicitudEstadoEnum } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { BasePageComponent } from '../components/base-page.component';
import { ModalDocumentosAcreditanPJComponent } from '../modal-documentos-acreditan-pj/modal-documentos-acreditan-pj.component';
import { PerfilService } from 'src/app/service/perfil.service';
import { EvaluadorService } from 'src/app/service/evaluador.service';

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
  @Input() editModified = false;
  usuario: any;
  usuario$ = this.authFacade.user$;
  esExterno: boolean = false;

  ACC_EDITAR_ARCHIVO = 'ACC_EDITAR_ARCHIVO';

  displayedColumns: string[] = [];
  esEvaluadorTecnico: boolean;
  

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
    private adjuntoService: AdjuntosService,
    private perfilService: PerfilService,
    private evaluadorService: EvaluadorService
  ) {
    super();
  }

  currentUserId: number;
  actividadAsignadaId: number[] = [];

  ngOnInitBorrar(): void {
    this.suscribirSolicitud();
    this.validarUsuarioExterno();
  }

  ngOnInit(): void {
    this.suscribirSolicitud();
    this.validarUsuarioExterno();
    
    this.usuario$.subscribe(usu => {
        if (usu) {
            this.usuario = usu;
            this.currentUserId = usu.idUsuario;
            this.actividadAsignada();
            
            if (this.solicitud?.solicitudUuid) {
                this.cargarEvaluadoresTecnicos(this.solicitud.solicitudUuid);
            }
        }
    });
  }

  actividadAsignada(): void {
    
    if (!this.solicitud?.solicitudUuid) return;
    
    this.perfilService.buscarPerfiles({
        solicitudUuid: this.solicitud.solicitudUuid
    }).subscribe(response => {
        this.actividadAsignadaId = response.content
            .filter(item => item.usuario?.idUsuario === this.currentUserId)
            .map(item => item.actividadArea?.idListadoDetalle)
            .filter(id => id != null);
    });
  }

  descargaHabilitada(documento: any): boolean {
    
    if (this.esExterno) {
        return true;
    }
    if (!this.esEvaluadorTecnico) {
        return true;
    }

    if (this.actividadAsignadaId.length === 0) return false;

    return this.actividadAsignadaId.includes(documento.actividadArea?.idListadoDetalle);
  }

  listarEvaladoresAsignadosTecnico
  cargarEvaluadoresTecnicos(solicitudUuid: string): void {
    this.evaluadorService.listarAsignaciones({ 
        solicitudUuid: solicitudUuid, 
        size: 1000 
    }).subscribe({
        next: (listRes) => {
            this.esEvaluadorTecnico = listRes.content?.some(obj => 
                obj.tipo.codigo === EvaluadorRol.TECNICO_COD && 
                obj.usuario?.idUsuario === this.currentUserId
            ) || false;
        },
        error: (err) => {
            console.error('Error al cargar evaluadores:', err);
            this.esEvaluadorTecnico = false;
        }
    });
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
    }else if(this.esExterno && this.editModified){
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
        'areaSubCategoria',
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
    if (action == 'ACC_EDITAR_ARCHIVO' && this.isOriginal(obj)) {
      action = 'editFile'
    }
    if (action == 'ACC_EDITAR_ARCHIVO' && !this.isOriginal(obj)) {
      action = 'edit'
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

  isOriginal(obj) {
    return obj?.estado?.nombre.toUpperCase() == 'ORIGINAL';
  }

  isOriginalEval(obj) {
    return obj?.estado?.nombre.toUpperCase() == 'ORIGINAL';
  }

}
