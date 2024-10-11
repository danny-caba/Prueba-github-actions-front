import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { InternalUrls, Link } from 'src/helpers/internal-urls.components';
import { ListadoEnum } from 'src/helpers/constantes.components';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { AuthFacade } from 'src/app/auth/store/auth.facade';
import { ParametriaService } from 'src/app/service/parametria.service';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { SolicitudEstadoEnum } from 'src/helpers/constantes.components';
import { AdjuntosService } from 'src/app/service/adjuntos.service';
import { functions } from 'src/helpers/functions';
import { functionsAlert } from 'src/helpers/functionsAlert';

@Component({
  selector: 'vex-solicitud-list',
  templateUrl: './solicitud-list.component.html',
  styleUrls: ['./solicitud-list.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class SolicitudListComponent extends BasePageComponent<Solicitud> implements OnInit {

  intenalUrls: InternalUrls;
  user$ = this.authFacade.user$;

  ACC_HISTORIAL = 'ACC_HISTORIAL';
  ACC_REGISTRAR = 'ACC_REGISTRAR';
  ACC_EDITAR = 'ACC_EDITAR';
  ACC_DESCARGAR = 'ACC_DESCARGAR';
  ACC_SUBSANAR = 'ACC_SUBSANAR';
  ACC_VER = 'ACC_VER';
  ACC_ANULAR = 'ACC_ANULAR';

  formGroup = this.fb.group({
    fechaDesde: [''],
    nroExpediente: [''],
    estadoSolicitud: [null],
    fechaHasta: [''],
    tipoSolicitud: [null]
  });

  listEstadoSolicitud: any[]
  listTipoSolicitud: any[] = []

  displayedColumns: string[] = [
    'fechaRegistro',
    'tipoPersona',
    'nroExpediente',
    'tipoSolicitud',
    'estadoSolicitud',
    'actions'
  ];

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private fb: FormBuilder,
    private parametriaService: ParametriaService,
    private solicitudService: SolicitudService,
    private adjuntoService: AdjuntosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.cargarCombo();
    this.cargarTabla();
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.ESTADO_SOLICITUD,
      ListadoEnum.TIPO_SOLICITUD
    ]).subscribe(listRes => {
      this.listEstadoSolicitud = listRes[0]
      //this.listTipoSolicitud = listRes[1]
      listRes[1]?.forEach(item => {
        if(['INSCRIPCION'].includes(item.codigo)){
          this.listTipoSolicitud.push(item);
        }
      });
    })
  }

  serviceTable(filtro) {
    return this.solicitudService.buscarSolicitudes(filtro);
  }

  buscar() {
    this.paginator.pageIndex = 0;
    this.cargarTabla();
  }

  limpiar() {
    this.formGroup.reset();
    this.buscar();
  }

  obtenerFiltro() {
    let filtro: any = {
      idTipoSolicitud: this.formGroup.controls.tipoSolicitud.value?.idListadoDetalle,
      idEstadoSolicitud: this.formGroup.controls.estadoSolicitud.value?.idListadoDetalle,
      nroExpediente: this.formGroup.controls.nroExpediente.value,
    }
    return filtro;
  }

  nuevaSolicitud() {
    this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_OPCION]);
  }

  ver(sol) {
    this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_VIEW, sol.solicitudUuid]);
  }

  editar(sol) {
    this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_EDIT, sol.solicitudUuid]);
  }
  
  anular(sol) {
    functionsAlert.questionSiNo('¿Seguro que desea anular la solicitud?').then((result) => {
      if (result.isConfirmed) {
        this.solicitudService.anularSolicitud(sol).subscribe(sol => {
          functionsAlert.successHtml('Solicitud Anulada').then((result) => {
            this.formGroup.reset();
            this.paginator.pageIndex = 0;
            this.cargarTabla();
          });
        }); 
      }
    })
  }

  mostrarOpcion(opt, objSol) {
    if(opt == this.ACC_EDITAR && objSol.estado?.codigo == SolicitudEstadoEnum.BORRADOR) return true;
    if(opt == this.ACC_DESCARGAR && objSol.estado?.codigo == SolicitudEstadoEnum.EN_PROCESO) return true;
    //if(opt == this.ACC_SUBSANAR && objSol.estado?.codigo == SolicitudEstadoEnum.OBSERVADO && objSol.tipoSolicitud.codigo == SolicitudTipoEnum.SUBSANACION) return true;
    if(opt == this.ACC_SUBSANAR && objSol.estado?.codigo == SolicitudEstadoEnum.OBSERVADO && functions.noEsVacio(objSol.solicitudUuidPadre) && functions.noEsVacio(objSol.fechaPlazoSub)) return true;
    if(opt == this.ACC_DESCARGAR && objSol.estado?.codigo == SolicitudEstadoEnum.CONCLUIDO) return true;
    if(opt == this.ACC_ANULAR && !(objSol.estado?.codigo == SolicitudEstadoEnum.EN_PROCESO) && !(objSol.estado?.codigo == SolicitudEstadoEnum.OBSERVADO) && !(objSol.estado?.codigo == SolicitudEstadoEnum.CONCLUIDO)) return true;
    return false;
  }

  descargarFormato(sol){
    let formato04 = sol.archivos[0];
    if(formato04){
      let nombreAdjunto = formato04.nombre != null ? formato04.nombre : formato04.nombreReal
      this.adjuntoService.descargarWindowsJWT(formato04.codigo, nombreAdjunto);
    }
  }

  descargarItem(item){
    this.adjuntoService.descargarWindowsJWT(item.codigo, item.nombreReal);
  }

  subsanar(sol) {
    this.router.navigate([Link.EXTRANET, Link.SOLICITUDES_LIST, Link.SOLICITUDES_SUBSANAR, sol.solicitudUuid]);
  }

  obtenerNombre(item){
    if(item.tipoArchivo?.codigo == 'TA11') return 'Solicitud';
    if(item.tipoArchivo?.codigo == 'TA13') return 'Resultado Solicitud';
    if(item.tipoArchivo?.codigo == 'TA12') return 'Subsanación';
    if(item.tipoArchivo?.codigo == 'TA14') return 'Resultado Subsanación';
    return ""
  }

}
