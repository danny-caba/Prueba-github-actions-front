import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { ListadoDetalle } from 'src/app/interface/listado.model';
import { RequerimientoRenovacion } from 'src/app/interface/requerimiento-renovacion.model';
import { ParametriaService } from 'src/app/service/parametria.service';
import { RequerimientoRenovacionService } from 'src/app/service/requerimiento-renovacion.service';
import { BasePageComponent } from 'src/app/shared/components/base-page.component';
import { estadosPerfCont, estadosRequerimientoContrato , ListadoEnum } from 'src/helpers/constantes.components';
import { functionsAlert } from 'src/helpers/functionsAlert';
import { Link } from 'src/helpers/internal-urls.components';
import { ModalRequerimientoRenovacionCrearComponent } from '../modal-requerimiento-renovacion-crear/modal-requerimiento-renovacion-crear.component';
import { ContratoService } from 'src/app/service/contrato.service';
import { PropuestaService } from 'src/app/service/propuesta.service';
import { Propuesta } from 'src/app/interface/propuesta.model';
import { Solicitud } from 'src/app/interface/solicitud.model';
import { SolicitudSicoes } from 'src/app/interface/solicitud-sicoes.model';
import { Proceso } from 'src/app/interface/proceso.model';

@Component({
  selector: 'vex-requerimiento-renovacion-intranet-list',
  templateUrl: './requerimiento-renovacion-list.component.html',
  styleUrls: ['./requerimiento-renovacion-list.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})


export class RequerimientoRenovacionListComponent extends BasePageComponent<RequerimientoRenovacion> implements OnInit {
  displayedColumns: string[] = ['nuExpediente', 'tiSector', 'tiSubSector', 'noItem', 'fecCreacion','estado', 
    'estadoAprobacionInforme','estadoAprobacionGPPM','estadoAprobacionGSE', 'actions'];

  formGroup = this.fb.group({
    nuExpediente: [null],
    sector: [null],
    subsector: [null],
  });

  listSector: ListadoDetalle[]
  listSubSector: ListadoDetalle[]
  solicitudSicoes: SolicitudSicoes
  propuesta: Propuesta
  idSolicitud: string
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private requerimientoRenovacionService: RequerimientoRenovacionService,
    private contratoService: ContratoService,
    private propuestaService: PropuestaService,
    private parametriaService: ParametriaService,
    private soli: ParametriaService,
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) {
    super();
  }

  ngOnInit(): void {
    this.cargarCombo();
    this.obtenerDetalleSolicitud();
    this.formGroup.get('sector').valueChanges.subscribe(value => {
      this.onChangeSector(value)
    })
  }

  cargarCombo() {
    this.parametriaService.obtenerMultipleListadoDetalle([
      ListadoEnum.SECTOR,
    ]).subscribe(listRes => {
      this.listSector = listRes[0];
    })
  }

  puedeCrearRequerimiento(): boolean {
    
    // Validar que no existan requerimientos activos
    const sinRequerimientosActivos = this.dataSource?.data?.length === 0 || 
        this.dataSource?.data?.every(req => 
            req.estadoReqRenovacion?.codigo === 'CONCLUIDO' || 
            req.estadoReqRenovacion?.codigo === 'ARCHIVADO'
        );
    
    return sinRequerimientosActivos ;
}

  obtenerDetalleSolicitud() {
    this.idSolicitud = this.activatedRoute.snapshot.paramMap.get('idSolicitud');
    this.contratoService.obtenerSolicitudPorId(parseInt( this.idSolicitud)).subscribe(res => {
      this.solicitudSicoes = res;
      this.requerimientoRenovacionService.obtenerPropuesta(this.solicitudSicoes.propuesta.propuestaUuid).subscribe(res => {
        this.propuesta = res; 
        const sectorProceso = this.propuesta.procesoItem.proceso.sector;
        const sectorEncontrado = this.listSector.find(s => s.codigo === sectorProceso.codigo);
        if (sectorEncontrado) {
          this.formGroup.controls.sector.setValue(sectorEncontrado);
        }
      });
    });
    this.cargarTabla();
  }

  serviceTable(filtro: any) {
    return this.requerimientoRenovacionService.obtenerRequerimientos(filtro);
  }

  onChangeSector(obj) {
    if (!obj) return;
    this.formGroup.controls.subsector.setValue('');
    this.parametriaService.obtenerSubListado(ListadoEnum.SUBSECTOR, obj.idListadoDetalle).subscribe(res => {
      const subsectorProceso = this.propuesta.procesoItem.proceso.subsector;
      this.listSubSector = res.filter(subsector => 
        subsector.codigo === subsectorProceso.codigo
      );
      if (this.listSubSector.length > 0) {
          this.formGroup.controls.subsector.setValue(this.listSubSector[0]);
      }
    });
  }

  obtenerFiltro() {
    let filtro: any = {
      idSolicitud: this.idSolicitud,
      nuExpediente: this.formGroup.controls.nuExpediente.value,
      sector: this.formGroup.controls.sector.value?.codigo,
      subSector: this.formGroup.controls.subsector.value?.codigo,
    }
    return filtro;
  }

  goToBandejaSolicitudes() {
    this.router.navigate([Link.INTRANET, Link.CONTRATOS_LIST]);
  }

  goToFormInformeRenovacion(requerimiento: any, accion: string) {
    console.log(requerimiento)
    this.router.navigate([
      Link.INTRANET, 
      Link.REQUERIMIENTO_RENOVACION_LIST, 
      requerimiento.nuExpediente,
      Link.REQUERIMIENTO_RENOVACION_INFORME, 
      'new']);
  }

  goToFormEnviarInvitacion(requerimiento: any, accion: string) {
    console.log(requerimiento)
    this.router.navigate([
      Link.INTRANET, 
      Link.REQUERIMIENTO_RENOVACION_LIST, 
      requerimiento.nuExpediente,
      Link.REQUERIMIENTO_RENOVACION_INVITACION, 
      'new']);
  }

  limpiar() {
    this.formGroup.reset();
    this.buscar();
  }

  crearRequerimiento() {
    this.dialog.open(ModalRequerimientoRenovacionCrearComponent, {
      width: '1200px',
      maxHeight: '100%',
      data: {
       sector: this.propuesta.procesoItem.proceso.sector,
       subSector: this.propuesta.procesoItem.proceso.subsector,
       idSoliPerfCont: this.solicitudSicoes.idSolicitud,
       noItem: this.solicitudSicoes?.propuesta?.procesoItem?.descripcionItem
      },
    }).afterClosed().subscribe(() => {
      this.cargarTabla();
    });
  }

  estadoSolicitud(requerimiento: RequerimientoRenovacion): string {
    return estadosRequerimientoContrato[requerimiento?.estadoReqRenovacion] || "Otro";
  }

  buscar() {
    this.paginator.pageIndex = 0;
    this.cargarTabla();
  }

  formElaborarInforme(solicitud: any){
    const estadoInforme=solicitud.hasOwnProperty('estadoAprobacionInforme'); 
    return ! this.itemsTable.every(
      (item: RequerimientoRenovacion) =>
        item.estadoReqRenovacion?.codigo === 'CONCLUIDO' ||
        item.estadoReqRenovacion?.codigo === 'ARCHIVADO'
    ) && !estadoInforme;
  }

  formEnviarInvitacion(solicitud: any){
    const estado=solicitud?.estadoAprobacionInforme==='En Proceso';
    return ! this.itemsTable.every(
      (item: RequerimientoRenovacion) =>
        item.estadoReqRenovacion?.codigo === 'EN_PROCESO' ||
        item.estadoReqRenovacion?.codigo === 'ARCHIVADO'
    ) && estado;
  }
}
